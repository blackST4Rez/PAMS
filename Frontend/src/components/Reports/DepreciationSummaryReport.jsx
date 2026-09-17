import { useMemo } from 'react';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { formatNprShort, methodLabel } from '../mock/mockValuation';
import { MOCK_ASSET_CATEGORIES } from '../mock/mockAssets';

const COLUMNS = [
    { key: 'categoryName', label: 'Category' },
    { key: 'methodLabel', label: 'Method' },
    { key: 'count', label: 'Assets' },
    { key: 'costFormatted', label: 'Total Cost' },
    { key: 'depreciationFormatted', label: 'Depreciation' },
    { key: 'bookFormatted', label: 'Current Book Value' },
    { key: 'depreciationRate', label: 'Rate' },
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

const DepreciationSummaryReport = () => {
    const { allAssets } = useAssets();

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

        /* CSV rows = data rows + totals row (same keys as CSV_COLUMNS) */
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

    return (
        <div>
            {/* Header + export */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {COLUMNS.map((c) => {
                                const numeric =
                                    c.key !== 'categoryName' &&
                                    c.key !== 'methodLabel';
                                return (
                                    <th
                                        key={c.key}
                                        className={`text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4 ${
                                            numeric ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {c.label}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr
                                key={r.categoryId}
                                className="border-b border-b-[#3a3a3a]"
                            >
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
                                <td className="py-3 px-4 text-sm text-white/60 text-right">
                                    {r.depreciationRate}%
                                </td>
                            </tr>
                        ))}

                        <tr className="border-t-2 border-t-white/20">
                            <td className="py-3 px-4 text-sm font-semibold text-white">
                                {totals.categoryName}
                            </td>
                            <td className="py-3 px-4 text-sm text-white/40">
                                {totals.methodLabel}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-white text-right">
                                {totals.count}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-white text-right">
                                {totals.costFormatted}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-red-300 text-right">
                                {totals.depreciationFormatted}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-white text-right">
                                {totals.bookFormatted}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-white/70 text-right">
                                {totals.depreciationRate}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepreciationSummaryReport;