import { useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';
import ReportExportButton from './ReportExportButton';
import { useAssets } from '../Context/AssetsContext';
import { formatNprShort, methodLabel } from '../mock/mockValuation';
import {
    MOCK_ASSET_CATEGORIES,
    MOCK_WARDS,
    ASSET_STATUSES,
} from '../mock/mockAssets';

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

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const AssetRegisterReport = () => {
    const { allAssets } = useAssets();

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        wardId: '',
        status: '',
    });
    const [page, setPage] = useState(1);

    const allRows = useMemo(() => {
        return allAssets().map((a) => ({
            ...a,
            acquisitionCostFormatted: formatNprShort(a.acquisitionCost),
            currentBookValueFormatted: formatNprShort(a.currentBookValue),
            depreciationMethod: methodLabel(a.depreciationMethod),
            statusLabel: a.statusMeta?.label ?? a.status,
        }));
    }, [allAssets]);

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

    const setField = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.categoryId !== '' ||
        filters.wardId !== '' ||
        filters.status !== '';

    const clearAll = () => {
        setFilters({ search: '', categoryId: '', wardId: '', status: '' });
        setPage(1);
    };

    /* Pagination */
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = filteredRows.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    return (
        <div>
            {/* Header + export */}
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

            {/* Filter row — search + 3 dropdowns on one line at lg, stacked below */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search by code, title, category…"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                    {hasAnyFilter && (
                        <button
                            onClick={clearAll}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            aria-label="Clear filters"
                            title="Clear filters"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <select
                    value={filters.categoryId}
                    onChange={(e) => setField('categoryId', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Categories</option>
                    {MOCK_ASSET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#1c1c1c]">
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.wardId}
                    onChange={(e) => setField('wardId', e.target.value)}
                    className="w-full lg:w-40 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Wards</option>
                    {MOCK_WARDS.map((w) => (
                        <option key={w.id} value={w.id} className="bg-[#1c1c1c]">
                            {w.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="w-full lg:w-48 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Statuses</option>
                    {ASSET_STATUSES.map((s) => (
                        <option key={s.code} value={s.code} className="bg-[#1c1c1c]">
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            {filteredRows.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No assets match the current filters.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards ---- */}
                    <div className="sm:hidden space-y-3">
                        {paged.map((r) => (
                            <div
                                key={r.id}
                                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 space-y-3"
                            >
                                {/* Top — code + status */}
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">
                                        {r.assetCode}
                                    </p>
                                    <span className="text-xs font-medium text-white/80 shrink-0">
                                        {r.statusLabel}
                                    </span>
                                </div>

                                {/* Title */}
                                <p className="text-sm font-semibold text-white leading-snug">
                                    {r.title}
                                </p>

                                {/* Fields */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Category</p>
                                        <p className="text-xs text-white/80 truncate">
                                            {r.categoryName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Ward</p>
                                        <p className="text-xs text-white/80 truncate">
                                            {r.wardName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Cost</p>
                                        <p className="text-xs text-white/80">
                                            {r.acquisitionCostFormatted}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Book Value</p>
                                        <p className="text-xs font-medium text-white">
                                            {r.currentBookValueFormatted}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Method</p>
                                        <p className="text-xs text-white/60">
                                            {r.depreciationMethod}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ---- Desktop table ---- */}
                    <div className="hidden sm:block overflow-x-auto">
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
                                {paged.map((r) => (
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

                    <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
                </>
            )}
        </div>
    );
};

export default AssetRegisterReport;