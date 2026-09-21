import { useMemo, useState } from 'react';
import {
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaSearch,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '../Common/Pagination';
import { useAuth } from '../Context/AuthContext';

const ROLE_OPTIONS = [
    { code: 'SYS_ADMIN', label: 'System Admin' },
    { code: 'ASSET_MANAGER', label: 'Asset Manager' },
    { code: 'FINANCE_OFFICER', label: 'Finance Officer' },
    { code: 'FIELD_OFFICER', label: 'Field Officer' },
    { code: 'AUDITOR', label: 'Auditor' },
    { code: 'PUBLIC_USER', label: 'Public User' },
];

const roleLabel = (code) =>
    ROLE_OPTIONS.find((r) => r.code === code)?.label ?? code;

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const PendingRegistrationsTable = () => {
    const { pendingRegistrations, approveRegistration, rejectRegistration } = useAuth();

    const [roleSelections, setRoleSelections] = useState({});
    const [confirmAction, setConfirmAction] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const setRole = (username, role) =>
        setRoleSelections((prev) => ({ ...prev, [username]: role }));

    const askApprove = (user) => setConfirmAction({ type: 'approve', user });
    const askReject = (user) => setConfirmAction({ type: 'reject', user });

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return pendingRegistrations;

        return pendingRegistrations.filter((p) => {
            const haystack = [p.fullName, p.username, p.email, p.ward]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [pendingRegistrations, search]);

    const pageSize =
        typeof window !== 'undefined' && window.innerWidth < 640
            ? MOBILE_PAGE_SIZE
            : DESKTOP_PAGE_SIZE;

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

    const runAction = () => {
        if (!confirmAction) return;
        const { type, user } = confirmAction;
        const username = user.username;

        try {
            if (type === 'approve') {
                const role = roleSelections[username] ?? 'PUBLIC_USER';
                approveRegistration(username, role);
                toast.success(`Approved @${username} as ${roleLabel(role)}`);
            } else {
                rejectRegistration(username);
                toast.success(`Registration for @${username} rejected`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setConfirmAction(null);
        }
    };

    if (pendingRegistrations.length === 0) {
        return (
            <div className="p-4 sm:p-6 mb-4">
                <h2 className="text-lg font-semibold text-white mb-4">
                    Pending Registrations
                </h2>
                <p className="bg-[#282828] rounded-lg text-white/50 text-sm py-6 text-center">
                    No pending registrations.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 flex-wrap">
                Pending Registrations
                <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                    {filtered.length}
                </span>
            </h2>

            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by name, username, or email…"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    No pending registrations match your search.
                </p>
            ) : (
                <>
                    <div className="sm:hidden space-y-3">
                        {paged.map((p) => (
                            <div
                                key={p.id}
                                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-300 text-base font-bold shrink-0">
                                        {(p.fullName || p.username).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{p.fullName}</p>
                                        <p className="text-xs text-white/50 truncate">@{p.username}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Contact</p>
                                        <p className="text-xs text-white/80 truncate">{p.email}</p>
                                        {p.phone && <p className="text-xs text-white/50 truncate">{p.phone}</p>}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Ward</p>
                                        <p className="text-xs text-white/80">{p.ward || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Requested</p>
                                        <p className="text-xs text-white/80">
                                            {p.requestedAt
                                                ? new Date(p.requestedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Assign Role</p>
                                    <select
                                        value={roleSelections[p.username] ?? 'PUBLIC_USER'}
                                        onChange={(e) => setRole(p.username, e.target.value)}
                                        className="w-full text-xs font-medium px-2.5 py-2 rounded-lg bg-[#242424] border border-white/10 text-white cursor-pointer"
                                    >
                                        {ROLE_OPTIONS.map((opt) => (
                                            <option key={opt.code} value={opt.code} className="bg-[#242424]">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                                    <button
                                        onClick={() => askApprove(p)}
                                        className="text-xs font-medium px-3 py-2 rounded-lg text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <FaCheck className="w-3 h-3" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => askReject(p)}
                                        className="text-xs font-medium px-3 py-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pr-4">Applicant</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Contact</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Ward</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Assign Role</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((p) => (
                                    <tr key={p.id} className="border-b border-b-[#3a3a3a]">
                                        <td className="py-2 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-300 text-sm font-bold">
                                                    {(p.fullName || p.username).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{p.fullName}</p>
                                                    <p className="text-xs text-white/40">@{p.username}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-2 px-4">
                                            <p className="text-sm text-white/80">{p.email}</p>
                                            {p.phone && <p className="text-xs text-white/40">{p.phone}</p>}
                                        </td>

                                        <td className="py-2 px-4">
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/70">
                                                {p.ward || '—'}
                                            </span>
                                        </td>

                                        <td className="py-2 px-4">
                                            <select
                                                value={roleSelections[p.username] ?? 'PUBLIC_USER'}
                                                onChange={(e) => setRole(p.username, e.target.value)}
                                                className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                            >
                                                {ROLE_OPTIONS.map((opt) => (
                                                    <option key={opt.code} value={opt.code} className="bg-[#242424]">
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="py-2 text-left">
                                            <button
                                                onClick={() => askApprove(p)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 mr-2 rounded-md text-green-400 hover:bg-green-500/10 transition-colors"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => askReject(p)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
                </>
            )}

            {confirmAction && (
                <ConfirmDialog
                    action={confirmAction}
                    selectedRole={
                        roleSelections[confirmAction.user.username] ?? 'PUBLIC_USER'
                    }
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runAction}
                />
            )}
        </div>
    );
};

const ConfirmDialog = ({ action, selectedRole, onCancel, onConfirm }) => {
    const { type, user } = action;
    const isApprove = type === 'approve';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={onCancel}
        >
            <div
                className="bg-[#242424] rounded-xl w-full max-w-md p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${
                            isApprove
                                ? 'bg-[#1a1a1a] text-green-400'
                                : 'bg-[#1a1a1a] text-red-400'
                        }`}
                    >
                        {isApprove ? (
                            <FaCheck className="w-5 h-5" />
                        ) : (
                            <FaExclamationTriangle className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                            {isApprove ? 'Approve registration?' : 'Reject registration?'}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                            {isApprove
                                ? 'This will grant the user access to the system.'
                                : 'This action cannot be undone.'}
                        </p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 space-y-2">
                    <div className="flex justify-between text-sm gap-4">
                        <span className="text-white/50 shrink-0">Name</span>
                        <span className="text-white font-medium text-right truncate">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm gap-4">
                        <span className="text-white/50 shrink-0">Username</span>
                        <span className="text-white font-medium text-right truncate">@{user.username}</span>
                    </div>
                    <div className="flex justify-between text-sm gap-4">
                        <span className="text-white/50 shrink-0">Email</span>
                        <span className="text-white font-medium text-right truncate">{user.email}</span>
                    </div>
                    {isApprove && (
                        <div className="flex justify-between text-sm gap-4">
                            <span className="text-white/50 shrink-0">Assign role</span>
                            <span className="text-white font-medium text-right">{roleLabel(selectedRole)}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                            isApprove
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isApprove ? 'Yes, approve' : 'Yes, reject'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingRegistrationsTable;