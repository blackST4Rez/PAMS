import { useMemo, useState } from 'react';
import Pagination, { useIsMobile } from '../Common/Pagination';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { formatNprShort, methodLabel } from '../mock/mockValuation';
import { MOCK_ASSET_CATEGORIES } from '../mock/mockAssets';

const COLUMNS = [
    { key: 'categoryName', label: 'Category', align: 'left' },
    { key: 'methodLabel', label: 'Method', align: 'left' },
    { key: 'count', label: 'Assets', align: 'right' },
    { key: 'costFormatted', label: 'Total Cost', align: 'right' },
    { key: 'depreciationFormatted', label: 'Depreciation', align: 'right' },
    { key: 'bookFormatted', label: 'Current Book Value', align: 'right' },
    { key: 'depreciationRate', label: 'Rate', align: 'right' },
];

const CSV_COLUMNS = [
    { key: 'categoryName', label: 'Category' },
    { key: 'methodLabel', label: 'Depreciation Method' },
    { key: 'count', label: 'Assets' },
    { key: 'cost', label: 'Total Cost (NPR)' },
    { key: 'depreciation', label: 'Depreciation (NPR)' },
    { key: 'book', label: 'Current Book Value (NPR)' },
    { key: 'depreciationRate', label: 'Depreciation %' },
];

const MOBILE_PAGE_SIZE = 3;

const DepreciationSummaryReport = () => {
    const { allAssets } = useAssets();

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : Infinity;

    const [page, setPage] = useState(1);

    const { rows, totals, csvRows } = useMemo(() => {
        const assets = allAssets();

        const buckets = MOCK_ASSET_CATEGORIES.map((c) => ({
            categoryId: c.id,
            categoryName: c.name,
            methodCode: c.defaultDepreciationMethod,
            methodLabel: methodLabel(c.defaultDepreciationMethod),
            count: 0,
            cost: 0,
            book: 0,
        }));
        const bucketById = new Map(buckets.map((b) => [b.categoryId, b]));

        for (const a of assets) {
            const bucket = bucketById.get(a.categoryId);
            if (!bucket) continue;
            bucket.count += 1;
            bucket.cost += Number(a.acquisitionCost) || 0;
            bucket.book += Number(a.currentBookValue) || 0;
        }

        const rows = buckets.map((b) => {
            const depreciation = b.cost - b.book;
            const depreciationRate =
                b.cost > 0 ? Math.round((depreciation / b.cost) * 100) : 0;
            return {
                ...b,
                depreciation,
                depreciationRate,
                costFormatted: formatNprShort(b.cost),
                bookFormatted: formatNprShort(b.book),
                depreciationFormatted: formatNprShort(depreciation),
            };
        });

        const totals = {
            categoryName: 'Total',
            methodLabel: '',
            count: 0,
            cost: 0,
            book: 0,
            depreciation: 0,
            costFormatted: '',
            bookFormatted: '',
            depreciationFormatted: '',
            depreciationRate: 0,
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
        totals.depreciationRate =
            totals.cost > 0
                ? Math.round((totals.depreciation / totals.cost) * 100)
                : 0;

        const csvRows = [
            ...rows.map((r) => ({
                categoryName: r.categoryName,
                methodLabel: r.methodLabel,
                count: r.count,
                cost: r.cost,
                depreciation: r.depreciation,
                book: r.book,
                depreciationRate: r.depreciationRate,
            })),
            {
                categoryName: 'Total',
                methodLabel: '',
                count: totals.count,
                cost: totals.cost,
                depreciation: totals.depreciation,
                book: totals.book,
                depreciationRate: totals.depreciationRate,
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
                        Depreciation Summary
                    </h2>
                    <p className="text-sm text-white/50 mt-0.5">
                        Accumulated depreciation by asset category
                    </p>
                </div>
                <ReportExportButton
                    filename="depreciation-report"
                    columns={CSV_COLUMNS}
                    rows={csvRows}
                />
            </div>

            {/* ---- Mobile cards (paginated) ---- */}
            <div className="sm:hidden space-y-3">
                {paged.map((r) => (
                    <div
                        key={r.categoryId}
                        className="bg-[#1a1a1a] border border-white/10 p-4 space-y-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-white">
                                {r.categoryName}
                            </p>
                            <span className="text-xs text-emerald-400 shrink-0 font-medium">
                                {r.depreciationRate}% depreciated
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Method</p>
                                <p className="text-xs text-white/70 truncate">
                                    {r.methodLabel}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Assets</p>
                                <p className="text-xs text-white">{r.count}</p>
                            </div>
                            <div className="col-span-2 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
                                <p className="text-xs text-white/80">{r.costFormatted}</p>
                            </div>
                            <div className="col-span-2 text-left">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Depreciation</p>
                                <p className="text-xs text-red-300">{r.depreciationFormatted}</p>
                            </div>
                            <div className="col-span-2 text-right">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Current Book Value</p>
                                <p className="text-xs font-medium text-white">{r.bookFormatted}</p>
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
                            <tr key={r.categoryId} className="border-b border-b-[#3a3a3a]">
                                <td className="py-3 px-4 text-sm text-white font-medium">
                                    {r.categoryName}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/60">
                                    {r.methodLabel}
                                </td>
                                <td className="py-3 px-4 text-sm text-white text-right">
                                    {r.count}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/80 text-right">
                                    {r.costFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-red-300 text-right">
                                    {r.depreciationFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-white text-right">
                                    {r.bookFormatted}
                                </td>
                                <td className="py-3 px-4 text-sm text-emerald-400 font-medium text-right">
                                    {r.depreciationRate}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*
              Totals — outside pagination, always visible.
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
                                All Categories
                            </p>
                        </div>
                        <span className="text-xs text-emerald-400 shrink-0 font-medium">
                            {totals.depreciationRate}% depreciated
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
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Total Cost</p>
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
                            All Categories
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
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Rate</p>
                            <p className="text-sm font-semibold text-emerald-400">{totals.depreciationRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
        </div>
    );
};

export default DepreciationSummaryReport;