import { createContext, useContext, useEffect, useState } from 'react';
import {
  MOCK_ASSETS,
  MOCK_ASSET_LIFECYCLE,
  MOCK_ASSET_CATEGORIES,
  MOCK_WARDS,
  MOCK_MUNICIPALITY,
  generateAssetCode,
  getCategoryById,
  getWardById,
  getStatusMeta,
} from '../mock/mockAssets';
import { logAuditEvent } from './AuditContext';

/* Create the assets context */
const AssetsContext = createContext(null);

/* localStorage keys — all under one namespace */
const LS = {
  assets: () => 'mock_assets',
  lifecycle: () => 'mock_asset_lifecycle',
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
  } catch {
    /* quota exceeded or private mode — ignore */
  }
};

/* Small unique id — enough for client-side keys */
const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [lifecycle, setLifecycle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const storedAssets = readJSON(LS.assets(), null);
    const storedLifecycle = readJSON(LS.lifecycle(), null);

    if (Array.isArray(storedAssets) && storedAssets.length > 0) {
      setAssets(storedAssets);
      setLifecycle(Array.isArray(storedLifecycle) ? storedLifecycle : []);
    } else {
      setAssets(MOCK_ASSETS);
      setLifecycle(MOCK_ASSET_LIFECYCLE);
      writeJSON(LS.assets(), MOCK_ASSETS);
      writeJSON(LS.lifecycle(), MOCK_ASSET_LIFECYCLE);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;

      if (e.key === LS.assets()) {
        const next = readJSON(LS.assets(), []);
        setAssets(Array.isArray(next) ? next : []);
      } else if (e.key === LS.lifecycle()) {
        const next = readJSON(LS.lifecycle(), []);
        setLifecycle(Array.isArray(next) ? next : []);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = (nextAssets, nextLifecycle) => {
    setAssets(nextAssets);
    setLifecycle(nextLifecycle);
    writeJSON(LS.assets(), nextAssets);
    writeJSON(LS.lifecycle(), nextLifecycle);
    setVersion((v) => v + 1);
  };

  const appendLifecycle = (list, entry) => [entry, ...list];

  const makeLifecycleEntry = (assetId, type, by, note) => ({
    id: makeId('lc'),
    assetId,
    type,
    at: new Date().toISOString(),
    by: by ?? 'unknown',
    note: note ?? '',
  });

  /* ===== READ ===== */

  const allAssets = ({ includeDeleted = false } = {}) => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    const rows = assets
      .filter((a) => includeDeleted || !a.deletedAt)
      .map((a) => {
        const cat = getCategoryById(a.categoryId);
        const ward = getWardById(a.wardId);
        return {
          ...a,
          categoryName: cat?.name ?? '—',
          categoryCode: cat?.code ?? '—',
          wardName: ward?.name ?? '—',
          statusMeta: getStatusMeta(a.status),
        };
      });

    return rows.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const getAsset = (id) => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    const a = assets.find((x) => x.id === id);
    if (!a) return null;

    const cat = getCategoryById(a.categoryId);
    const ward = getWardById(a.wardId);

    const history = lifecycle
      .filter((l) => l.assetId === id)
      .sort((x, y) => new Date(y.at) - new Date(x.at));

    return {
      ...a,
      categoryName: cat?.name ?? '—',
      categoryCode: cat?.code ?? '—',
      wardName: ward?.name ?? '—',
      statusMeta: getStatusMeta(a.status),
      lifecycle: history,
    };
  };

  /* ===== WRITE ===== */

  const addAsset = (payload) => {
    const category = getCategoryById(payload.categoryId);
    if (!category) throw new Error('Category not found');

    const assetCode = generateAssetCode(category.code, assets);

    const newAsset = {
      id: makeId('a'),
      assetCode,
      title: payload.title,
      description: payload.description ?? '',
      categoryId: payload.categoryId,
      wardId: payload.wardId,
      municipalityId: MOCK_MUNICIPALITY.id,
      acquisitionDate: payload.acquisitionDate,
      acquisitionCost: Number(payload.acquisitionCost) || 0,
      currentBookValue: Number(payload.acquisitionCost) || 0,
      depreciationMethod: payload.depreciationMethod,
      usefulLifeYears: payload.usefulLifeYears
        ? Number(payload.usefulLifeYears)
        : null,
      status: 'AWAITING_REVIEW',
      createdBy: payload.createdBy ?? 'unknown',
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    const entry = makeLifecycleEntry(
      newAsset.id,
      'CREATED',
      newAsset.createdBy,
      'Registered'
    );

    persist(
      [newAsset, ...assets],
      appendLifecycle(lifecycle, entry)
    );

    logAuditEvent({
      entityType: 'asset',
      entityId: newAsset.id,
      action: 'CREATE',
      actor: newAsset.createdBy,
      summary: `Registered new asset "${newAsset.title}" (${newAsset.assetCode})`,
      before: null,
      after: {
        assetCode: newAsset.assetCode,
        title: newAsset.title,
        categoryId: newAsset.categoryId,
        acquisitionCost: newAsset.acquisitionCost,
        status: newAsset.status,
      },
    });

    return newAsset;
  };

  const updateAsset = (id, patch) => {
    const existing = assets.find((a) => a.id === id);
    if (!existing) throw new Error('Asset not found');

    const updated = { ...existing, ...patch };

    const changed = Object.keys(patch).filter(
      (k) => patch[k] !== existing[k]
    );
    const note = changed.length
      ? `Updated: ${changed.join(', ')}`
      : 'Updated';

    const entry = makeLifecycleEntry(
      id,
      'UPDATED',
      patch.updatedBy ?? 'unknown',
      note
    );

    persist(
      assets.map((a) => (a.id === id ? updated : a)),
      appendLifecycle(lifecycle, entry)
    );

    /*
      Build before/after snapshots from only the changed keys.
    */
    const before = {};
    const after = {};
    for (const k of changed) {
      before[k] = existing[k];
      after[k] = patch[k];
    }

    if (changed.length > 0) {
      logAuditEvent({
        entityType: 'asset',
        entityId: id,
        action: 'UPDATE',
        actor: patch.updatedBy ?? 'unknown',
        summary: `Updated asset "${existing.title}" — ${changed.join(', ')}`,
        before,
        after,
      });
    }

    return updated;
  };

  const updateAssetValues = (pairs) => {
    if (!Array.isArray(pairs) || pairs.length === 0) return;

    const byId = new Map(pairs.map((p) => [p.id, p.currentBookValue]));

    const next = assets.map((a) => {
      if (!byId.has(a.id)) return a;
      return { ...a, currentBookValue: byId.get(a.id) };
    });

    persist(next, lifecycle);
    /*
      Note: no audit event per asset here.
      The Valuation module logs a single RUN event covering the whole batch.
    */
  };

  const softDeleteAsset = (id, by) => {
    const existing = assets.find((a) => a.id === id);
    if (!existing) throw new Error('Asset not found');

    const deletedAt = new Date().toISOString();

    const entry = makeLifecycleEntry(
      id,
      'DELETED',
      by ?? 'unknown',
      'Soft-deleted'
    );

    persist(
      assets.map((a) => (a.id === id ? { ...a, deletedAt } : a)),
      appendLifecycle(lifecycle, entry)
    );

    logAuditEvent({
      entityType: 'asset',
      entityId: id,
      action: 'DELETE',
      actor: by ?? 'unknown',
      summary: `Soft-deleted asset "${existing.title}" (${existing.assetCode})`,
      before: { deletedAt: null, status: existing.status },
      after: { deletedAt },
    });

    return { ...existing, deletedAt };
  };

  const approveAsset = (id, by) => {
    const existing = assets.find((a) => a.id === id);
    if (!existing) throw new Error('Asset not found');
    if (existing.status !== 'AWAITING_REVIEW') {
      throw new Error('Only assets in Awaiting Review can be approved');
    }

    const entry = makeLifecycleEntry(
      id,
      'APPROVED',
      by ?? 'unknown',
      'Approved'
    );

    persist(
      assets.map((a) => (a.id === id ? { ...a, status: 'ACTIVE' } : a)),
      appendLifecycle(lifecycle, entry)
    );

    logAuditEvent({
      entityType: 'asset',
      entityId: id,
      action: 'APPROVE',
      actor: by ?? 'unknown',
      summary: `Approved asset "${existing.title}" (${existing.assetCode})`,
      before: { status: 'AWAITING_REVIEW' },
      after: { status: 'ACTIVE' },
    });

    return { ...existing, status: 'ACTIVE' };
  };

  const rejectAsset = (id, reason, by) => {
    const existing = assets.find((a) => a.id === id);
    if (!existing) throw new Error('Asset not found');
    if (existing.status !== 'AWAITING_REVIEW') {
      throw new Error('Only assets in Awaiting Review can be rejected');
    }

    const entry = makeLifecycleEntry(
      id,
      'REJECTED',
      by ?? 'unknown',
      reason ?? 'Rejected'
    );

    persist(
      assets.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)),
      appendLifecycle(lifecycle, entry)
    );

    logAuditEvent({
      entityType: 'asset',
      entityId: id,
      action: 'REJECT',
      actor: by ?? 'unknown',
      summary: `Rejected asset "${existing.title}" (${existing.assetCode}) — ${reason ?? 'no reason'}`,
      before: { status: 'AWAITING_REVIEW' },
      after: { status: 'CANCELLED', reason: reason ?? '' },
    });

    return { ...existing, status: 'CANCELLED' };
  };

  /* ===== REFERENCE DATA ===== */

  const allCategories = () => MOCK_ASSET_CATEGORIES;
  const allWards = () => MOCK_WARDS;
  const municipality = () => MOCK_MUNICIPALITY;

  return (
    <AssetsContext.Provider
      value={{
        loading,

        allAssets,
        getAsset,

        addAsset,
        updateAsset,
        updateAssetValues,
        softDeleteAsset,
        approveAsset,
        rejectAsset,

        allCategories,
        allWards,
        municipality,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const ctx = useContext(AssetsContext);
  if (!ctx) throw new Error('useAssets must be used inside <AssetsProvider>');
  return ctx;
};