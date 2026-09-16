import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useValuation } from '../Context/ValuationContext';
import { formatNprShort } from '../mock/mockValuation';

const RevalueModal = ({ assetId, onClose, onSaved }) => {
    const { user } = useAuth();
    const { getAsset, updateAssetValues } = useAssets();
    const { revalueAsset } = useValuation();

    const asset = getAsset(assetId);

    const [newValue, setNewValue] = useState(
        asset ? String(asset.currentBookValue ?? '') : ''
    );
    const [reason, setReason] = useState('');
    const [busy, setBusy] = useState(false);

    if (!asset) return null;

    const currentValue = Number(asset.currentBookValue) || 0;
    const numericNew = Number(newValue);
    const delta =
        Number.isFinite(numericNew) && newValue !== ''
            ? numericNew - currentValue
            : 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        if (newValue === '' || !Number.isFinite(numericNew)) {
            toast.error('Please enter a valid number');
            return;
        }
        if (numericNew < 0) {
            toast.error('New value must be zero or positive');
            return;
        }
        if (!reason.trim()) {
            toast.error('Please provide a reason for the revaluation');
            return;
        }
        if (numericNew === currentValue) {
            toast.error('New value is the same as the current value');
            return;
        }

        setBusy(true);
        try {
            await revalueAsset({
                asset,
                newValue: numericNew,
                reason,
                by: user?.username ?? 'unknown',
                updateAssetValues,
            });
            toast.success('Asset revalued');
            onSaved();
        } catch (err) {
            toast.error(err.message || 'Failed to revalue asset');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#242424] rounded-xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Revalue Asset
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Asset summary */}
                <div className="px-6 py-4 border-b border-white/10">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        Revaluing
                    </p>
                    <p className="text-sm font-medium text-white">
                        {asset.title}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                        {asset.assetCode} · {asset.categoryName}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {/* Current value readout */}
                    <div>
                        <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
                            Current Book Value
                        </p>
                        <div className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 text-sm">
                            {formatNprShort(currentValue)}
                        </div>
                    </div>

                    {/* New value */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            New Value (NPR)
                        </label>
                        <input
                            type="number"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            min={0}
                            placeholder="Enter new book value"
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                        />
                    </div>

                    {/* Live delta preview */}
                    {newValue !== '' && Number.isFinite(numericNew) && delta !== 0 && (
                        <div className="rounded-lg border border-white/10 bg-white/2 px-4 py-3">
                            <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">
                                Change
                            </p>
                            <p
                                className={`text-sm font-medium ${
                                    delta > 0 ? 'text-green-300' : 'text-red-300'
                                }`}
                            >
                                {delta > 0 ? '+' : '−'}
                                {formatNprShort(Math.abs(delta))}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">
                                Book value {delta > 0 ? 'increases' : 'decreases'} from{' '}
                                {formatNprShort(currentValue)} to{' '}
                                {formatNprShort(numericNew)}
                            </p>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            Reason
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            placeholder="Why is this asset being revalued? e.g. independent appraisal, market condition change…"
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-white/70 font-medium rounded-lg hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={busy}
                            className="px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
                        >
                            {busy ? 'Saving…' : 'Save Revaluation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RevalueModal;