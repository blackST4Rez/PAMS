import { createContext, useContext, useEffect, useState } from 'react';
import {
    SEED_ROLES,
    sanitizePermissions,
    generateRoleCode,
    ALL_PERMISSION_CODES,
} from '../mock/mockRoles';
import { logAuditEvent } from './AuditContext';

const RolesContext = createContext(null);

/* localStorage keys */
const LS = {
    roles: () => 'mock_roles',
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
        console.error('[RolesContext] localStorage write failed:', key, err);
        return false;
    }
};

export const RolesProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    /* ============ BOOT ============ */

    useEffect(() => {
        const stored = readJSON(LS.roles(), null);

        if (Array.isArray(stored) && stored.length > 0) {
            /*
              Merge: any seed role that's missing from stored gets added back.
              This handles the case where the code adds a new system role
              later and the user already has roles in localStorage.
            */
            const storedByCode = new Map(stored.map((r) => [r.code, r]));
            const merged = [...stored];

            for (const seed of SEED_ROLES) {
                if (!storedByCode.has(seed.code)) {
                    merged.push(seed);
                }
            }

            setRoles(merged);
            writeJSON(LS.roles(), merged);
        } else {
            setRoles(SEED_ROLES);
            writeJSON(LS.roles(), SEED_ROLES);
        }

        setLoading(false);
    }, []);

    /* ============ CROSS-TAB SYNC ============ */

    useEffect(() => {
        const onStorage = (e) => {
            if (!e.key) return;
            if (e.key === LS.roles()) {
                const next = readJSON(LS.roles(), []);
                setRoles(Array.isArray(next) ? next : []);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const persist = (nextRoles) => {
        setRoles(nextRoles);
        writeJSON(LS.roles(), nextRoles);
        setVersion((v) => v + 1);
    };

    /* ============ READS ============ */

    /*
      All roles, sorted with system roles first (in seed order),
      then custom roles alphabetically.
    */
    const allRoles = () => {
        const seedOrder = new Map(SEED_ROLES.map((r, i) => [r.code, i]));
        return [...roles].sort((a, b) => {
            const ai = seedOrder.has(a.code) ? seedOrder.get(a.code) : 999;
            const bi = seedOrder.has(b.code) ? seedOrder.get(b.code) : 999;
            if (ai !== bi) return ai - bi;
            return a.label.localeCompare(b.label);
        });
    };

    const getRole = (code) =>
        roles.find((r) => r.code === code) ?? null;

    const isSystemRole = (code) =>
        SEED_ROLES.some((r) => r.code === code);

    const isRoleInUse = (code, users = []) =>
        users.some((u) => (u.roles ?? []).includes(code));

    /* ============ WRITES ============ */

    const updateRolePermissions = (code, permissions, actor = 'unknown') => {
        const existing = roles.find((r) => r.code === code);
        if (!existing) throw new Error('Role not found');

        const cleaned = sanitizePermissions(permissions);
        const before = [...(existing.permissions ?? [])];
        const after = cleaned;

        /* Skip if nothing changed */
        const same =
            before.length === after.length &&
            before.every((p) => after.includes(p));
        if (same) return existing;

        const updated = { ...existing, permissions: cleaned };
        const next = roles.map((r) => (r.code === code ? updated : r));
        persist(next);

        logAuditEvent({
            entityType: 'role',
            entityId: code,
            action: 'UPDATE',
            actor,
            summary: `Updated permissions for role "${existing.label}"`,
            before: { permissions: before },
            after: { permissions: after },
        });

        return updated;
    };

    const createRole = ({ label, description, permissions }, actor = 'unknown') => {
        const trimmedLabel = String(label ?? '').trim();
        if (!trimmedLabel) throw new Error('Role name is required');

        const code = generateRoleCode(trimmedLabel);
        if (!code) throw new Error('Role name must contain letters or numbers');

        if (roles.some((r) => r.code === code)) {
            throw new Error(`A role with code "${code}" already exists`);
        }

        const newRole = {
            code,
            label: trimmedLabel,
            description: String(description ?? '').trim(),
            isSystem: false,
            permissions: sanitizePermissions(permissions),
        };

        persist([...roles, newRole]);

        logAuditEvent({
            entityType: 'role',
            entityId: code,
            action: 'CREATE',
            actor,
            summary: `Created role "${trimmedLabel}" (${code})`,
            before: null,
            after: {
                code,
                label: trimmedLabel,
                permissions: newRole.permissions,
            },
        });

        return newRole;
    };

    /*
      Delete a custom role.
      System roles cannot be deleted.
      Roles in use cannot be deleted (caller must check with isRoleInUse).
    */
    const deleteRole = (code, actor = 'unknown') => {
        const existing = roles.find((r) => r.code === code);
        if (!existing) throw new Error('Role not found');

        if (isSystemRole(code)) {
            throw new Error('System roles cannot be deleted');
        }

        persist(roles.filter((r) => r.code !== code));

        logAuditEvent({
            entityType: 'role',
            entityId: code,
            action: 'DELETE',
            actor,
            summary: `Deleted role "${existing.label}" (${code})`,
            before: {
                code,
                label: existing.label,
                permissions: existing.permissions,
            },
            after: null,
        });
    };

    /* ============ VALIDATION ============ */

    /*
      Given a role code, return the permission list currently
      associated with it. Falls back to an empty array.
    */
    const permissionsFor = (code) => {
        const role = roles.find((r) => r.code === code);
        return role?.permissions ?? [];
    };

    return (
        <RolesContext.Provider
            value={{
                loading,
                version,

                allRoles,
                getRole,
                isSystemRole,
                isRoleInUse,
                permissionsFor,

                updateRolePermissions,
                createRole,
                deleteRole,
            }}
        >
            {children}
        </RolesContext.Provider>
    );
};

export const useRoles = () => {
    const ctx = useContext(RolesContext);
    if (!ctx) throw new Error('useRoles must be used inside <RolesProvider>');
    return ctx;
};