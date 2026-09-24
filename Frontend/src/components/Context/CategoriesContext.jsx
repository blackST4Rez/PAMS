import { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_ASSET_CATEGORIES } from '../mock/mockAssets';
import { logAuditEvent } from './AuditContext';

const CategoriesContext = createContext(null);

const LS = {
    categories: () => 'mock_categories',
};

const readJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        console.error('[CategoriesContext] localStorage write failed:', key, err);
        return false;
    }
};

/*
  Sanitize a category name into a 2–5 char uppercase code for the asset-code
  prefix. "Solar Panel" → "SOL". Falls back to "CAT" if nothing usable.
*/
const deriveCode = (name) => {
    const cleaned = String(name ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, ' ')
        .trim();
    if (!cleaned) return 'CAT';
    const words = cleaned.split(/\s+/);
    if (words.length === 1) {
        return words[0].slice(0, 3).padEnd(3, 'X');
    }
    return words
        .map((w) => w[0])
        .join('')
        .slice(0, 4)
        .padEnd(3, 'X');
};

/*
  Check whether a category code is already taken, ignoring a
  specific id (so editing a category doesn't conflict with itself).
*/
const isCodeTaken = (list, code, ignoreId = null) =>
    list.some(
        (c) => c.code === code && c.id !== ignoreId
    );

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    /* ============ BOOT ============ */

    useEffect(() => {
        const stored = readJSON(LS.categories(), null);

        if (Array.isArray(stored) && stored.length > 0) {
            /*
              Merge: any seed category missing from storage gets added back.
              This handles the case where the code ships a new default
              category and the user already has categories in localStorage.
            */
            const storedById = new Map(stored.map((c) => [c.id, c]));
            const merged = [...stored];
            for (const seed of MOCK_ASSET_CATEGORIES) {
                if (!storedById.has(seed.id)) {
                    merged.push(seed);
                }
            }
            setCategories(merged);
            writeJSON(LS.categories(), merged);
        } else {
            setCategories(MOCK_ASSET_CATEGORIES);
            writeJSON(LS.categories(), MOCK_ASSET_CATEGORIES);
        }

        setLoading(false);
    }, []);

    /* ============ CROSS-TAB SYNC ============ */

    useEffect(() => {
        const onStorage = (e) => {
            if (!e.key) return;
            if (e.key === LS.categories()) {
                const next = readJSON(LS.categories(), []);
                setCategories(Array.isArray(next) ? next : []);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const persist = (next) => {
        setCategories(next);
        writeJSON(LS.categories(), next);
        setVersion((v) => v + 1);
    };

    /* ============ READS ============ */

    /*
      All categories, sorted with active ones first (in their original
      order) and deactivated ones at the end.
    */
    const allCategories = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        const active = categories.filter((c) => !c.deactivatedAt);
        const inactive = categories.filter((c) => c.deactivatedAt);
        return [...active, ...inactive];
    };

    const getCategoryById = (id) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return categories.find((c) => c.id === id) ?? null;
    };

    const isCategoryInUse = (id, assets = []) =>
        assets.some((a) => a.categoryId === id && !a.deletedAt);

    /* ============ WRITES ============ */

    const addCategory = (payload, actor = 'unknown') => {
        const trimmedName = String(payload?.name ?? '').trim();
        if (!trimmedName) throw new Error('Category name is required');

        /* Derive a code if none was supplied; otherwise sanitize it */
        const rawCode = String(payload?.code ?? '').trim();
        const code = rawCode
            ? rawCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
            : deriveCode(trimmedName);
        if (!code) throw new Error('Category code is required');

        if (isCodeTaken(categories, code)) {
            throw new Error(`Category code "${code}" is already in use`);
        }

        const newCategory = {
            id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            code,
            name: trimmedName,
            defaultDepreciationMethod:
                payload?.defaultDepreciationMethod ?? 'STRAIGHT_LINE',
            usefulLifeYears:
                payload?.usefulLifeYears != null
                    ? Number(payload.usefulLifeYears)
                    : null,
            deactivatedAt: null,
            createdAt: new Date().toISOString(),
        };

        persist([...categories, newCategory]);

        logAuditEvent({
            entityType: 'category',
            entityId: newCategory.id,
            action: 'CREATE',
            actor,
            summary: `Created category "${newCategory.name}" (${newCategory.code})`,
            before: null,
            after: {
                code: newCategory.code,
                name: newCategory.name,
                defaultDepreciationMethod: newCategory.defaultDepreciationMethod,
                usefulLifeYears: newCategory.usefulLifeYears,
            },
        });

        return newCategory;
    };

    const updateCategory = (id, patch, actor = 'unknown') => {
        const existing = categories.find((c) => c.id === id);
        if (!existing) throw new Error('Category not found');

        /* Guard code uniqueness if it's being changed */
        if (patch.code != null) {
            const nextCode = String(patch.code)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 6);
            if (!nextCode) throw new Error('Category code cannot be empty');
            if (isCodeTaken(categories, nextCode, id)) {
                throw new Error(`Category code "${nextCode}" is already in use`);
            }
            patch = { ...patch, code: nextCode };
        }

        if (patch.name != null && !String(patch.name).trim()) {
            throw new Error('Category name cannot be empty');
        }

        const updated = { ...existing, ...patch };
        if (patch.name != null) updated.name = String(patch.name).trim();
        if (patch.usefulLifeYears != null) {
            updated.usefulLifeYears = Number(patch.usefulLifeYears) || null;
        }

        /* Only compare fields that changed */
        const changedKeys = Object.keys(patch).filter((k) => {
            if (k === 'usefulLifeYears') {
                return (
                    (Number(patch.usefulLifeYears) || null) !==
                    (existing.usefulLifeYears ?? null)
                );
            }
            return patch[k] !== existing[k];
        });

        if (changedKeys.length === 0) return existing;

        persist(categories.map((c) => (c.id === id ? updated : c)));

        const before = {};
        const after = {};
        for (const k of changedKeys) {
            before[k] = existing[k];
            after[k] = updated[k];
        }

        logAuditEvent({
            entityType: 'category',
            entityId: id,
            action: 'UPDATE',
            actor,
            summary: `Updated category "${existing.name}" — ${changedKeys.join(', ')}`,
            before,
            after,
        });

        return updated;
    };

    /*
      Deactivate (soft-off) — category stays in storage but is hidden
      from pickers and marked inactive. Use when it's referenced by
      existing assets but you don't want it selectable anymore.
    */
    const deactivateCategory = (id, actor = 'unknown') => {
        const existing = categories.find((c) => c.id === id);
        if (!existing) throw new Error('Category not found');
        if (existing.deactivatedAt) return existing;

        const updated = {
            ...existing,
            deactivatedAt: new Date().toISOString(),
        };
        persist(categories.map((c) => (c.id === id ? updated : c)));

        logAuditEvent({
            entityType: 'category',
            entityId: id,
            action: 'UPDATE',
            actor,
            summary: `Deactivated category "${existing.name}" (${existing.code})`,
            before: { deactivatedAt: null },
            after: { deactivatedAt: updated.deactivatedAt },
        });

        return updated;
    };

    const reactivateCategory = (id, actor = 'unknown') => {
        const existing = categories.find((c) => c.id === id);
        if (!existing) throw new Error('Category not found');
        if (!existing.deactivatedAt) return existing;

        const updated = { ...existing, deactivatedAt: null };
        persist(categories.map((c) => (c.id === id ? updated : c)));

        logAuditEvent({
            entityType: 'category',
            entityId: id,
            action: 'UPDATE',
            actor,
            summary: `Reactivated category "${existing.name}" (${existing.code})`,
            before: { deactivatedAt: existing.deactivatedAt },
            after: { deactivatedAt: null },
        });

        return updated;
    };

    /*
      Hard delete — only allowed when no active assets reference the
      category. The caller passes the current asset list; the context
      doesn't read AssetsContext directly to avoid a cycle.
    */
    const deleteCategory = (id, actor = 'unknown', assetsInUse = []) => {
        const existing = categories.find((c) => c.id === id);
        if (!existing) throw new Error('Category not found');

        const stillUsed = assetsInUse.some(
            (a) => a.categoryId === id && !a.deletedAt
        );
        if (stillUsed) {
            throw new Error(
                'This category is used by existing assets. Deactivate it instead.'
            );
        }

        persist(categories.filter((c) => c.id !== id));

        logAuditEvent({
            entityType: 'category',
            entityId: id,
            action: 'DELETE',
            actor,
            summary: `Deleted category "${existing.name}" (${existing.code})`,
            before: {
                code: existing.code,
                name: existing.name,
                defaultDepreciationMethod: existing.defaultDepreciationMethod,
                usefulLifeYears: existing.usefulLifeYears,
            },
            after: null,
        });
    };

    return (
        <CategoriesContext.Provider
            value={{
                loading,
                version,

                allCategories,
                getCategoryById,
                isCategoryInUse,

                addCategory,
                updateCategory,
                deactivateCategory,
                reactivateCategory,
                deleteCategory,
            }}
        >
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    const ctx = useContext(CategoriesContext);
    if (!ctx) {
        throw new Error('useCategories must be used inside <CategoriesProvider>');
    }
    return ctx;
};