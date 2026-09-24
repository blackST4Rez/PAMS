import { useMemo, useState } from 'react';
import { FaSearch, FaEye, FaLock } from 'react-icons/fa';
import Pagination, { useIsMobile } from '../Common/Pagination';

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const RolesTable = ({ roles, users, onRowClick }) => {
    const isMobile = useIsMobile();
    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    /* Count users per role */
    const userCountByRole = useMemo(() => {
        const counts = {};
        for (const u of users) {
            for (const r of u.roles ?? []) {
                counts[r] = (counts[r] ?? 0) + 1;
            }
        }
        return counts;
    }, [users]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return roles;

        return roles.filter((r) => {
            const haystack = [r.code, r.label, r.description]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [roles, search]);

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

    return (
        <div className="p-4 sm:p-6">
            {/* Search */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by name, code, or description…"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#1c1c1c] border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No roles match your search.
                </p>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-3">
                        {paged.map((r) => {
                            const count = userCountByRole[r.code] ?? 0;
                            return (
                                <button
                                    type="button"
                                    key={r.code}
                                    onClick={() => onRowClick(r.code)}
                                    className="w-full text-left bg-[#1a1a1a] border border-white/10 p-4 space-y-3 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">
                                                {r.label}
                                            </p>
                                            <p className="text-xs text-white/40 font-mono mt-0.5 truncate">
                                                {r.code}
                                            </p>
                                        </div>
                                        {r.isSystem && (
                                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
                                                <FaLock className="w-3 h-3" />
                                                System
                                            </span>
                                        )}
                                    </div>

                                    {r.description && (
                                        <p className="text-xs text-white/60 leading-snug">
                                            {r.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Permissions
                                            </p>
                                            <p className="text-xs text-white/80">
                                                {(r.permissions ?? []).length}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Users
                                            </p>
                                            <p className="text-xs text-white/80">
                                                {count}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                                        <span className="text-xs text-white/50 inline-flex items-center gap-1.5">
                                            <FaEye className="w-3 h-3" />
                                            Manage permissions
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Role
                                    </th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Description
                                    </th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Permissions
                                    </th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Users
                                    </th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((r) => {
                                    const count = userCountByRole[r.code] ?? 0;
                                    return (
                                        <tr
                                            key={r.code}
                                            className="border-b border-b-[#3a3a3a] cursor-pointer hover:bg-white/2 transition-colors"
                                            onClick={() => onRowClick(r.code)}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white">
                                                        {r.label}
                                                    </p>
                                                    {r.isSystem && (
                                                        <FaLock className="w-3 h-3 text-white/40" title="System role" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/40 font-mono mt-0.5">
                                                    {r.code}
                                                </p>
                                            </td>

                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/70 truncate max-w-md">
                                                    {r.description || '—'}
                                                </p>
                                            </td>

                                            <td className="py-3 px-4 text-right">
                                                <p className="text-sm text-white/80">
                                                    {(r.permissions ?? []).length}
                                                </p>
                                            </td>

                                            <td className="py-3 px-4 text-right">
                                                <p className="text-sm text-white/80">
                                                    {count}
                                                </p>
                                            </td>

                                            <td
                                                className="py-3 px-4 text-right"
                                                onClick={(ev) => ev.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => onRowClick(r.code)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={safePage}
                        totalPages={totalPages}
                        onPage={setPage}
                    />
                </>
            )}
        </div>
    );
};

export default RolesTable;