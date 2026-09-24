import { useMemo, useState } from 'react';
import { FaSearch, FaTimes, FaEdit } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';
import { useValuation } from '../Context/ValuationContext';
import {
    formatNprShort,
    methodLabel,
} from '../mock/mockValuation';
import { MOCK_ASSET_CATEGORIES } from '../mock/mockAssets';

const METHOD_FILTER_OPTIONS = [
    { value: '', label: 'All Methods' },
    { value: 'STRAIGHT_LINE', label: 'Straight Line' },
    { value: 'DECLINING_BALANCE', label: 'Declining Balance' },
    { value: 'NONE', label: 'None (Land)' },
];

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const AssetsValuationTable = ({
    assets,
    filters,
    onFiltersChange,
    canRevalue,
    onRevalue,
}) => {
    const { allRevaluations } = useValuation();

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    const revaluedAssetIds = useMemo(() => {
        const set = new Set();
        for (const r of allRevaluations()) set.add(r.assetId);
        return set;
    }, [allRevaluations]);

    const setField = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
        setPage(1);
    };

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.categoryId !== '' ||
        filters.method !== '';

    const clearAll = () => {
        onFiltersChange({ search: '', categoryId: '', method: '' });
        setPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(assets.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = assets.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

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
                        placeholder="Search by code, title, category…"
                        className="w-full pl-10 pr-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                <select
                    value={filters.categoryId}
                    onChange={(e) => setField('categoryId', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Categories</option>
                    {MOCK_ASSET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#1c1c1c]">
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.method}
                    onChange={(e) => setField('method', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {METHOD_FILTER_OPTIONS.map((opt) => (
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

            {assets.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No assets match the current filters.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards — unchanged ---- */}
                    <div className="lg:hidden space-y-3">
                        {paged.map((a) => {
                            const cost = Number(a.acquisitionCost) || 0;
                            const book = Number(a.currentBookValue) || 0;
                            const deprecated = cost - book;
                            const wasRevalued = revaluedAssetIds.has(a.id);
                            const isDepreciable = a.depreciationMethod !== 'NONE';

                            return (
                                <div
                                    key={a.id}
                                    className="bg-[#1a1a1a] border border-white/10 p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">
                                            {a.assetCode}
                                        </p>
                                        {wasRevalued && (
                                            <span className="text-[10px] font-medium text-[#7c8cff] uppercase tracking-wider shrink-0">
                                                Revalued
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm font-semibold text-white leading-snug">
                                        {a.title}
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Category
                                            </p>
                                            <p className="text-xs text-white/80 truncate">
                                                {a.categoryName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Method
                                            </p>
                                            <p className="text-xs text-white/80 truncate">
                                                {methodLabel(a.depreciationMethod)}
                                            </p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Cost
                                            </p>
                                            <p className="text-xs text-white/80">
                                                {formatNprShort(cost)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Book Value
                                            </p>
                                            <p className="text-xs font-medium text-white">
                                                {formatNprShort(book)}
                                            </p>
                                        </div>
                                    </div>

                                    {isDepreciable && deprecated > 0 && (
                                        <p className="text-xs text-red-300">
                                            −{formatNprShort(deprecated)} depreciated
                                        </p>
                                    )}
                                    {!isDepreciable && (
                                        <p className="text-xs text-white/40">
                                            Non-depreciable
                                        </p>
                                    )}

                                    {canRevalue && (
                                        <div className="pt-3 border-t border-white/5 flex justify-end">
                                            <button
                                                onClick={() => onRevalue(a.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <FaEdit className="w-3 h-3" />
                                                Revalue
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ---- Desktop table — smaller font so headers + data fit ---- */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-0 pr-3 whitespace-nowrap">
                                        Asset
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-3 pr-3 whitespace-nowrap">
                                        Category
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-3 pr-3 whitespace-nowrap">
                                        Acquisition Cost
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-3 pr-3 whitespace-nowrap">
                                        Method
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-3 pr-3 whitespace-nowrap">
                                        Current Book Value
                                    </th>
                                    {canRevalue && (
                                        <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 pl-3 pr-0 whitespace-nowrap">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((a) => {
                                    const cost = Number(a.acquisitionCost) || 0;
                                    const book = Number(a.currentBookValue) || 0;
                                    const deprecated = cost - book;
                                    const wasRevalued = revaluedAssetIds.has(a.id);
                                    const isDepreciable = a.depreciationMethod !== 'NONE';

                                    return (
                                        <tr key={a.id} className="border-b border-b-[#3a3a3a] align-top">
                                            <td className="py-3 pl-0 pr-3 overflow-hidden">
                                                <p className="text-xs font-medium text-white leading-snug">
                                                    {a.title}
                                                </p>
                                                <p className="text-[10px] text-white/40 mt-0.5 flex items-center gap-2">
                                                    <span className="truncate">{a.assetCode}</span>
                                                    {wasRevalued && (
                                                        <span className="text-[10px] font-medium text-[#7c8cff] uppercase tracking-wider shrink-0">
                                                            Revalued
                                                        </span>
                                                    )}
                                                </p>
                                            </td>

                                            <td className="py-3 pl-3 pr-3 overflow-hidden">
                                                <p className="text-xs text-white/80 leading-snug">
                                                    {a.categoryName}
                                                </p>
                                            </td>

                                            <td className="py-3 pl-3 pr-3 overflow-hidden">
                                                <p className="text-xs text-white/80 whitespace-nowrap">
                                                    {formatNprShort(cost)}
                                                </p>
                                            </td>

                                            <td className="py-3 pl-3 pr-3 overflow-hidden">
                                                <p className="text-xs text-white/80 leading-snug whitespace-nowrap">
                                                    {methodLabel(a.depreciationMethod)}
                                                </p>
                                                {isDepreciable && a.usefulLifeYears && (
                                                    <p className="text-[10px] text-white/40 mt-0.5 whitespace-nowrap">
                                                        {a.usefulLifeYears} yr life
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-3 pl-3 pr-3 overflow-hidden">
                                                <p className="text-xs font-medium text-white whitespace-nowrap">
                                                    {formatNprShort(book)}
                                                </p>
                                                {isDepreciable && deprecated > 0 && (
                                                    <p className="text-[10px] text-red-300 mt-0.5 whitespace-nowrap">
                                                        −{formatNprShort(deprecated)} depreciated
                                                    </p>
                                                )}
                                                {!isDepreciable && (
                                                    <p className="text-[10px] text-white/40 mt-0.5 whitespace-nowrap">
                                                        Non-depreciable
                                                    </p>
                                                )}
                                            </td>

                                            {canRevalue && (
                                                <td className="py-3 pl-3 pr-0 overflow-hidden">
                                                    <button
                                                        onClick={() => onRevalue(a.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                        Revalue
                                                    </button>
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

export default AssetsValuationTable;