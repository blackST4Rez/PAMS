import { useMemo, useState } from 'react';
import Pagination, { useIsMobile } from '../Common/Pagination';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { formatNprShort } from '../mock/mockValuation';

const COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'assetTitle', label: 'Asset' },
    { key: 'wardName', label: 'Ward' },
    { key: 'events', label: 'Events' },
    { key: 'totalCostFormatted', label: 'Total Cost' },
    { key: 'lastDate', label: 'Last Maintenance' },
];

const CSV_COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'assetTitle', label: 'Asset' },
    { key: 'wardName', label: 'Ward' },
    { key: 'events', label: 'Events' },
    { key: 'totalCost', label: 'Total Cost (NPR)' },
    { key: 'lastDate', label: 'Last Maintenance' },
];

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

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

const MaintenanceCostReport = () => {
    const { allAssets } = useAssets();
    const { allLogs } = useMaintenance();

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    const { rows, totals, csvRows } = useMemo(() => {
        const assets = allAssets();
        const assetById = new Map(assets.map((a) => [a.id, a]));
        const logs = allLogs();

        const byAsset = new Map();
        for (const log of logs) {
            if (!byAsset.has(log.assetId)) {
                byAsset.set(log.assetId, {
                    assetId: log.assetId,
                    events: 0,
                    totalCost: 0,
                    lastCompletedAt: null,
                });
            }
            const bucket = byAsset.get(log.assetId);
            bucket.events += 1;
            bucket.totalCost += Number(log.cost) || 0;
            if (
                !bucket.lastCompletedAt ||
                new Date(log.completedAt) > new Date(bucket.lastCompletedAt)
            ) {
                bucket.lastCompletedAt = log.completedAt;
            }
        }

        const rows = [...byAsset.values()]
            .map((b) => {
                const asset = assetById.get(b.assetId);
                if (!asset) return null;
                return {
                    assetId: b.assetId,
                    assetCode: asset.assetCode,
                    assetTitle: asset.title,
                    wardName: asset.wardName,
                    events: b.events,
                    totalCost: b.totalCost,
                    totalCostFormatted: formatNprShort(b.totalCost),
                    lastDate: fmtDate(b.lastCompletedAt),
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.totalCost - a.totalCost);

        const totals = {
            events: 0,
            totalCost: 0,
            totalCostFormatted: '',
        };
        for (const r of rows) {
            totals.events += r.events;
            totals.totalCost += r.totalCost;
        }
        totals.totalCostFormatted = formatNprShort(totals.totalCost);

        const csvRows = [
            ...rows.map((r) => ({
                assetCode: r.assetCode,
                assetTitle: r.assetTitle,
                wardName: r.wardName,
                events: r.events,
                totalCost: r.totalCost,
                lastDate: r.lastDate,
            })),
            {
                assetCode: 'Total',
                assetTitle: '',
                wardName: '',
                events: totals.events,
                totalCost: totals.totalCost,
                lastDate: '',
            },
        ];

        return { rows, totals, csvRows };
    }, [allAssets, allLogs]);

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = rows.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Maintenance Cost
                    </h2>
                    <p className="text-sm text-white/50 mt-0.5">
                        Total maintenance spend per asset, highest first
                    </p>
                </div>
                <ReportExportButton
                    filename="maintenance-cost"
                    columns={CSV_COLUMNS}
                    rows={csvRows}
                />
            </div>

            {rows.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No maintenance events have been logged yet.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards ---- */}
                    <div className="sm:hidden space-y-3">
                        {paged.map((r) => (
                            <div
                                key={r.assetId}
                                className="bg-[#1a1a1a] border border-white/10 p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">
                                        {r.assetCode}
                                    </p>
                                    <span className="text-xs text-white/60 shrink-0">
                                        {r.events} {r.events === 1 ? 'event' : 'events'}
                                    </span>
                                </div>

                                <p className="text-sm font-semibold text-white leading-snug">
                                    {r.assetTitle}
                                </p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Ward</p>
                                        <p className="text-xs text-white/80 truncate">
                                            {r.wardName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Last Maintenance</p>
                                        <p className="text-xs text-white/80">
                                            {r.lastDate}
                                        </p>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
                                        <p className="text-sm font-medium text-white">
                                            {r.totalCostFormatted}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ---- Desktop table — all left-aligned ---- */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    {COLUMNS.map((c) => (
                                        <th
                                            key={c.key}
                                            className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4"
                                        >
                                            {c.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((r) => (
                                    <tr key={r.assetId} className="border-b border-b-[#3a3a3a]">
                                        <td className="py-3 px-4 text-sm text-white">
                                            {r.assetCode}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white truncate max-w-xs">
                                            {r.assetTitle}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white/80">
                                            {r.wardName}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white">
                                            {r.events}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white">
                                            {r.totalCostFormatted}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white/60">
                                            {r.lastDate}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals — unchanged */}
                    <div className="mt-4 bg-white/3 border-l-2 border-l-[#173ef0]">
                        <div className="sm:hidden p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                        Summary
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        All Assets
                                    </p>
                                </div>
                                <span className="text-xs text-white/60 shrink-0">
                                    {totals.events} {totals.events === 1 ? 'event' : 'events'}
                                </span>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
                                <p className="text-sm font-semibold text-white">
                                    {totals.totalCostFormatted}
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center px-4 py-4 gap-4">
                            <div className="shrink-0">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                    Summary
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    All Assets
                                </p>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4 ml-6 max-w-md">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Events</p>
                                    <p className="text-sm font-semibold text-white">{totals.events}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
                                    <p className="text-sm font-semibold text-white">{totals.totalCostFormatted}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
                </>
            )}
        </div>
    );
};

export default MaintenanceCostReport;