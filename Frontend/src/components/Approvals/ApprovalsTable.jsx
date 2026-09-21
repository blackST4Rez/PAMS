import { useMemo, useState } from 'react';
import { FaSearch, FaEye, FaUserShield } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';
import {
    REQUEST_STATUSES,
    getEntityType,
} from '../mock/mockApprovals';

const ROLE_LABELS = {
    SYS_ADMIN: 'System Admin',
    ASSET_MANAGER: 'Asset Manager',
    FINANCE_OFFICER: 'Finance Officer',
    FIELD_OFFICER: 'Field Officer',
    AUDITOR: 'Auditor',
    PUBLIC_USER: 'Public User',
};

const roleLabel = (code) => ROLE_LABELS[code] ?? code;

const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const ApprovalsTable = ({ requests, onRowClick, showCurrentOwner = false }) => {
    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    /* Search filter */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return requests;

        return requests.filter((r) => {
            const haystack = [r.title, r.entityId, r.requestedBy]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [requests, search]);

    /* Pagination */
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (!requests || requests.length === 0) {
        return null; // parent handles empty states
    }

    return (
        <div className="rounded-xl p-4 sm:p-6">
            {/* Search bar */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by title, entity, or requester…"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No requests match your search.
                </p>
            ) : (
                <>
                    {/* ---- Mobile cards ---- */}
                    <div className="sm:hidden space-y-3">
                        {paged.map((r) => {
                            const statusMeta =
                                REQUEST_STATUSES[r.status] ?? REQUEST_STATUSES.Pending;
                            const entity = getEntityType(r.entityName);

                            const currentStep = r.steps.find(
                                (s) => s.level === r.currentLevel
                            );
                            const ownerRole = currentStep?.approverRoleCode;
                            const isTerminal =
                                r.status === 'Approved' ||
                                r.status === 'Rejected' ||
                                r.status === 'Cancelled';

                            return (
                                <button
                                    type="button"
                                    key={r.id}
                                    onClick={() => onRowClick(r.id)}
                                    className="w-full text-left bg-[#1a1a1a] border border-white/10 rounded-xl p-4 space-y-3 hover:border-white/20 transition-colors"
                                >
                                    {/* Top — id + status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">
                                            {r.id}
                                        </p>
                                        <span className={`text-xs font-medium shrink-0 ${statusMeta.color}`}>
                                            {statusMeta.label}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <p className="text-sm font-semibold text-white leading-snug">
                                        {r.title}
                                    </p>

                                    {/* Fields */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Type</p>
                                            <p className="text-xs text-white/80 truncate">
                                                {entity?.label ?? r.entityName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Level</p>
                                            <p className="text-xs text-white/80">
                                                {isTerminal
                                                    ? `${r.currentLevel} of ${r.totalLevels}`
                                                    : `Level ${r.currentLevel} of ${r.totalLevels}`}
                                            </p>
                                        </div>
                                        {showCurrentOwner && !isTerminal && ownerRole && (
                                            <div className="col-span-2">
                                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Current Owner</p>
                                                <p className="text-xs font-medium text-[#7c8cff] inline-flex items-center gap-1.5">
                                                    <FaUserShield className="w-3 h-3" />
                                                    {roleLabel(ownerRole)}
                                                </p>
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Requested</p>
                                            <p className="text-xs text-white/80">{fmtDate(r.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Footer hint */}
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

                    {/* ---- Desktop table ---- */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Request</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Type</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Level</th>
                                    {showCurrentOwner && (
                                        <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Current Owner</th>
                                    )}
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Status</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Requested</th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((r) => {
                                    const statusMeta =
                                        REQUEST_STATUSES[r.status] ?? REQUEST_STATUSES.Pending;
                                    const entity = getEntityType(r.entityName);

                                    const currentStep = r.steps.find(
                                        (s) => s.level === r.currentLevel
                                    );
                                    const ownerRole = currentStep?.approverRoleCode;
                                    const isTerminal =
                                        r.status === 'Approved' ||
                                        r.status === 'Rejected' ||
                                        r.status === 'Cancelled';

                                    return (
                                        <tr
                                            key={r.id}
                                            className="border-b border-b-[#3a3a3a] cursor-pointer"
                                            onClick={() => onRowClick(r.id)}
                                        >
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-medium text-white truncate max-w-md">{r.title}</p>
                                                <p className="text-xs text-white/40 mt-0.5">{r.id}</p>
                                            </td>

                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/80">{entity?.label ?? r.entityName}</p>
                                            </td>

                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/80">
                                                    {isTerminal
                                                        ? `${r.currentLevel} of ${r.totalLevels}`
                                                        : `Level ${r.currentLevel} of ${r.totalLevels}`}
                                                </p>
                                            </td>

                                            {showCurrentOwner && (
                                                <td className="py-3 px-4">
                                                    {isTerminal ? (
                                                        <span className="text-xs text-white/40">—</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7c8cff]">
                                                            <FaUserShield className="w-3 h-3" />
                                                            {roleLabel(ownerRole)}
                                                        </span>
                                                    )}
                                                </td>
                                            )}

                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-medium ${statusMeta.color}`}>
                                                    {statusMeta.label}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/70">{fmtDate(r.createdAt)}</p>
                                            </td>

                                            <td
                                                className="py-3 px-4 text-right"
                                                onClick={(ev) => ev.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => onRowClick(r.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-white/70 hover:text-white transition-colors"
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

export default ApprovalsTable;