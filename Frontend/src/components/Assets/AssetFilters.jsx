import { FaSearch, FaTimes } from 'react-icons/fa';
import {
    MOCK_ASSET_CATEGORIES,
    MOCK_WARDS,
    ASSET_STATUSES,
} from '../mock/mockAssets';

const AssetFilters = ({ filters, onChange, resultCount }) => {
    /* Merge a single field into the parent's filter object */
    const setField = (key, value) =>
        onChange({ ...filters, [key]: value });

    /* True when any filter is active — controls the "Clear" button visibility */
    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.categoryId !== '' ||
        filters.wardId !== '' ||
        filters.status !== '';

    const clearAll = () =>
        onChange({
            search: '',
            categoryId: '',
            wardId: '',
            status: '',
        });

    return (
        <div className="p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search by code, title, description…"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                {/* Category */}
                <select
                    value={filters.categoryId}
                    onChange={(e) => setField('categoryId', e.target.value)}
                    className="w-full lg:w-48 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Categories</option>
                    {MOCK_ASSET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#242424]">
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* Ward */}
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

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Statuses</option>
                    {ASSET_STATUSES.map((s) => (
                        <option key={s.code} value={s.code} className="bg-[#242424]">
                            {s.label}
                        </option>
                    ))}
                </select>

                {/* Clear button — only when at least one filter is active */}
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

            {/* Result count */}
            <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-white/50">
                    Showing <span className="text-white font-medium">{resultCount}</span>{' '}
                    {resultCount === 1 ? 'asset' : 'assets'}
                    {hasAnyFilter && ' matching the current filters'}
                </p>
            </div>
        </div>
    );
};

export default AssetFilters;