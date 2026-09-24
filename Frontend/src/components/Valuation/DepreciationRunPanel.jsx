import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
    FaPlay,
    FaCheckCircle,
    FaLevelDownAlt,
    FaSortAmountDownAlt,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useValuation } from '../Context/ValuationContext';
import {
    formatNprShort,
    currentFYLabel,
} from '../mock/mockValuation';

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

const DepreciationRunPanel = ({ canRun, latestRun }) => {
    const { user } = useAuth();
    const { allAssets, updateAssetValues } = useAssets();
    const { runDepreciation } = useValuation();

    const [busy, setBusy] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const runNow = async () => {
        setBusy(true);
        try {
            const assets = allAssets();
            const result = await runDepreciation({
                assets,
                runBy: user?.username ?? 'unknown',
                notes: '',
                updateAssetValues,
            });
            toast.success(
                `Depreciation run complete — ${result.assetsAffected} assets affected`
            );
            setConfirming(false);
        } catch (err) {
            toast.error(err.message || 'Depreciation run failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaSortAmountDownAlt className="text-red-400" />
                    Depreciation
                </h2>
                <span className="text-xs font-medium text-white/60">
                    Current FY: <span className="text-white">{currentFYLabel()}</span>
                </span>
            </div>

            {/* Body — two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latest run summary — 2 columns wide */}
                <div className="lg:col-span-2">
                    {latestRun ? (
                        <>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <Row
                                    label="Fiscal Year"
                                    value={latestRun.fiscalYear}
                                />
                                <Row
                                    label="Ran At"
                                    value={fmtDateTime(latestRun.runAt)}
                                    align="right"
                                />
                                <Row
                                    label="Ran By"
                                    value={latestRun.runBy}
                                />
                                <Row
                                    label="Assets Affected"
                                    value={latestRun.assetsAffected}
                                    align="right"
                                />
                            </div>

                            <div className="mt-5 pt-5 border-t border-white/5">
                                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                                    Total Depreciation Applied
                                </p>
                                <p className="text-2xl font-bold text-red-400">
                                    {formatNprShort(latestRun.totalDepreciation)}
                                </p>
                            </div>

                            {latestRun.notes && (
                                <p className="text-xs text-white/50 italic mt-3">
                                    *{latestRun.notes}*
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-3 text-white/60">
                            <FaCheckCircle className="text-white/30 w-5 h-5 shrink-0" />
                            <p className="text-sm">
                                No depreciation runs have been recorded yet. Run one
                                to apply a year of depreciation across the register.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action column */}
                {canRun && (
                    <div className="lg:col-span-1 flex items-start justify-end">
                        <button
                            onClick={() => setConfirming(true)}
                            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] transition-colors"
                        >
                            <FaPlay className="w-3.5 h-3.5" />
                            Run Depreciation
                        </button>
                    </div>
                )}
            </div>

            {confirming && (
                <RunDepreciationDialog
                    fyLabel={currentFYLabel()}
                    busy={busy}
                    onCancel={() => setConfirming(false)}
                    onConfirm={runNow}
                />
            )}
        </div>
    );
};

/* ==================================================================
   RunDepreciationDialog — audit-themed confirmation, matches the
   Activate/Deactivate dialog used in the Maintenance schedules table.
   ================================================================== */

const RunDepreciationDialog = ({ fyLabel, busy, onCancel, onConfirm }) => {
    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-[#161616] border border-white/10 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Accent bar — yellow since it's a compute action */}
                <div className="h-0.5 w-full bg-yellow-500" />

                <div className="px-6 sm:px-8 pt-8 pb-6">
                    {/* Icon well */}
                    <div className="flex justify-center mb-5">
                        <div className="w-12 h-12 flex items-center justify-center border border-yellow-500/30 text-yellow-400">
                            <FaLevelDownAlt className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Eyebrow + title, centered */}
                    <div className="text-center mb-6">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                            Run Depreciation
                        </p>
                        <h2 className="text-xl font-semibold text-white leading-snug tracking-tight">
                            {fyLabel}
                        </h2>
                        <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs mx-auto">
                            This applies one year of depreciation to every eligible asset.
                            Book values will be reduced and a permanent run record will be
                            created.
                        </p>
                    </div>

                    {/* Warning strip */}
                    <div className="border border-yellow-500/20 bg-yellow-500/5 divide-y divide-yellow-500/10">
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-yellow-200/70">
                                Effect
                            </span>
                            <span className="text-sm text-yellow-100 font-medium text-right">
                                Reduces current book value
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-yellow-200/70">
                                Reversible
                            </span>
                            <span className="text-sm text-yellow-100 font-medium text-right">
                                No — logged permanently
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t border-white/10 px-6 sm:px-8 py-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="flex-1 px-5 py-2.5 text-sm font-medium text-white/70 border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className="flex-1 px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                        {busy ? 'Running…' : 'Run Now'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Row = ({ label, value, align = 'left' }) => (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm text-white wrap-break-words">{value}</p>
    </div>
);

export default DepreciationRunPanel;