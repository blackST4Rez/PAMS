import { FaExclamationTriangle, FaClock, FaCheck } from 'react-icons/fa';
import { daysUntil } from '../mock/mockMaintenance';
import { useAssets } from '../Context/AssetsContext';

/* Human label for "how far past/future the due date is" */
const dueLabel = (days) => {
    if (days < 0) {
        const n = Math.abs(days);
        return n === 1 ? '1 day overdue' : `${n} days overdue`;
    }
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
};

const DueSoonPanel = ({ schedules, canLog, onLog }) => {
    const { getAsset } = useAssets();

    /* Auto-hide when nothing is due */
    if (!schedules || schedules.length === 0) return null;

    /* Split for the header counts */
    const overdueCount = schedules.filter(
        (s) => daysUntil(s.nextDueAt) < 0
    ).length;
    const dueSoonCount = schedules.length - overdueCount;

    return (
        <div className="p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-400" />
                    Due Soon &amp; Overdue
                </h2>
                <div className="flex items-center gap-2">
                    {overdueCount > 0 && (
                        <span className="text-xs font-medium px-2.5 py-1 text-red-400">
                            {overdueCount} overdue
                        </span>
                    )}
                    {dueSoonCount > 0 && (
                        <span className="text-xs font-medium px-2.5 py-1 text-yellow-300">
                            {dueSoonCount} due soon
                        </span>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-2">
                {schedules.map((schedule) => {
                    const days = daysUntil(schedule.nextDueAt);
                    const isOverdue = days < 0;
                    const asset = getAsset(schedule.assetId);

                    return (
                        <div
                            key={schedule.id}
                            className="flex items-start gap-3 py-3 border-b border-white/5 last:border-b-0"
                        >
                            {/* Status dot */}
                            <div className="shrink-0 mt-1">
                                {isOverdue ? (
                                    <span className="inline-block w-2 h-2 bg-red-400" />
                                ) : (
                                    <span className="inline-block w-2 h-2 bg-yellow-400" />
                                )}
                            </div>

                            {/* Body */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {schedule.title}
                                </p>
                                <p className="text-xs text-white/50 mt-0.5">
                                    {asset ? `${asset.assetCode} · ${asset.title}` : 'Asset not found'}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-red-300' : 'text-yellow-300'
                                            }`}
                                    >
                                        <FaClock className="w-3 h-3" />
                                        {dueLabel(days)}
                                    </span>
                                    <span className="text-xs text-white/40">
                                        · Every {schedule.frequencyDays} days
                                    </span>
                                </div>
                            </div>

                            {/* Log button */}
                            {canLog && (
                                <button
                                    onClick={() => onLog(schedule.id)}
                                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                >
                                    <FaCheck className="w-3 h-3" />
                                    Log
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer note */}
            <p className="italic text-sm text-gray-400 mt-4 pt-3 border-t border-white/5">
                * Showing schedules due within 30 days, including overdue items.
            </p>
        </div>
    );
};

export default DueSoonPanel;