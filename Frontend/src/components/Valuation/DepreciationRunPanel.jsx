import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaPlay,
    FaCheckCircle,
    FaExclamationTriangle,
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
    const { allAssets } = useAssets();
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

    /*
      Pull the asset update function once, outside the JSX so we can pass
      it through cleanly.
    */
    const { updateAssetValues } = useAssets();

    return (
        <div className="bg-[#242424] rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left — latest run summary */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                        <FaCheckCircle className="text-green-400" />
                        Depreciation
                    </h2>

                    {latestRun ? (
                        <div className="space-y-2">
                            <p className="text-sm text-white/70">
                                Last run:{' '}
                                <span className="text-white font-medium">
                                    {latestRun.fiscalYear}
                                </span>{' '}
                                on {fmtDateTime(latestRun.runAt)} by{' '}
                                <span className="text-white/80">
                                    {latestRun.runBy}
                                </span>
                            </p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                                <span className="text-white/60">
                                    Assets affected:{' '}
                                    <span className="text-white">
                                        {latestRun.assetsAffected}
                                    </span>
                                </span>
                                <span className="text-white/60">
                                    Total depreciation:{' '}
                                    <span className="text-red-300">
                                        {formatNprShort(latestRun.totalDepreciation)}
                                    </span>
                                </span>
                            </div>
                            {latestRun.notes && (
                                <p className="text-xs text-white/50 italic">
                                    {latestRun.notes}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-white/60">
                            No depreciation runs have been recorded yet.
                        </p>
                    )}

                    <p className="text-xs text-white/40 mt-4">
                        Current fiscal year: {currentFYLabel()}
                    </p>
                </div>

                {/* Right — action */}
                {canRun && (
                    <div className="lg:shrink-0 lg:w-64">
                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors"
                            >
                                <FaPlay className="w-3.5 h-3.5" />
                                Run Depreciation
                            </button>
                        ) : (
                            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <FaExclamationTriangle className="text-yellow-400 w-4 h-4 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            Run depreciation for {currentFYLabel()}?
                                        </p>
                                        <p className="text-xs text-white/60 mt-1">
                                            This will apply one year of depreciation to every eligible asset. Book values will be reduced.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setConfirming(false)}
                                        disabled={busy}
                                        className="px-3 py-1.5 text-xs font-medium text-white/70 rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={runNow}
                                        disabled={busy}
                                        className="px-3 py-1.5 text-xs font-medium bg-[#173ef0] text-white rounded-md hover:bg-[#0020ad] transition-colors disabled:opacity-50"
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

export default DepreciationRunPanel;