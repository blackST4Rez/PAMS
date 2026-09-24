import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
    const [confirmAction, setConfirmAction] = useState(null);

    const assets = useMemo(() => {
        const map = {};
        for (const a of allAssets()) map[a.id] = a;
        return map;
    }, [allAssets]);

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

    const totalPages = Math.max(1, Math.ceil(schedules.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = schedules.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    const askDeactivate = (schedule) =>
        setConfirmAction({ type: 'deactivate', schedule });
    const askActivate = (schedule) =>
        setConfirmAction({ type: 'activate', schedule });

    const runAction = () => {
        if (!confirmAction) return;
        const { type, schedule } = confirmAction;
        try {
            if (type === 'deactivate') {
                deactivateSchedule(schedule.id);
                toast.success('Schedule deactivated');
            } else {
                activateSchedule(schedule.id);
                toast.success('Schedule reactivated');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setConfirmAction(null);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Filters — stack on mobile, row on desktop */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                <div className="relative flex-1 lg:min-w-64">
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
                    {/*
                      Mobile + tablet cards — shown below lg (1024px).
                      Cards render well at any width, no clipping.
                    */}
                    <div className="lg:hidden space-y-3">
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

                                    {/* Fields — 2-col grid */}
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
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Frequency</p>
                                            <p className="text-xs text-white/80">
                                                Every {schedule.frequencyDays} days
                                            </p>
                                        </div>
                                        <div className="text-right">
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

                                    {/* Actions — wrap if needed */}
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
                                                    onClick={() => askDeactivate(schedule)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <FaBan className="w-3 h-3" />
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => askActivate(schedule)}
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

                    {/*
                      Desktop table — only shown at lg and above (≥1024px),
                      where there's enough horizontal room for all six columns.
                      min-w ensures the table scrolls instead of clipping on
                      the tight 1024–1150px range.
                    */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full min-w-240 border-collapse table-fixed">
                            <colgroup>
                                <col className="w-[22%]" />
                                <col className="w-[15%]" />
                                <col className="w-[13%]" />
                                <col className="w-[11%]" />
                                <col className="w-[17%]" />
                                {canEdit && <col className="w-[22%]" />}
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-0 pr-6">Schedule</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-0 pr-6">Asset</th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-6 pr-6">Frequency</th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-6 pr-6">Status</th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-6 pr-6">Next Due</th>
                                    {canEdit && (
                                        <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-6 pr-0">Actions</th>
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
                                        <tr key={schedule.id} className="border-b border-b-[#3a3a3a] align-top">
                                            <td className="py-3 pl-0 pr-6 overflow-hidden">
                                                <p className="text-sm font-medium text-white leading-snug">
                                                    {schedule.title}
                                                </p>
                                                {schedule.description && (
                                                    <p className="text-xs text-white/40 mt-0.5 leading-snug">
                                                        {schedule.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 pl-0 pr-6 overflow-hidden">
                                                {asset ? (
                                                    <>
                                                        <p className="text-sm text-white/80 leading-snug">
                                                            {asset.title}
                                                        </p>
                                                        <p className="text-xs text-white/40 mt-0.5">
                                                            {asset.assetCode}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-white/40">Asset not found</p>
                                                )}
                                            </td>
                                            <td className="py-3 pl-6 pr-6 text-right overflow-hidden">
                                                <p className="text-sm text-white/80 whitespace-nowrap">
                                                    Every {schedule.frequencyDays} days
                                                </p>
                                            </td>
                                            <td className="py-3 pl-6 pr-6 text-right overflow-hidden">
                                                <span className={`text-xs font-medium whitespace-nowrap ${bucketMeta.color}`}>
                                                    {bucketMeta.label}
                                                </span>
                                            </td>
                                            <td className="py-3 pl-6 pr-6 text-right overflow-hidden">
                                                <p className="text-sm text-white/80 whitespace-nowrap">
                                                    {fmtDate(schedule.nextDueAt)}
                                                </p>
                                                {schedule.active && (
                                                    <p className="text-xs text-white/40 mt-0.5 whitespace-nowrap">
                                                        {days < 0
                                                            ? `${Math.abs(days)}d overdue`
                                                            : days === 0
                                                                ? 'Due today'
                                                                : `in ${days}d`}
                                                    </p>
                                                )}
                                            </td>
                                            {canEdit && (
                                                <td className="py-3 pl-6 pr-0 overflow-hidden">
                                                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => onLog(schedule.id)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                                        >
                                                            <FaCheck className="w-3 h-3" />
                                                            Log
                                                        </button>
                                                        <button
                                                            onClick={() => onEdit(schedule.id)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                        >
                                                            <FaEdit className="w-3 h-3" />
                                                            Edit
                                                        </button>
                                                        {schedule.active ? (
                                                            <button
                                                                onClick={() => askDeactivate(schedule)}
                                                                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                            >
                                                                <FaBan className="w-3 h-3" />
                                                                Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => askActivate(schedule)}
                                                                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
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

            {confirmAction && (
                <ConfirmDialog
                    action={confirmAction}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runAction}
                />
            )}
        </div>
    );
};

/* ==================================================================
   ConfirmDialog — refined, audit-themed confirmation
   ================================================================== */

const ConfirmDialog = ({ action, onCancel, onConfirm }) => {
    const { type, schedule } = action;
    const isDeactivate = type === 'deactivate';

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-[#161616] border border-white/10 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`h-0.5 w-full ${
                        isDeactivate ? 'bg-red-500' : 'bg-green-500'
                    }`}
                />

                <div className="px-6 sm:px-8 pt-8 pb-6">
                    <div className="flex justify-center mb-5">
                        <div
                            className={`w-12 h-12 flex items-center justify-center border ${
                                isDeactivate
                                    ? 'border-red-500/30 text-red-400'
                                    : 'border-green-500/30 text-green-400'
                            }`}
                        >
                            {isDeactivate ? (
                                <FaBan className="w-5 h-5" />
                            ) : (
                                <FaPlay className="w-5 h-5" />
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                            {isDeactivate ? 'Deactivate Schedule' : 'Activate Schedule'}
                        </p>
                        <h2 className="text-xl font-semibold text-white leading-snug tracking-tight">
                            {schedule.title}
                        </h2>
                        <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs mx-auto">
                            {isDeactivate
                                ? 'This schedule will stop appearing in due-soon reminders. It can be reactivated at any time.'
                                : 'This schedule will resume tracking and reappear in due-soon reminders.'}
                        </p>
                    </div>

                    <div className="border border-white/5 bg-white/2 divide-y divide-white/5">
                        <MetadataRow
                            label="Frequency"
                            value={`Every ${schedule.frequencyDays} days`}
                        />
                        <MetadataRow
                            label="Next Due"
                            value={fmtDate(schedule.nextDueAt)}
                        />
                    </div>
                </div>

                <div className="border-t border-white/10 px-6 sm:px-8 py-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-5 py-2.5 text-sm font-medium text-white/70 border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 px-5 py-2.5 text-sm font-medium text-white transition-colors ${
                            isDeactivate
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isDeactivate ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const MetadataRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
            {label}
        </span>
        <span className="text-sm text-white font-medium truncate">
            {value}
        </span>
    </div>
);

export default SchedulesTable;