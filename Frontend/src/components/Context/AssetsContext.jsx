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

  /*
    Boot effect: hydrate assets + lifecycle from localStorage.
    If localStorage is empty (first ever load), seed from the mock file
    and immediately persist so subsequent loads read from storage.
  */
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

  /*
    Cross-tab sync — when another tab writes to our keys, refresh here.
    Matches the pattern in AuthContext.
  */
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

  /* Persist both arrays together, keeping state and storage in sync */
  const persist = (nextAssets, nextLifecycle) => {
    setAssets(nextAssets);
    setLifecycle(nextLifecycle);
    writeJSON(LS.assets(), nextAssets);
    writeJSON(LS.lifecycle(), nextLifecycle);
    setVersion((v) => v + 1);
  };

  /* Append a lifecycle event to the array + persist */
  const appendLifecycle = (list, entry) => [entry, ...list];

  /*
    Build a lifecycle entry object.
    type: CREATED | UPDATED | APPROVED | REJECTED | DELETED
  */
  const makeLifecycleEntry = (assetId, type, by, note) => ({
    id: makeId('lc'),
    assetId,
    type,
    at: new Date().toISOString(),
    by: by ?? 'unknown',
    note: note ?? '',
  });

  /* ===== READ ===== */

  /*
    allAssets() — every asset, newest first, with category/ward joined in
    for display. Includes deleted ones unless `includeDeleted` is false.
  */
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

    /* Newest first — by createdAt desc */
    return rows.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  /* getAsset(id) — one asset, joined with its lifecycle */
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

  /*
    addAsset(payload) — creates a new asset in AWAITING_REVIEW status.
    Generates the assetCode from the category code + existing assets.
    Appends a CREATED lifecycle event.
  */
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

    return newAsset;
  };

  /*
    updateAsset(id, patch) — merges patch into the existing asset.
    Appends an UPDATED lifecycle event with a short summary of what changed.
  */
  const updateAsset = (id, patch) => {
    const existing = assets.find((a) => a.id === id);
    if (!existing) throw new Error('Asset not found');

    const updated = { ...existing, ...patch };

    /* Build a human-readable note: which fields changed */
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

    return updated;
  };

  /*
    updateAssetValues(pairs) — bulk update book values for many assets
    in one write. Used by the Valuation module when running depreciation
    across the register.

    `pairs` is an array of { id, currentBookValue }.
    Assets not present in the array are left untouched.

    No lifecycle events are appended for value updates — the depreciation
    run or revaluation record in ValuationContext is the audit trail.
  */
  const updateAssetValues = (pairs) => {
    if (!Array.isArray(pairs) || pairs.length === 0) return;

    const byId = new Map(pairs.map((p) => [p.id, p.currentBookValue]));

    const next = assets.map((a) => {
      if (!byId.has(a.id)) return a;
      return { ...a, currentBookValue: byId.get(a.id) };
    });

    persist(next, lifecycle);
  };

  /*
    softDeleteAsset(id, by) — sets deletedAt, appends a DELETED event.
    The asset stays in storage but is filtered out of normal lists.
  */
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

    return { ...existing, deletedAt };
  };

  /*
    approveAsset(id, by) — AWAITING_REVIEW → ACTIVE.
    Appends an APPROVED event.
  */
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

    return { ...existing, status: 'ACTIVE' };
  };

  /*
    rejectAsset(id, reason, by) — AWAITING_REVIEW → CANCELLED.
    Appends a REJECTED event with the reason as the note.
  */
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

        /* reads */
        allAssets,
        getAsset,

        /* writes */
        addAsset,
        updateAsset,
        updateAssetValues,
        softDeleteAsset,
        approveAsset,
        rejectAsset,

        /* reference data */
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