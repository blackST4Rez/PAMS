// src/mock/mockGis.js
//
// GIS coordinates for seed assets + map defaults.
//
// Gaurishankar Rural Municipality is in Dolakha district, Bagmati Province,
// Nepal. Its approximate center is 27.75°N, 86.35°E. The municipality spans
// roughly 0.15° in each direction, so coordinates below are placed within
// that bounding box.
//
// These are approximate positions for demonstration — not surveyed
// coordinates. Adjust freely.

/* ============================================================
   MAP DEFAULTS
   ============================================================ */
export const MAP_CENTER = [27.75, 86.35];
export const MAP_DEFAULT_ZOOM = 12;
export const MAP_MIN_ZOOM = 10;
export const MAP_MAX_ZOOM = 18;

/* Bounding box for the municipality — used to clamp views if desired */
export const MUNICIPALITY_BOUNDS = {
    north: 27.83,
    south: 27.67,
    east: 86.43,
    west: 86.27,
};

/* ============================================================
   COORDINATES FOR SEED ASSETS
   Keyed by assetId. Each entry is [lat, lng].
   ============================================================ */
export const ASSET_COORDINATES = {
    'a-001': [27.752, 86.352],  // Town Hall Building — near center
    'a-002': [27.748, 86.340],  // Fire Truck #1 — fire station, Ward 2
    'a-003': [27.764, 86.375],  // Water Treatment Plant — Ward 7
    'a-004': [27.755, 86.358],  // Community Center — Ward 3
    'a-005': [27.735, 86.328],  // School Bus #3 — Ward 1 (retired)
    'a-006': [27.738, 86.330],  // Ward 1 Road Section
    'a-007': [27.758, 86.348],  // Ward 5 Public Park Land
    'a-008': [27.768, 86.380],  // Ward 7 Water Pump
    'a-009': [27.752, 86.353],  // New Office Printer — inside Town Hall
    'a-010': [27.748, 86.362],  // Ward 4 Health Post
};

/* ============================================================
   CATEGORY → PIN COLOR
   Matches the color palette used in the Reports and Stats widgets.
   ============================================================ */
export const CATEGORY_PIN_COLORS = {
    'cat-land': '#22c55e', // green
    'cat-building': '#3b82f6', // blue
    'cat-road': '#f97316', // orange
    'cat-vehicle': '#eab308', // yellow
    'cat-infrastructure': '#a855f7', // purple
    'cat-equipment': '#ef4444', // red
};

/* Fallback if a category isn't in the map above */
export const DEFAULT_PIN_COLOR = '#6b7280'; // gray

/*
  Get the pin color for an asset — by its categoryId.
*/
export const pinColorFor = (categoryId) =>
    CATEGORY_PIN_COLORS[categoryId] ?? DEFAULT_PIN_COLOR;

/*
  Get coordinates for an asset — by its assetId.
  Returns [lat, lng] or null if not seeded.
*/
export const coordsForAsset = (assetId) =>
    ASSET_COORDINATES[assetId] ?? null;