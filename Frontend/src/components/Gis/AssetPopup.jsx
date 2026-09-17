import { formatNprShort } from '../mock/mockValuation';
import { getStatusMeta } from '../mock/mockAssets';

const AssetPopup = ({ asset }) => {
    if (!asset) return null;

    const statusMeta = getStatusMeta(asset.status);

    return (
        <div className="text-white" style={{ minWidth: '260px' }}>
            {/* Header — title + code */}
            <div className="px-4 pt-3 pb-3 border-b border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                    {asset.categoryName ?? '—'}
                </p>
                <p className="text-sm font-semibold text-white leading-snug">
                    {asset.title}
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                    {asset.assetCode}
                </p>
            </div>

            {/* Body — key/value rows */}
            <div className="px-4 py-3 space-y-2">
                <Row label="Ward" value={asset.wardName ?? '—'} />
                <Row
                    label="Status"
                    value={statusMeta.label}
                    valueClass={statusMeta.color}
                />
                <Row
                    label="Book Value"
                    value={formatNprShort(asset.currentBookValue)}
                />
            </div>
        </div>
    );
};

const Row = ({ label, value, valueClass = 'text-white' }) => (
    <div className="flex items-start justify-between gap-4">
        <span className="text-xs text-white/50 whitespace-nowrap">
            {label}
        </span>
        <span className={`text-xs font-medium text-right ${valueClass}`}>
            {value}
        </span>
    </div>
);

export default AssetPopup;