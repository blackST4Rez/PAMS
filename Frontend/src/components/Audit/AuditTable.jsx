import { useState } from 'react';
import { FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';
import {
    AUDIT_ENTITY_TYPES,
    AUDIT_ACTIONS,
    getEntityMeta,
    getActionMeta,
    fmtAuditTime,
} from '../mock/mockAudit';

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const AuditTable = ({ entries, filters, onFiltersChange, actors, onRowClick }) => {
    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [page, setPage] = useState(1);

    const setField = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
        setPage(1);
    };

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.entityType !== '' ||
        filters.action !== '' ||
        filters.actor !== '';

    const clearAll = () => {
        onFiltersChange({ search: '', entityType: '', action: '', actor: '' });
        setPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = entries.slice(
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
                        placeholder="Search summary, entity, or actor…"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#1c1c1c] border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
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
                    value={filters.entityType}
                    onChange={(e) => setField('entityType', e.target.value)}
                    className="w-full lg:w-44 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Entities</option>
                    {AUDIT_ENTITY_TYPES.map((e) => (
                        <option key={e.code} value={e.code} className="bg-[#1c1c1c]">
                            {e.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.action}
                    onChange={(e) => setField('action', e.target.value)}
                    className="w-full lg:w-40 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Actions</option>
                    {AUDIT_ACTIONS.map((a) => (
                        <option key={a.code} value={a.code} className="bg-[#1c1c1c]">
                            {a.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.actor}
                    onChange={(e) => setField('actor', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#1c1c1c]">All Actors</option>
                    {actors.map((a) => (
                        <option key={a} value={a} className="bg-[#1c1c1c]">
                            {a}
                        </option>
                    ))}
                </select>
            </div>

            {entries.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No audit entries match the current filters.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards — unchanged ---- */}
                    <div className="lg:hidden space-y-3">
                        {paged.map((e) => {
                            const entityMeta = getEntityMeta(e.entityType);
                            const actionMeta = getActionMeta(e.action);

                            return (
                                <button
                                    type="button"
                                    key={e.id}
                                    onClick={() => onRowClick(e.id)}
                                    className="w-full text-left bg-[#1a1a1a] border border-white/10 p-4 space-y-3 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className={`text-xs font-medium shrink-0 ${entityMeta.color}`}>
                                            {entityMeta.label}
                                        </span>
                                        <span className="text-xs text-white/70 shrink-0">
                                            {actionMeta.label}
                                        </span>
                                    </div>

                                    <p className="text-sm font-semibold text-white leading-snug">
                                        {e.summary || '—'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Actor</p>
                                            <p className="text-xs text-white/80 truncate">{e.actor}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Time</p>
                                            <p className="text-xs text-white/80">{fmtAuditTime(e.at)}</p>
                                        </div>
                                        {e.entityId && (
                                            <div className="col-span-2">
                                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Entity ID</p>
                                                <p className="text-xs text-white/50 truncate">{e.entityId}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                                        <span className="text-xs text-white/50 inline-flex items-center gap-1.5">
                                            <FaEye className="w-3 h-3" />
                                            View details
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ---- Desktop table — fixed layout, smaller font, all columns visible ---- */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full border-collapse table-fixed">
                            <colgroup>
                                <col className="w-[14%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                                <col className="w-[38%]" />
                                <col className="w-[16%]" />
                                <col className="w-[12%]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Time
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Entity
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Action
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Summary
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Actor
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((e) => {
                                    const entityMeta = getEntityMeta(e.entityType);
                                    const actionMeta = getActionMeta(e.action);
                                    return (
                                        <tr
                                            key={e.id}
                                            className="border-b border-b-[#3a3a3a] cursor-pointer align-top"
                                            onClick={() => onRowClick(e.id)}
                                        >
                                            <td className="py-3 px-3 text-xs text-white/60">
                                                {fmtAuditTime(e.at)}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs font-medium ${entityMeta.color}`}>
                                                    {entityMeta.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="text-xs text-white/80">
                                                    {actionMeta.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <p className="text-xs text-white leading-snug">
                                                    {e.summary || '—'}
                                                </p>
                                                {e.entityId && (
                                                    <p className="text-[10px] text-white/40 mt-0.5 truncate">
                                                        {e.entityId}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-3">
                                                <p className="text-xs text-white/80 truncate">
                                                    {e.actor}
                                                </p>
                                            </td>
                                            <td
                                                className="py-3 px-3"
                                                onClick={(ev) => ev.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => onRowClick(e.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                                                    title="View details"
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                    View
                                                </button>
                                            </td>
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

export default AuditTable;