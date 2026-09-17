import { FaTimes } from 'react-icons/fa';
import {
    MOCK_ASSET_CATEGORIES,
    MOCK_WARDS,
    ASSET_STATUSES,
} from '../mock/mockAssets';

const GisFilters = ({ filters, onChange, resultCount, totalCount }) => {
    const setField = (key, value) =>
        onChange({ ...filters, [key]: value });

    const hasAnyFilter =
        filters.categoryId !== '' ||
        filters.wardId !== '' ||
        filters.status !== '';

    const clearAll = () =>
        onChange({ categoryId: '', wardId: '', status: '' });

    return (
        <div className="p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Category */}
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

                {/* Clear */}
                {hasAnyFilter && (
                    <button
                        onClick={clearAll}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                        <FaTimes className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}

                {/* Count — right-aligned on wide screens */}
                <div className="flex-1 hidden lg:flex items-center justify-end">
                    <p className="text-xs text-white/50">
                        Showing{' '}
                        <span className="text-white font-medium">{resultCount}</span>
                        {totalCount !== resultCount && (
                            <> of <span className="text-white">{totalCount}</span></>
                        )}{' '}
                        {totalCount === 1 ? 'asset' : 'assets'} on the map
                    </p>
                </div>
            </div>

            {/* Count on narrow screens */}
            <div className="lg:hidden mt-3">
                <p className="text-xs text-white/50">
                    Showing{' '}
                    <span className="text-white font-medium">{resultCount}</span>
                    {totalCount !== resultCount && (
                        <> of <span className="text-white">{totalCount}</span></>
                    )}{' '}
                    {totalCount === 1 ? 'asset' : 'assets'} on the map
                </p>
            </div>
        </div>
    );
};

export default GisFilters;