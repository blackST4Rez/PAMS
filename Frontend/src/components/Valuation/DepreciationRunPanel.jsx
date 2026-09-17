import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaPlay,
    FaCheckCircle,
    FaExclamationTriangle,
    FaLevelDownAlt,
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
                    <FaLevelDownAlt className="text-red-400" />
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
                                />
                                <Row
                                    label="Ran By"
                                    value={latestRun.runBy}
                                />
                                <Row
                                    label="Assets Affected"
                                    value={latestRun.assetsAffected}
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
                                    "{latestRun.notes}"
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
                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors"
                            >
                                <FaPlay className="w-3.5 h-3.5" />
                                Run Depreciation
                            </button>
                        ) : (
                            <div className="w-full rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <FaExclamationTriangle className="text-yellow-400 w-4 h-4 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Run depreciation for {currentFYLabel()}?
                                        </p>
                                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                            This applies one year of depreciation to
                                            every eligible asset. Book values will be
                                            reduced and a permanent run record will be
                                            created.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setConfirming(false)}
                                        disabled={busy}
                                        className="px-3.5 py-2 text-xs font-medium text-white/70 rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={runNow}
                                        disabled={busy}
                                        className="px-3.5 py-2 text-xs font-medium bg-[#173ef0] text-white rounded-md hover:bg-[#0020ad] transition-colors disabled:opacity-50"
                                    >
                                        {busy ? 'Running…' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm text-white wrap-break-word">{value}</p>
    </div>
);

export default DepreciationRunPanel;