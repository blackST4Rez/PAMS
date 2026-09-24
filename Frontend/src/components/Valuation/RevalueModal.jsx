import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck } from 'react-icons/fa';
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

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex justify-end bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#161616] border-l border-white/10 w-full sm:max-w-2xl h-full flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ==================== HEADER ==================== */}
                <header className="shrink-0 border-b border-white/10">
                    <div className="px-6 sm:px-8 py-5 flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1 space-y-3">
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-none">
                                Revalue Asset
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight wrap-break-words">
                                {asset.title}
                            </h2>

                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium text-white/80">
                                    {asset.assetCode}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium text-white/60">
                                    {asset.categoryName}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 text-red-400 bg-[#161616] border border-[#161616] hover:border-red-400 transition-colors text-sm font-medium"
                            aria-label="Close"
                        >
                            <FaTimes className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Close</span>
                        </button>
                    </div>
                </header>

                {/* ==================== BODY ==================== */}
                <form
                    onSubmit={onSubmit}
                    className="flex-1 min-h-0 flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <div className="px-6 sm:px-8 py-6">
                            {/* Current value */}
                            <section>
                                <SectionHeading>Current Value</SectionHeading>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <DetailItem
                                        label="Current Book Value"
                                        value={formatNprShort(currentValue)}
                                    />
                                    <DetailItem
                                        label="Acquisition Cost"
                                        value={formatNprShort(asset.acquisitionCost)}
                                    />
                                </div>
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* New value */}
                            <section>
                                <SectionHeading>New Valuation</SectionHeading>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                        New Value (NPR)
                                    </label>
                                    <input
                                        type="number"
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        min={0}
                                        placeholder="Enter new book value"
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                    />
                                </div>

                                {/* Live delta preview */}
                                {newValue !== '' && Number.isFinite(numericNew) && delta !== 0 && (
                                    <div className="mt-4 border border-white/10 bg-white/2 px-4 py-4">
                                        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-2">
                                            Change
                                        </p>
                                        <p
                                            className={`text-xl font-semibold mb-1.5 ${
                                                delta > 0 ? 'text-green-400' : 'text-red-400'
                                            }`}
                                        >
                                            {delta > 0 ? '+' : '−'}
                                            {formatNprShort(Math.abs(delta))}
                                        </p>
                                        <p className="text-xs text-white/50 leading-relaxed">
                                            Book value {delta > 0 ? 'increases' : 'decreases'} from{' '}
                                            {formatNprShort(currentValue)} to{' '}
                                            {formatNprShort(numericNew)}
                                        </p>
                                    </div>
                                )}
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Reason */}
                            <section>
                                <SectionHeading>Reason</SectionHeading>

                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                    placeholder="Why is this asset being revalued? e.g. independent appraisal, market condition change…"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                                />
                                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                                    The reason is recorded in the asset's revaluation history and
                                    the audit trail.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* ==================== FOOTER ==================== */}
                    <div className="shrink-0 bg-[#161616] border-t border-white/10 px-6 sm:px-8 py-4 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busy}
                            className="px-5 py-2.5 text-base font-medium text-white/70 hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium bg-[#173ef0] text-white hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
                        >
                            <FaCheck className="w-4 h-4" />
                            {busy ? 'Saving…' : 'Save Revaluation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

/* ---------------- sub-components ---------------- */

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mb-4">
        <span className="w-0.5 h-4 bg-[#173ef0]" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            {children}
        </h3>
    </div>
);

const DetailItem = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1.5 leading-none">
            {label}
        </p>
        <p className="text-base text-white leading-snug break-all font-medium">
            {value}
        </p>
    </div>
);

export default RevalueModal;