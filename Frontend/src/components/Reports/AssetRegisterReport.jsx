import { useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { formatNprShort, methodLabel } from '../mock/mockValuation';
import {
    MOCK_ASSET_CATEGORIES,
    MOCK_WARDS,
    ASSET_STATUSES,
} from '../mock/mockAssets';

/* Column definitions — single source of truth for the table AND the CSV */
const COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'title', label: 'Title' },
    { key: 'categoryName', label: 'Category' },
    { key: 'wardName', label: 'Ward' },
    { key: 'acquisitionCostFormatted', label: 'Acquisition Cost' },
    { key: 'currentBookValueFormatted', label: 'Current Book Value' },
    { key: 'depreciationMethod', label: 'Method' },
    { key: 'statusLabel', label: 'Status' },
];

/* Render just the raw values for the CSV — formatted numbers without currency */
const CSV_COLUMNS = [
    { key: 'assetCode', label: 'Asset Code' },
    { key: 'title', label: 'Title' },
    { key: 'categoryName', label: 'Category' },
    { key: 'wardName', label: 'Ward' },
    { key: 'acquisitionCost', label: 'Acquisition Cost (NPR)' },
    { key: 'currentBookValue', label: 'Current Book Value (NPR)' },
    { key: 'depreciationMethod', label: 'Depreciation Method' },
    { key: 'statusLabel', label: 'Status' },
];

const AssetRegisterReport = () => {
    const { allAssets } = useAssets();

    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        wardId: '',
        status: '',
    });

    /*
      Build the display rows — join in the formatted fields the table
      renders and the raw fields the CSV uses.
    */
    const allRows = useMemo(() => {
        return allAssets().map((a) => ({
            ...a,
            acquisitionCostFormatted: formatNprShort(a.acquisitionCost),
            currentBookValueFormatted: formatNprShort(a.currentBookValue),
            depreciationMethod: methodLabel(a.depreciationMethod),
            statusLabel: a.statusMeta?.label ?? a.status,
        }));
    }, [allAssets]);

    /* Apply filters */
    const filteredRows = useMemo(() => {
        const q = filters.search.trim().toLowerCase();

        return allRows.filter((r) => {
            if (filters.categoryId && r.categoryId !== filters.categoryId) return false;
            if (filters.wardId && r.wardId !== filters.wardId) return false;
            if (filters.status && r.status !== filters.status) return false;

            if (q) {
                const haystack = [r.assetCode, r.title, r.categoryName]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [allRows, filters]);

    const setField = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.categoryId !== '' ||
        filters.wardId !== '' ||
        filters.status !== '';

    const clearAll = () =>
        setFilters({ search: '', categoryId: '', wardId: '', status: '' });

    return (
        <div>
            {/* Report header + export */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Asset Register
                    </h2>
                    <p className="text-sm text-white/50 mt-0.5">
                        Every registered asset with current values and status
                    </p>
                </div>
                <ReportExportButton
                    filename="asset-register"
                    columns={CSV_COLUMNS}
                    rows={filteredRows}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search by code, title, category…"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                <select
                    value={filters.categoryId}
                    onChange={(e) => setField('categoryId', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Categories</option>
                    {MOCK_ASSET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#242424]">
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.wardId}
                    onChange={(e) => setField('wardId', e.target.value)}
                    className="w-full lg:w-40 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Wards</option>
                    {MOCK_WARDS.map((w) => (
                        <option key={w.id} value={w.id} className="bg-[#242424]">
                            {w.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="w-full lg:w-48 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Statuses</option>
                    {ASSET_STATUSES.map((s) => (
                        <option key={s.code} value={s.code} className="bg-[#242424]">
                            {s.label}
                        </option>
                    ))}
                </select>

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
            {filteredRows.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No assets match the current filters.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {COLUMNS.map((c, i) => (
                                    <th
                                        key={c.key}
                                        className={`text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4 ${
                                            i >= 4 && i <= 5 ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {c.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((r) => (
                                <tr key={r.id} className="border-b border-b-[#3a3a3a]">
                                    <td className="py-3 px-4 text-sm text-white">
                                        {r.assetCode}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white truncate max-w-xs">
                                        {r.title}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80">
                                        {r.categoryName}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80">
                                        {r.wardName}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80 text-right">
                                        {r.acquisitionCostFormatted}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white text-right">
                                        {r.currentBookValueFormatted}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80">
                                        {r.depreciationMethod}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white/80">
                                        {r.statusLabel}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssetRegisterReport;