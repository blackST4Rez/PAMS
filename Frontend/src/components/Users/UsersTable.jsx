import { useState } from 'react';
import { FaExclamationTriangle, FaCheck, FaTrash } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

/*
  Role schema — label + color for each role code.
*/
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

const UsersTable = () => {
    const { allUsers, updateUserRole, updateUserStatus, deleteUser } = useAuth();
    const users = allUsers();

    /*
      Confirmation dialog state.
      Shape: { type: 'deactivate' | 'activate' | 'delete', user } | null
    */
    const [confirmAction, setConfirmAction] = useState(null);

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
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                    Active Users
                    <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-emerald-400 text-black">
                        {users.length}
                    </span>
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                User
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Contact
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Role
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
                        {users.map((u) => {
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
                                                    className="w-9 h-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-[#173ef0]/20 flex items-center justify-center text-[#7c8cff] text-sm font-bold">
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
                                        {u.phone && (
                                            <p className="text-xs text-white/40">{u.phone}</p>
                                        )}
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
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMeta.color}`}>
                                            {u.status}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => askToggleStatus(u)}
                                            className="text-xs font-medium px-3 py-1.5 mr-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => askDelete(u)}
                                            className="text-xs font-medium px-3 py-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
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

            {users.length === 0 && (
                <p className="text-white/50 text-sm py-8 text-center">
                    No users yet.
                </p>
            )}

            {/* Confirmation dialog */}
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

/*
  Confirmation modal — mirrors the styled dialog used in the pending
  registrations table. Handles three action types: deactivate, activate, delete.
*/
const ConfirmDialog = ({ action, onCancel, onConfirm }) => {
    const { type, user } = action;

    /* Per-action config: icon, tint, title, subtitle, confirm label, confirm color */
    const config = {
        deactivate: {
            icon: <FaExclamationTriangle className="w-5 h-5" />,
            tint: 'bg-[#1a1a1a] text-yellow-400',
            title: 'Deactivate account?',
            subtitle:
                'The user will not be able to sign in until the account is reactivated.',
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
                className="bg-[#242424] rounded-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${config.tint}`}
                    >
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {config.title}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                            {config.subtitle}
                        </p>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Name</span>
                        <span className="text-white font-medium">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Username</span>
                        <span className="text-white font-medium">@{user.username}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Email</span>
                        <span className="text-white font-medium truncate ml-4">
                            {user.email}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${config.confirmClass}`}
                    >
                        {config.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;