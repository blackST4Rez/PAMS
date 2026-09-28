// src/mock/mockGis.js
//
// GIS coordinates for seed assets + map defaults.
//
// Gaurishankar Rural Municipality is in Dolakha district, Bagmati Province,
// Nepal. Its approximate center is 27.75°N, 86.35°E. The municipality spans
// roughly 0.15° in each direction, so coordinates below are placed within
// that bounding box.
//
// Two coordinate systems coexist here:
//   • ASSET_COORDINATES — a single [lat, lng] per asset. Used for point
//     markers (vehicles, portable equipment).
//   • ASSET_POLYGONS    — an ordered array of [lat, lng] pairs tracing the
//     boundary of a parcel. Used for assets with a real footprint:
//     buildings, land parcels, roads, and infrastructure.
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
   POINT COORDINATES
   Used for point markers only. Polygon assets (buildings, roads,
   land, infrastructure) render as shapes and don't rely on these.
   ============================================================ */
export const ASSET_COORDINATES = {
    // Vehicles — movable
    'a-002': [27.748, 86.340],  // Fire Truck #1 — fire station, Ward 2
    'a-005': [27.735, 86.328],  // School Bus #3 — Ward 1 (retired)

    // Portable equipment — movable
    'a-009': [27.752, 86.353],  // New Office Printer — inside Town Hall
};

/* ============================================================
   POLYGON FOOTPRINTS
   Ordered [lat, lng] arrays tracing the parcel boundary. The
   array closes back to the first point implicitly.

   Each polygon is drawn with a category-colored outline and
   translucent fill. The centroid anchors the popup.
   ============================================================ */
export const ASSET_POLYGONS = {
    /* ---------- BUILDINGS ---------- */

    // Town Hall Building — Ward 3. Rectangular building footprint.
    'a-001': [
        [27.7528, 86.3512],
        [27.7528, 86.3532],
        [27.7516, 86.3532],
        [27.7516, 86.3512],
    ],

    // Community Center — Ward 3. L-shaped footprint.
    'a-004': [
        [27.7558, 86.3568],
        [27.7558, 86.3592],
        [27.7542, 86.3592],
        [27.7542, 86.3585],
        [27.7548, 86.3585],
        [27.7548, 86.3568],
    ],

    // Ward 4 Health Post — Ward 4. Compact rectangular building.
    'a-010': [
        [27.7486, 86.3610],
        [27.7486, 86.3628],
        [27.7474, 86.3628],
        [27.7474, 86.3610],
    ],

    /* ---------- LAND ---------- */

    // Ward 5 Public Park Land — Ward 5. Large irregular parcel.
    'a-007': [
        [27.7594, 86.3456],
        [27.7601, 86.3470],
        [27.7596, 86.3489],
        [27.7578, 86.3496],
        [27.7565, 86.3483],
        [27.7566, 86.3465],
        [27.7580, 86.3454],
    ],

    /* ---------- ROADS ---------- */
    // Roads are modeled as thin elongated polygons — a strip of
    // right-of-way. Real road geometry would use actual survey lines.

    // Ward 1 Road Section — Ward 1. Long east-west strip.
    'a-006': [
        [27.7379, 86.3288],
        [27.7380, 86.3312],
        [27.7374, 86.3312],
        [27.7373, 86.3288],
    ],

    /* ---------- INFRASTRUCTURE ---------- */
    // Infrastructure sites (treatment plants, pump stations) have
    // a real fenced footprint.

    // Water Treatment Plant — Ward 7. Large site footprint.
    'a-003': [
        [27.7645, 86.3738],
        [27.7645, 86.3762],
        [27.7632, 86.3762],
        [27.7632, 86.3738],
    ],

    // Ward 7 Water Pump — Ward 7. Small pump-station footprint.
    'a-008': [
        [27.7684, 86.3796],
        [27.7684, 86.3804],
        [27.7678, 86.3804],
        [27.7678, 86.3796],
    ],
};

/* ============================================================
   AREA (sqm) — optional metadata for polygon assets.
   Shown in the popup for parcels where a size is meaningful.
   ============================================================ */
export const ASSET_AREAS = {
    // Buildings
    'a-001': 640,
    'a-004': 1280,
    'a-010': 480,

    // Land
    'a-007': 4200,

    // Roads
    'a-006': 960,

    // Infrastructure
    'a-003': 3200,
    'a-008': 120,
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

/* ============================================================
   HELPERS
   ============================================================ */

/*
  Get the pin color for an asset — by its categoryId.
*/
export const pinColorFor = (categoryId) =>
    CATEGORY_PIN_COLORS[categoryId] ?? DEFAULT_PIN_COLOR;

/*
  Get the point coordinate for an asset — by its assetId.
  Returns [lat, lng] or null if not seeded.

  Polygon assets don't need a point coordinate; only point-marker
  assets (vehicles, portable equipment) rely on this.
*/
export const coordsForAsset = (assetId) =>
    ASSET_COORDINATES[assetId] ?? null;

/*
  Get the polygon footprint for an asset — by its assetId.
  Returns an array of [lat, lng] pairs or null if not seeded.
*/
export const polygonForAsset = (assetId) =>
    ASSET_POLYGONS[assetId] ?? null;

/*
  Get the recorded area for an asset — by its assetId.
  Returns a number (square meters) or null.
*/
export const areaForAsset = (assetId) =>
    ASSET_AREAS[assetId] ?? null;

/*
  Compute the centroid of a polygon (array of [lat, lng] pairs).
  Used to anchor popups and to place a marker at the parcel's center.
  Simple average of vertices — accurate enough for small parcels.
*/
export const polygonCentroid = (polygon) => {
    if (!Array.isArray(polygon) || polygon.length === 0) return null;
    let latSum = 0;
    let lngSum = 0;
    for (const [lat, lng] of polygon) {
        latSum += lat;
        lngSum += lng;
    }
    return [latSum / polygon.length, lngSum / polygon.length];
};