import { useMemo } from 'react';
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

const WardBreakdownReport = () => {
    const { allAssets } = useAssets();

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

        /* Totals */
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

        /*
          CSV rows = data rows + totals row.
          The totals row uses the same keys as the CSV column definitions,
          so ReportExportButton handles it without special-casing.
        */
        const csvRows = [
            ...rows,
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

    return (
        <div>
            {/* Header + export */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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

            {/* Table */}
            <div className="overflow-x-auto">
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
                        {rows.map((r) => (
                            <tr key={r.wardId}>
                                {COLUMNS.map((c) => {
                                    let cls = `py-3 px-4 text-sm text-${c.align} border-b border-b-[#3a3a3a]`;
                                    if (c.key === 'wardName') {
                                        cls += ' text-white font-medium';
                                    } else if (c.key === 'depreciationFormatted') {
                                        cls += ' text-red-300';
                                    } else if (c.key === 'percentOfTotal') {
                                        cls += ' text-white/60';
                                    } else if (c.key === 'count' || c.key === 'bookFormatted') {
                                        cls += ' text-white';
                                    } else {
                                        cls += ' text-white/80';
                                    }
                                    return (
                                        <td key={c.key} className={cls}>
                                            {r[c.key]}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        <tr>
                            {COLUMNS.map((c) => {
                                let cls = `py-3 px-4 text-${c.align} border-t-2 border-t-white/20`;
                                if (c.key === 'wardName') {
                                    cls += ' text-sm font-semibold text-white';
                                } else if (c.key === 'depreciationFormatted') {
                                    cls += ' text-sm font-semibold text-red-300';
                                } else if (c.key === 'percentOfTotal') {
                                    cls += ' text-sm font-semibold text-white/70';
                                } else {
                                    cls += ' text-sm font-semibold text-white';
                                }
                                return (
                                    <td key={c.key} className={cls}>
                                        {totals[c.key]}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WardBreakdownReport;