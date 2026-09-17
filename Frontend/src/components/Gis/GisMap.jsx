import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AssetPopup from './AssetPopup';
import {
    MAP_CENTER,
    MAP_DEFAULT_ZOOM,
    MAP_MIN_ZOOM,
    MAP_MAX_ZOOM,
    pinColorFor,
} from '../mock/mockGis';

/*
  Leaflet's default marker icon relies on asset imports that break under
  Vite. Rather than patch the defaults, we build a custom divIcon per
  marker — a colored circle.
*/
const buildDivIcon = (color, isRetired) => {
    const fill = isRetired ? '#6b7280' : color;
    const ring = isRetired ? '#374151' : color;

    return L.divIcon({
        className: 'custom-pin',
        html: `
            <div style="
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background-color: ${fill};
                border: 2px solid ${ring};
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                opacity: ${isRetired ? 0.6 : 1};
            "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -9],
    });
};

/*
  Fit the map bounds to the currently visible markers when they change.
*/
const FitBounds = ({ assets }) => {
    const map = useMap();

    useEffect(() => {
        if (!assets || assets.length === 0) return;

        if (assets.length === 1) {
            map.setView(assets[0].coords, MAP_DEFAULT_ZOOM);
            return;
        }

        const bounds = L.latLngBounds(assets.map((a) => a.coords));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }, [assets, map]);

    return null;
};

const GisMap = ({ assets }) => {
    return (
        <div
            className="relative rounded-xl overflow-hidden border border-white/10"
            style={{ height: '70vh' }}
        >
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_DEFAULT_ZOOM}
                minZoom={MAP_MIN_ZOOM}
                maxZoom={MAP_MAX_ZOOM}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                {/* OpenStreetMap standard tiles */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <FitBounds assets={assets} />

                {assets.map((a) => {
                    const isRetired = a.status === 'RETIRED';
                    const icon = buildDivIcon(pinColorFor(a.categoryId), isRetired);

                    return (
                        <Marker key={a.id} position={a.coords} icon={icon}>
                            <Popup>
                                <AssetPopup asset={a} />
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Empty-state overlay when no assets match filters */}
            {assets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-500">
                    <div className="bg-[#242424]/95 border border-white/10 rounded-lg px-6 py-4">
                        <p className="text-white/70 text-sm">
                            No assets match the current filters.
                        </p>
                    </div>
                </div>
            )}

            {/* Scoped CSS for Leaflet UI elements */}
            <style>{`
                .custom-pin {
                    background: transparent;
                    border: none;
                }
                .leaflet-popup-content-wrapper {
                    background: #242424;
                    color: white;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 0;
                    min-width: 260px;
                }
                .leaflet-popup-tip {
                    background: #242424;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-popup-close-button {
                    color: rgba(255,255,255,0.6);
                    padding: 8px 8px 0 0;
                }
                .leaflet-popup-close-button:hover {
                    color: #fff;
                }
                .leaflet-control-zoom a {
                    background-color: #242424;
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-control-zoom a:hover {
                    background-color: #1a1a1a;
                }
                .leaflet-control-attribution {
                    background: rgba(36, 36, 36, 0.85) !important;
                    color: rgba(255, 255, 255, 0.6);
                }
                .leaflet-control-attribution a {
                    color: rgba(255, 255, 255, 0.8);
                }
            `}</style>
        </div>
    );
};

export default GisMap;