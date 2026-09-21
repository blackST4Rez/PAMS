import { useMemo, useState } from 'react';
import {
    FaSearch,
    FaTimes,
    FaEdit,
    FaCheck,
    FaBan,
    FaPlay,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination, { useIsMobile } from '../Common/Pagination';
import {
    daysUntil,
    scheduleBucket,
    MAINTENANCE_BUCKETS,
} from '../mock/mockMaintenance';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';

const BUCKET_OPTIONS = [
    { value: '', label: 'All Buckets' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'DUE_SOON', label: 'Due Soon' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'INACTIVE', label: 'Inactive' },
];

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

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

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

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    /* Build asset lookup */
    const assets = useMemo(() => {
        const map = {};
        for (const a of allAssets()) map[a.id] = a;
        return map;
    }, [allAssets]);

    /* Filter helpers */
    const setField = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
        setPage(1);
    };

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.assetId !== '' ||
        filters.bucket !== '';

    const clearAll = () => {
        onFiltersChange({ search: '', assetId: '', bucket: '' });
        setPage(1);
    };

    /* Pagination */
    const totalPages = Math.max(1, Math.ceil(schedules.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = schedules.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

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
        <div className="p-4 sm:p-6">
            {/* Filter row */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search schedules…"
                        className="w-full pl-10 pr-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                <select
                    value={filters.assetId}
                    onChange={(e) => setField('assetId', e.target.value)}
                    className="w-full lg:w-64 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Assets</option>
                    {allAssets().map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#1c1c1c]">
                            {a.assetCode} — {a.title}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.bucket}
                    onChange={(e) => setField('bucket', e.target.value)}
                    className="w-full lg:w-44 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {BUCKET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1c1c1c]">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {hasAnyFilter && (
                    <button
                        onClick={clearAll}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                        <FaTimes className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}
            </div>

            {schedules.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No schedules match the current filters.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards ---- */}
                    <div className="sm:hidden space-y-3">
                        {paged.map((schedule) => {
                            const bucket = scheduleBucket(schedule);
                            const bucketMeta =
                                MAINTENANCE_BUCKETS[bucket] ??
                                MAINTENANCE_BUCKETS.UPCOMING;
                            const days = daysUntil(schedule.nextDueAt);
                            const asset = assets[schedule.assetId];

                            return (
                                <div
                                    key={schedule.id}
                                    className="bg-[#1a1a1a] border border-white/10 p-4 space-y-3"
                                >
                                    {/* Top — title + status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-semibold text-white leading-snug min-w-0">
                                            {schedule.title}
                                        </p>
                                        <span className={`text-xs font-medium shrink-0 ${bucketMeta.color}`}>
                                            {bucketMeta.label}
                                        </span>
                                    </div>

                                    {/* Fields */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Asset</p>
                                            {asset ? (
                                                <>
                                                    <p className="text-xs text-white/80 truncate">{asset.title}</p>
                                                    <p className="text-xs text-white/50 truncate">{asset.assetCode}</p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-white/40">Asset not found</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Frequency</p>
                                            <p className="text-xs text-white/80">
                                                Every {schedule.frequencyDays} days
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Next Due</p>
                                            <p className="text-xs text-white/80">{fmtDate(schedule.nextDueAt)}</p>
                                            {schedule.active && (
                                                <p className="text-xs text-white/50 mt-0.5">
                                                    {days < 0
                                                        ? `${Math.abs(days)}d overdue`
                                                        : days === 0
                                                            ? 'Due today'
                                                            : `in ${days}d`}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {canEdit && (
                                        <div className="pt-3 border-t border-white/5 flex flex-wrap justify-end gap-2">
                                            <button
                                                onClick={() => onLog(schedule.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                                Log
                                            </button>
                                            <button
                                                onClick={() => onEdit(schedule.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <FaEdit className="w-3 h-3" />
                                                Edit
                                            </button>
                                            {schedule.active ? (
                                                <button
                                                    onClick={() => handleDeactivate(schedule)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <FaBan className="w-3 h-3" />
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(schedule)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                                >
                                                    <FaPlay className="w-3 h-3" />
                                                    Activate
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ---- Desktop table ---- */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Schedule</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Asset</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Frequency</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Next Due</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Status</th>
                                    {canEdit && (
                                        <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((schedule) => {
                                    const bucket = scheduleBucket(schedule);
                                    const bucketMeta =
                                        MAINTENANCE_BUCKETS[bucket] ??
                                        MAINTENANCE_BUCKETS.UPCOMING;
                                    const days = daysUntil(schedule.nextDueAt);
                                    const asset = assets[schedule.assetId];

                                    return (
                                        <tr key={schedule.id} className="border-b border-b-[#3a3a3a]">
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
                                            <td className="py-3 px-4">
                                                {asset ? (
                                                    <>
                                                        <p className="text-sm text-white/80">{asset.title}</p>
                                                        <p className="text-xs text-white/40 mt-0.5">{asset.assetCode}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-white/40">Asset not found</p>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/80">
                                                    Every {schedule.frequencyDays} days
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/80">{fmtDate(schedule.nextDueAt)}</p>
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
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-medium ${bucketMeta.color}`}>
                                                    {bucketMeta.label}
                                                </span>
                                            </td>
                                            {canEdit && (
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                        <button
                                                            onClick={() => onLog(schedule.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                                        >
                                                            <FaCheck className="w-3 h-3" />
                                                            Log
                                                        </button>
                                                        <button
                                                            onClick={() => onEdit(schedule.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                        >
                                                            <FaEdit className="w-3 h-3" />
                                                            Edit
                                                        </button>
                                                        {schedule.active ? (
                                                            <button
                                                                onClick={() => handleDeactivate(schedule)}
                                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                            >
                                                                <FaBan className="w-3 h-3" />
                                                                Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActivate(schedule)}
                                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
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

                    <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
                </>
            )}
        </div>
    );
};

export default SchedulesTable;