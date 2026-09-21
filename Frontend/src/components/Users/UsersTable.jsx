import { useMemo, useState } from 'react';
import { FaExclamationTriangle, FaCheck, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import Pagination from '../Common/Pagination';
import { useAuth } from '../Context/AuthContext';

const ROLE_SCHEMA = {
    SYS_ADMIN: { label: 'System Admin', color: 'text-purple-300' },
    ASSET_MANAGER: { label: 'Asset Manager', color: 'text-blue-300' },
    FINANCE_OFFICER: { label: 'Finance Officer', color: 'text-green-300' },
    FIELD_OFFICER: { label: 'Field Officer', color: 'text-yellow-300' },
    AUDITOR: { label: 'Auditor', color: 'text-orange-300' },
    PUBLIC_USER: { label: 'Public User', color: 'text-gray-300' },
};

const STATUS_SCHEMA = {
    Active: { color: 'bg-[#1a1a1a] text-green-300' },
    Inactive: { color: 'bg-[#1a1a1a] text-red-400' },
};

const MOBILE_PAGE_SIZE = 3;
const DESKTOP_PAGE_SIZE = 8;

const UsersTable = () => {
    const { allUsers, updateUserRole, updateUserStatus, deleteUser } = useAuth();
    const users = allUsers();

    const [confirmAction, setConfirmAction] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;

        return users.filter((u) => {
            const haystack = [u.fullName, u.username, u.email]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [users, search]);

    /* Responsive page size */
    const pageSize =
        typeof window !== 'undefined' && window.innerWidth < 640
            ? MOBILE_PAGE_SIZE
            : DESKTOP_PAGE_SIZE;

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pagedUsers = filteredUsers.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const clearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const handleRoleChange = (username, newRole) => {
        updateUserRole(username, newRole);
    };

    const askToggleStatus = (user) => {
        setConfirmAction({
            type: user.status === 'Active' ? 'deactivate' : 'activate',
            user,
        });
    };

    const askDelete = (user) => {
        setConfirmAction({ type: 'delete', user });
    };

    const runAction = () => {
        if (!confirmAction) return;
        const { type, user } = confirmAction;

        try {
            if (type === 'deactivate' || type === 'activate') {
                updateUserStatus(
                    user.username,
                    type === 'deactivate' ? 'Inactive' : 'Active'
                );
            } else if (type === 'delete') {
                deleteUser(user.username);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setConfirmAction(null);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                    Active Users
                    <span className="ml-2 text-sm font-normal px-2 py-0.5 bg-emerald-400 text-black rounded-full">
                        {filteredUsers.length}
                    </span>
                </h2>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by name, username, or email…"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#1c1c1c] border border-white/10 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] transition"
                />
                {search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                )}
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center">
                    {search ? 'No users match your search.' : 'No users yet.'}
                </p>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-3">
                        {pagedUsers.map((u) => {
                            const roleCode = u.roles?.[0] ?? 'PUBLIC_USER';
                            const roleMeta = ROLE_SCHEMA[roleCode] ?? ROLE_SCHEMA.PUBLIC_USER;
                            const statusMeta = STATUS_SCHEMA[u.status] ?? STATUS_SCHEMA.Active;

                            return (
                                <div
                                    key={u.username}
                                    className="bg-[#1a1a1a] border border-white/10 p-4 space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {u.avatar ? (
                                                <img
                                                    src={u.avatar}
                                                    alt=""
                                                    className="w-11 h-11 object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 bg-[#173ef0]/20 flex items-center justify-center text-[#7c8cff] text-base font-bold shrink-0">
                                                    {(u.fullName || u.username).charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {u.fullName}
                                                </p>
                                                <p className="text-xs text-white/50 truncate">
                                                    @{u.username}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 shrink-0 ${statusMeta.color}`}
                                        >
                                            {u.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                                                Contact
                                            </p>
                                            <p className="text-xs text-white/80 truncate">
                                                {u.email}
                                            </p>
                                            {u.phone && (
                                                <p className="text-xs text-white/50 truncate">
                                                    {u.phone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                                                Role
                                            </p>
                                            <select
                                                value={roleCode}
                                                onChange={(e) => handleRoleChange(u.username, e.target.value)}
                                                className={`w-full text-xs font-medium px-2.5 py-1.5 bg-[#242424] border border-white/10 cursor-pointer ${roleMeta.color}`}
                                            >
                                                {Object.entries(ROLE_SCHEMA).map(([code, meta]) => (
                                                    <option key={code} value={code} className="bg-[#242424] text-white">
                                                        {meta.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                                        <button
                                            onClick={() => askToggleStatus(u)}
                                            className="text-xs font-medium px-3 py-2 text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => askDelete(u)}
                                            className="text-xs font-medium px-3 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">User</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Contact</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Role</th>
                                    <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Status</th>
                                    <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedUsers.map((u) => {
                                    const roleCode = u.roles?.[0] ?? 'PUBLIC_USER';
                                    const roleMeta = ROLE_SCHEMA[roleCode] ?? ROLE_SCHEMA.PUBLIC_USER;
                                    const statusMeta = STATUS_SCHEMA[u.status] ?? STATUS_SCHEMA.Active;

                                    return (
                                        <tr key={u.username} className="border-b border-b-[#3a3a3a]">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar ? (
                                                        <img
                                                            src={u.avatar}
                                                            alt=""
                                                            className="w-9 h-9 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 bg-[#173ef0]/20 flex items-center justify-center text-[#7c8cff] text-sm font-bold">
                                                            {(u.fullName || u.username).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{u.fullName}</p>
                                                        <p className="text-xs text-white/40">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-white/80">{u.email}</p>
                                                {u.phone && <p className="text-xs text-white/40">{u.phone}</p>}
                                            </td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={roleCode}
                                                    onChange={(e) => handleRoleChange(u.username, e.target.value)}
                                                    className={`text-xs font-medium px-2.5 py-1 rounded-full bg-transparent border border-white/10 cursor-pointer ${roleMeta.color}`}
                                                >
                                                    {Object.entries(ROLE_SCHEMA).map(([code, meta]) => (
                                                        <option key={code} value={code} className="bg-[#242424] text-white">
                                                            {meta.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-medium px-2.5 py-1 ${statusMeta.color}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => askToggleStatus(u)}
                                                    className="text-xs font-medium px-3 py-1.5 mr-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => askDelete(u)}
                                                    className="text-xs font-medium px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                                                >
                                                    Delete
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

            {confirmAction && (
                <ConfirmDialog
                    action={confirmAction}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runAction}
                />
            )}
        </div>
    );
};

const ConfirmDialog = ({ action, onCancel, onConfirm }) => {
    const { type, user } = action;

    const config = {
        deactivate: {
            icon: <FaExclamationTriangle className="w-5 h-5" />,
            tint: 'bg-[#1a1a1a] text-yellow-400',
            title: 'Deactivate account?',
            subtitle: 'The user will not be able to sign in until the account is reactivated.',
            confirmLabel: 'Yes, deactivate',
            confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
        },
        activate: {
            icon: <FaCheck className="w-5 h-5" />,
            tint: 'bg-[#1a1a1a] text-green-400',
            title: 'Activate account?',
            subtitle: 'The user will regain access to the system immediately.',
            confirmLabel: 'Yes, activate',
            confirmClass: 'bg-green-600 hover:bg-green-700',
        },
        delete: {
            icon: <FaTrash className="w-5 h-5" />,
            tint: 'bg-[#1a1a1a] text-red-400',
            title: 'Delete user?',
            subtitle: 'This action cannot be undone.',
            confirmLabel: 'Yes, delete',
            confirmClass: 'bg-red-600 hover:bg-red-700',
        },
    }[type];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={onCancel}
        >
            <div
                className="bg-[#242424] w-full max-w-md p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 ${config.tint}`}>
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">{config.title}</h3>
                        <p className="text-sm text-white/60 mt-1">{config.subtitle}</p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] p-3 sm:p-4 mb-5 sm:mb-6 space-y-2">
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
                </div>

                <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white transition-colors ${config.confirmClass}`}
                    >
                        {config.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;