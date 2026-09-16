import { useMemo } from 'react';
import {
    FaSearch,
    FaTimes,
    FaEdit,
    FaCheck,
    FaBan,
    FaPlay,
} from 'react-icons/fa';
import {
    daysUntil,
    scheduleBucket,
    MAINTENANCE_BUCKETS,
} from '../mock/mockMaintenance';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import toast from 'react-hot-toast';

/*
  Bucket filter options — shown in the dropdown.
  Empty string means "All Buckets".
*/
const BUCKET_OPTIONS = [
    { value: '', label: 'All Buckets' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'DUE_SOON', label: 'Due Soon' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'INACTIVE', label: 'Inactive' },
];

/* Format a YYYY-MM-DD string as "20 Mar 2081" */
const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    } catch {
        return iso;
    }
};

const SchedulesTable = ({
    schedules,
    filters,
    onFiltersChange,
    canEdit,
    onEdit,
    onLog,
}) => {
    const { allAssets } = useAssets();
    const { deactivateSchedule, activateSchedule } = useMaintenance();

    /* Build the asset lookup once per render */
    const assets = useMemo(() => {
        const map = {};
        for (const a of allAssets()) map[a.id] = a;
        return map;
    }, [allAssets]);

    /* Filter helpers */
    const setField = (key, value) =>
        onFiltersChange({ ...filters, [key]: value });

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.assetId !== '' ||
        filters.bucket !== '';

    const clearAll = () =>
        onFiltersChange({ search: '', assetId: '', bucket: '' });

    /* Row actions */
    const handleDeactivate = (schedule) => {
        try {
            deactivateSchedule(schedule.id);
            toast.success('Schedule deactivated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleActivate = (schedule) => {
        try {
            activateSchedule(schedule.id);
            toast.success('Schedule reactivated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="p-2">
            {/* Filter row */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search schedules…"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                {/* Asset */}
                <select
                    value={filters.assetId}
                    onChange={(e) => setField('assetId', e.target.value)}
                    className="w-full lg:w-64 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Assets</option>
                    {allAssets().map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#242424]">
                            {a.assetCode} — {a.title}
                        </option>
                    ))}
                </select>

                {/* Bucket */}
                <select
                    value={filters.bucket}
                    onChange={(e) => setField('bucket', e.target.value)}
                    className="w-full lg:w-44 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {BUCKET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#242424]">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Clear */}
                {hasAnyFilter && (
                    <button
                        onClick={clearAll}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                        <FaTimes className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            {schedules.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No schedules match the current filters.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Schedule
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Asset
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Frequency
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Next Due
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Status
                                </th>
                                {canEdit && (
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => {
                                const bucket = scheduleBucket(schedule);
                                const bucketMeta =
                                    MAINTENANCE_BUCKETS[bucket] ??
                                    MAINTENANCE_BUCKETS.UPCOMING;
                                const days = daysUntil(schedule.nextDueAt);
                                const asset = assets[schedule.assetId];

                                return (
                                    <tr
                                        key={schedule.id}
                                        className="border-b border-b-[#3a3a3a]"
                                    >
                                        {/* Schedule */}
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-white truncate max-w-xs">
                                                {schedule.title}
                                            </p>
                                            {schedule.description && (
                                                <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs">
                                                    {schedule.description}
                                                </p>
                                            )}
                                        </td>

                                        {/* Asset */}
                                        <td className="py-3 px-4">
                                            {asset ? (
                                                <>
                                                    <p className="text-sm text-white/80">
                                                        {asset.title}
                                                    </p>
                                                    <p className="text-xs text-white/40 mt-0.5">
                                                        {asset.assetCode}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-white/40">
                                                    Asset not found
                                                </p>
                                            )}
                                        </td>

                                        {/* Frequency */}
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white/80">
                                                Every {schedule.frequencyDays} days
                                            </p>
                                        </td>

                                        {/* Next due */}
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white/80">
                                                {fmtDate(schedule.nextDueAt)}
                                            </p>
                                            {schedule.active && (
                                                <p className="text-xs text-white/40 mt-0.5">
                                                    {days < 0
                                                        ? `${Math.abs(days)}d overdue`
                                                        : days === 0
                                                            ? 'Due today'
                                                            : `in ${days}d`}
                                                </p>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`text-xs font-medium ${bucketMeta.color}`}
                                            >
                                                {bucketMeta.label}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        {canEdit && (
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                    <button
                                                        onClick={() => onLog(schedule.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                                        title="Log completed maintenance"
                                                    >
                                                        <FaCheck className="w-3 h-3" />
                                                        Log
                                                    </button>

                                                    <button
                                                        onClick={() => onEdit(schedule.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                        title="Edit schedule"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                        Edit
                                                    </button>

                                                    {schedule.active ? (
                                                        <button
                                                            onClick={() => handleDeactivate(schedule)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                            title="Deactivate schedule"
                                                        >
                                                            <FaBan className="w-3 h-3" />
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivate(schedule)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                                            title="Reactivate schedule"
                                                        >
                                                            <FaPlay className="w-3 h-3" />
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SchedulesTable;