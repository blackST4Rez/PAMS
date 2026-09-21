import { useMemo, useState } from 'react';
import { FaEye, FaCheck } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';
import { useAuth } from '../Context/AuthContext';
import { formatNPR } from '../utils/formatCurrency';

const STATUS_TEXT = {
    AWAITING_REVIEW: 'text-yellow-300',
    ACTIVE: 'text-green-300',
    MAINTENANCE: 'text-orange-300',
    RETIRED: 'text-gray-300',
    CANCELLED: 'text-red-300',
};

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const AssetsTable = ({ assets, onRowClick }) => {
    const { hasPermission } = useAuth();
    const canApprove = hasPermission('asset.approve');

    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    /* Pagination over the assets passed in (already filtered by AssetFilters) */
    const totalPages = Math.max(1, Math.ceil(assets.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = useMemo(
        () =>
            assets.slice(
                (safePage - 1) * pageSize,
                safePage * pageSize
            ),
        [assets, safePage, pageSize]
    );

    if (assets.length === 0) {
        return (
            <div className="bg-[#242424] p-4 sm:p-6">
                <p className="text-white/50 text-sm py-8 text-center">
                    No assets match the current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* ---- Mobile cards ---- */}
            <div className="sm:hidden space-y-3">
                {paged.map((a) => {
                    const statusClass =
                        STATUS_TEXT[a.status] ?? 'text-white/60';

                    return (
                        <button
                            type="button"
                            key={a.id}
                            onClick={() => onRowClick(a.id)}
                            className="w-full text-left bg-[#1a1a1a] border border-white/10 p-4 space-y-3 hover:border-white/20 transition-colors"
                        >
                            {/* Top — code + status */}
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">
                                    {a.assetCode}
                                </p>
                                <span className={`text-xs font-medium shrink-0 ${statusClass}`}>
                                    {a.statusMeta.label}
                                </span>
                            </div>

                            {/* Title */}
                            <p className="text-sm font-semibold text-white leading-snug">
                                {a.title}
                            </p>

                            {/* Fields */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                        Category
                                    </p>
                                    <p className="text-xs text-white/80 truncate">
                                        {a.categoryName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                        Ward
                                    </p>
                                    <p className="text-xs text-white/80 truncate">
                                        {a.wardName}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                        Acquisition Cost
                                    </p>
                                    <p className="text-xs text-white/80">
                                        {formatNPR(a.acquisitionCost)}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-white/50 inline-flex items-center gap-1.5">
                                    <FaEye className="w-3 h-3" />
                                    View details
                                </span>
                                {canApprove && a.status === 'AWAITING_REVIEW' && (
                                    <span className="text-xs font-medium text-green-400 inline-flex items-center gap-1.5">
                                        <FaCheck className="w-3 h-3" />
                                        Ready to review
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ---- Desktop table ---- */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Code
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Title
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Category
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Ward
                            </th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Cost
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Status
                            </th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((a) => (
                            <tr
                                key={a.id}
                                className="border-b border-b-[#3a3a3a] hover:bg-white/2 transition-colors cursor-pointer"
                                onClick={() => onRowClick(a.id)}
                            >
                                <td className="py-3 px-4 text-sm font-medium text-white">
                                    {a.assetCode}
                                </td>
                                <td className="py-3 px-4 text-sm text-white truncate max-w-xs">
                                    {a.title}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/80">
                                    {a.categoryName}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/80">
                                    {a.wardName}
                                </td>
                                <td className="py-3 px-4 text-sm text-white/80 text-right">
                                    {formatNPR(a.acquisitionCost)}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs font-medium ${STATUS_TEXT[a.status] ?? 'text-white/60'}`}>
                                        {a.statusMeta.label}
                                    </span>
                                </td>
                                <td
                                    className="py-3 px-4 text-right"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => onRowClick(a.id)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <FaEye className="w-3 h-3" />
                                        View
                                    </button>
                                    {canApprove && a.status === 'AWAITING_REVIEW' && (
                                        <button
                                            onClick={() => onRowClick(a.id)}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 ml-2 rounded-md text-green-400 hover:bg-green-500/10 transition-colors"
                                        >
                                            <FaCheck className="w-3 h-3" />
                                            Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={safePage}
                totalPages={totalPages}
                onPage={setPage}
            />
        </div>
    );
};

export default AssetsTable;