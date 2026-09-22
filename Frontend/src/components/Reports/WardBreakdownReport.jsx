import { useMemo, useState } from 'react';
import Pagination, { useIsMobile } from '../Common/Pagination';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { formatNprShort } from '../mock/mockValuation';
import { MOCK_WARDS } from '../mock/mockAssets';

const COLUMNS = [
    { key: 'wardName', label: 'Ward', align: 'left' },
    { key: 'count', label: 'Assets', align: 'right' },
    { key: 'costFormatted', label: 'Total Acquisition Cost', align: 'right' },
    { key: 'bookFormatted', label: 'Current Book Value', align: 'right' },
    { key: 'depreciationFormatted', label: 'Depreciation', align: 'right' },
    { key: 'percentOfTotal', label: '% of Total Assets', align: 'right' },
];

const CSV_COLUMNS = [
    { key: 'wardName', label: 'Ward' },
    { key: 'count', label: 'Assets' },
    { key: 'cost', label: 'Total Acquisition Cost (NPR)' },
    { key: 'book', label: 'Current Book Value (NPR)' },
    { key: 'depreciation', label: 'Depreciation (NPR)' },
    { key: 'percentOfTotal', label: '% of Total Assets' },
];

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const WardBreakdownReport = () => {
    const { allAssets } = useAssets();

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    const { rows, totals, csvRows } = useMemo(() => {
        const assets = allAssets();

        const buckets = MOCK_WARDS.map((w) => ({
            wardId: w.id,
            wardName: w.name,
            count: 0,
            cost: 0,
            book: 0,
        }));
        const bucketById = new Map(buckets.map((b) => [b.wardId, b]));

        for (const a of assets) {
            const bucket = bucketById.get(a.wardId);
            if (!bucket) continue;
            bucket.count += 1;
            bucket.cost += Number(a.acquisitionCost) || 0;
            bucket.book += Number(a.currentBookValue) || 0;
        }

        const totalCount = assets.length;

        const rows = buckets
            .map((b) => {
                const depreciation = b.cost - b.book;
                return {
                    wardId: b.wardId,
                    wardName: b.wardName,
                    count: b.count,
                    cost: b.cost,
                    book: b.book,
                    depreciation,
                    costFormatted: formatNprShort(b.cost),
                    bookFormatted: formatNprShort(b.book),
                    depreciationFormatted: formatNprShort(depreciation),
                    percentOfTotal:
                        totalCount > 0
                            ? Math.round((b.count / totalCount) * 100)
                            : 0,
                };
            })
            .sort((a, b) => {
                const na = parseInt(a.wardName.replace(/\D/g, ''), 10) || 0;
                const nb = parseInt(b.wardName.replace(/\D/g, ''), 10) || 0;
                return na - nb;
            });

        const totals = {
            wardName: 'Total',
            count: 0,
            cost: 0,
            book: 0,
            depreciation: 0,
            costFormatted: '',
            bookFormatted: '',
            depreciationFormatted: '',
            percentOfTotal: 100,
        };
        for (const r of rows) {
            totals.count += r.count;
            totals.cost += r.cost;
            totals.book += r.book;
            totals.depreciation += r.depreciation;
        }
        totals.costFormatted = formatNprShort(totals.cost);
        totals.bookFormatted = formatNprShort(totals.book);
        totals.depreciationFormatted = formatNprShort(totals.depreciation);

        const csvRows = [
            ...rows.map((r) => ({
                wardName: r.wardName,
                count: r.count,
                cost: r.cost,
                book: r.book,
                depreciation: r.depreciation,
                percentOfTotal: r.percentOfTotal,
            })),
            {
                wardName: 'Total',
                count: totals.count,
                cost: totals.cost,
                book: totals.book,
                depreciation: totals.depreciation,
                percentOfTotal: totals.percentOfTotal,
            },
        ];

        return { rows, totals, csvRows };
    }, [allAssets]);

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = rows.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    return (
        <div>
            {/* Header + export */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Ward-wise Breakdown
                    </h2>
                    <p className="text-sm text-white/50 mt-0.5">
                        Asset count and value distribution across all wards
                    </p>
                </div>
                <ReportExportButton
                    filename="ward-breakdown"
                    columns={CSV_COLUMNS}
                    rows={csvRows}
                />
            </div>

            {/* ---- Mobile cards (paginated) ---- */}
            <div className="sm:hidden space-y-3">
                {paged.map((r) => (
                    <div
                        key={r.wardId}
                        className="bg-[#1a1a1a] border border-white/10 p-4 space-y-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-white">
                                {r.wardName}
                            </p>
                            <span className="text-xs text-emerald-400 shrink-0 font-medium">
                                {r.percentOfTotal}% of total
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Assets</p>
                                <p className="text-xs text-white">{r.count}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Book Value</p>
                                <p className="text-xs font-medium text-white">{r.bookFormatted}</p>
                            </div>
                            <div className="col-span-2 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Acquisition Cost</p>
                                <p className="text-xs text-white/80">{r.costFormatted}</p>
                            </div>
                            <div className="col-span-2 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Depreciation</p>
                                <p className="text-xs text-red-300">{r.depreciationFormatted}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---- Desktop table (paginated) ---- */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {COLUMNS.map((c) => (
                                <th
                                    key={c.key}
                                    className={`text-${c.align} text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4`}
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((r) => (
                            <tr key={r.wardId} className="border-b border-b-[#3a3a3a]">
                                <td className="py-3 px-4 text-sm text-white font-medium">
                                    {r.wardName}
                                </td>
                                <td className="py-3 px-4 text-sm text-white text-right">
                                    {r.count}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/80 text-right">
                                    {r.costFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-white text-right">
                                    {r.bookFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-red-300 text-right">
                                    {r.depreciationFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-emerald-400 font-medium text-right">
                                    {r.percentOfTotal}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*
              Totals — outside the paginated slice, always visible.
              Tinted background, blue left accent.
            */}
            <div className="mt-4 bg-white/3 border-l-2 border-l-[#173ef0]">
                {/* Mobile totals */}
                <div className="sm:hidden p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                Summary
                            </p>
                            <p className="text-sm font-semibold text-white">
                                All Wards
                            </p>
                        </div>
                        <span className="text-xs text-emerald-400 shrink-0 font-medium">
                            100% of total
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Assets</p>
                            <p className="text-xs font-semibold text-white">{totals.count}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Book Value</p>
                            <p className="text-xs font-semibold text-white">{totals.bookFormatted}</p>
                        </div>
                        <div className="col-span-2 text-left">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Acquisition Cost</p>
                            <p className="text-xs font-semibold text-white">{totals.costFormatted}</p>
                        </div>
                        <div className="col-span-2 text-left">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Depreciation</p>
                            <p className="text-xs font-semibold text-red-300">{totals.depreciationFormatted}</p>
                        </div>
                    </div>
                </div>

                {/* Desktop totals */}
                <div className="hidden sm:flex items-center px-4 py-4 gap-4">
                    <div className="shrink-0">
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                            Summary
                        </p>
                        <p className="text-sm font-semibold text-white">
                            All Wards
                        </p>
                    </div>

                    <div className="flex-1 grid grid-cols-5 gap-4 ml-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Assets</p>
                            <p className="text-sm font-semibold text-white">{totals.count}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
                            <p className="text-sm font-semibold text-white">{totals.costFormatted}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Book Value</p>
                            <p className="text-sm font-semibold text-white">{totals.bookFormatted}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Depreciation</p>
                            <p className="text-sm font-semibold text-red-300">{totals.depreciationFormatted}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">% of Total</p>
                            <p className="text-sm font-semibold text-emerald-400">100%</p>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
        </div>
    );
};

export default WardBreakdownReport;