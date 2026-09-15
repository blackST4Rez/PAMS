import { useState } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

/*
  Role options for the approve dropdown.
  Same set as everywhere else — single source of truth would be nicer,
  but keeping it local avoids a config-file refactor.
*/
const ROLE_OPTIONS = [
    { code: 'SYS_ADMIN', label: 'System Admin' },
    { code: 'ASSET_MANAGER', label: 'Asset Manager' },
    { code: 'FINANCE_OFFICER', label: 'Finance Officer' },
    { code: 'FIELD_OFFICER', label: 'Field Officer' },
    { code: 'AUDITOR', label: 'Auditor' },
    { code: 'PUBLIC_USER', label: 'Public User' },
];

/* Look up a role's human-readable label from its code */
const roleLabel = (code) =>
    ROLE_OPTIONS.find((r) => r.code === code)?.label ?? code;

const PendingRegistrationsTable = () => {
    const { pendingRegistrations, approveRegistration, rejectRegistration } = useAuth();

    /* Local map: username → selected role (default PUBLIC_USER) */
    const [roleSelections, setRoleSelections] = useState({});

    /* Confirmation dialog state: { type: 'approve' | 'reject', user } | null */
    const [confirmAction, setConfirmAction] = useState(null);

    const setRole = (username, role) =>
        setRoleSelections((prev) => ({ ...prev, [username]: role }));

    /* Opens the confirmation dialog — the actual work happens in runAction */
    const askApprove = (user) => setConfirmAction({ type: 'approve', user });
    const askReject = (user) => setConfirmAction({ type: 'reject', user });

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
            <div className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    Pending Registrations
                </h2>
                <p className="text-white/50 text-sm py-4 text-center">
                    No pending registrations.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                Pending Registrations
                <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                    {pendingRegistrations.length}
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pr-4">
                                Applicant
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Contact
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Ward
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Assign Role
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 pl-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRegistrations.map((p) => (
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

            {/* Confirmation dialog */}
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

/*
  Small confirmation modal — shows a summary of the action about to be taken
  so the admin can't approve/reject by accident.
*/
const ConfirmDialog = ({ action, selectedRole, onCancel, onConfirm }) => {
    const { type, user } = action;
    const isApprove = type === 'approve';

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
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
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
                        <h3 className="text-lg font-semibold text-white">
                            {isApprove ? 'Approve registration?' : 'Reject registration?'}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                            {isApprove
                                ? 'This will grant the user access to the system.'
                                : 'This action cannot be undone.'}
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
                    {isApprove && (
                        <div className="flex justify-between text-sm">
                            <span className="text-white/50">Assign role</span>
                            <span className="text-white font-medium">
                                {roleLabel(selectedRole)}
                            </span>
                        </div>
                    )}
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