import { MOCK_ASSET_CATEGORIES } from '../mock/mockAssets';
import { pinColorFor } from '../mock/mockGis';

const GisLegend = () => {
    return (
        <div className="absolute bottom-4 right-4 z-400 bg-[#1c1c1c]/95 border border-white/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Category
            </p>
            <div className="space-y-1.5">
                {MOCK_ASSET_CATEGORIES.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: pinColorFor(c.id) }}
                        />
                        <span className="text-xs text-white/80 whitespace-nowrap">
                            {c.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-2.5" />

            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Status
            </p>
            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: '#6b7280', opacity: 0.6 }}
                />
                <span className="text-xs text-white/80 whitespace-nowrap">
                    Retired
                </span>
            </div>
        </div>
    );
};

export default GisLegend;