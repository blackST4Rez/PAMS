import { FaSearch, FaTimes, FaEye } from 'react-icons/fa';
import {
    AUDIT_ENTITY_TYPES,
    AUDIT_ACTIONS,
    getEntityMeta,
    getActionMeta,
    fmtAuditTime,
} from '../mock/mockAudit';

const AuditTable = ({ entries, filters, onFiltersChange, actors, onRowClick }) => {
    const setField = (key, value) =>
        onFiltersChange({ ...filters, [key]: value });

    const hasAnyFilter =
        filters.search.trim() !== '' ||
        filters.entityType !== '' ||
        filters.action !== '' ||
        filters.actor !== '';

    const clearAll = () =>
        onFiltersChange({ search: '', entityType: '', action: '', actor: '' });

    return (
        <div className="p-2">
            {/* Filter row */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setField('search', e.target.value)}
                        placeholder="Search by summary, entity id, actor…"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                    />
                </div>

                <select
                    value={filters.entityType}
                    onChange={(e) => setField('entityType', e.target.value)}
                    className="w-full lg:w-44 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Entities</option>
                    {AUDIT_ENTITY_TYPES.map((e) => (
                        <option key={e.code} value={e.code} className="bg-[#242424]">
                            {e.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.action}
                    onChange={(e) => setField('action', e.target.value)}
                    className="w-full lg:w-40 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Actions</option>
                    {AUDIT_ACTIONS.map((a) => (
                        <option key={a.code} value={a.code} className="bg-[#242424]">
                            {a.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.actor}
                    onChange={(e) => setField('actor', e.target.value)}
                    className="w-full lg:w-52 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#242424]">All Actors</option>
                    {actors.map((a) => (
                        <option key={a} value={a} className="bg-[#242424]">
                            {a}
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

            {/* Empty state */}
            {entries.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No audit entries match the current filters.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Time
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Entity
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Action
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Summary
                                </th>
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Actor
                                </th>
                                <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((e) => {
                                const entityMeta = getEntityMeta(e.entityType);
                                const actionMeta = getActionMeta(e.action);
                                return (
                                    <tr
                                        key={e.id}
                                        className="border-b border-b-[#3a3a3a] cursor-pointer"
                                        onClick={() => onRowClick(e.id)}
                                    >
                                        <td className="py-3 px-4 text-xs text-white/60 whitespace-nowrap">
                                            {fmtAuditTime(e.at)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`text-sm font-medium ${entityMeta.color}`}
                                            >
                                                {entityMeta.label}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-white/80">
                                                {actionMeta.label}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white truncate max-w-md">
                                                {e.summary || '—'}
                                            </p>
                                            {e.entityId && (
                                                <p className="text-xs text-white/40 mt-0.5">
                                                    {e.entityId}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white/80">
                                                {e.actor}
                                            </p>
                                        </td>
                                        <td
                                            className="py-3 px-4"
                                            onClick={(ev) => ev.stopPropagation()}
                                        >
                                            <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                <button
                                                    onClick={() => onRowClick(e.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    title="View details"
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AuditTable;