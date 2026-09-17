import { useMemo } from 'react';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { formatNprShort } from '../mock/mockValuation';

/* Table columns */
const COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'assetTitle', label: 'Asset' },
    { key: 'wardName', label: 'Ward' },
    { key: 'events', label: 'Events' },
    { key: 'totalCostFormatted', label: 'Total Cost' },
    { key: 'lastDate', label: 'Last Maintenance' },
];

/* CSV columns — raw values */
const CSV_COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'assetTitle', label: 'Asset' },
    { key: 'wardName', label: 'Ward' },
    { key: 'events', label: 'Events' },
    { key: 'totalCost', label: 'Total Cost (NPR)' },
    { key: 'lastDate', label: 'Last Maintenance' },
];

/* Format an ISO date string as "DD MMM YYYY" */
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

    const { rows, totals, csvRows } = useMemo(() => {
        const assets = allAssets();
        const assetById = new Map(assets.map((a) => [a.id, a]));
        const logs = allLogs();

        /* Bucket logs by assetId */
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

        /* Build display rows */
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

        /* Totals */
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

        /*
          CSV rows = data rows + totals row.
          The totals row uses the same keys as the CSV column definitions.
          Non-numeric cells are empty in the totals row.
        */
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

    return (
        <div>
            {/* Header + export */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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

            {/* Empty state */}
            {rows.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No maintenance events have been logged yet.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Asset Code
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Asset
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Ward
                                </th>
                                <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Events
                                </th>
                                <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Total Cost
                                </th>
                                <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Last Maintenance
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr
                                    key={r.assetId}
                                    className="border-b border-b-[#3a3a3a]"
                                >
                                    <td className="py-3 px-4 text-sm text-white">
                                        {r.assetCode}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white truncate max-w-xs">
                                        {r.assetTitle}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80">
                                        {r.wardName}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white text-right">
                                        {r.events}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white text-right">
                                        {r.totalCostFormatted}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/60 text-right">
                                        {r.lastDate}
                                    </td>
                                </tr>
                            ))}

                            {/* Totals */}
                            <tr className="border-t-2 border-t-white/20">
                                <td
                                    className="py-3 px-4 text-sm font-semibold text-white"
                                    colSpan={3}
                                >
                                    Total
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-white text-right">
                                    {totals.events}
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-white text-right">
                                    {totals.totalCostFormatted}
                                </td>
                                <td className="py-3 px-4" />
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MaintenanceCostReport;