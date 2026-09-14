import { useState } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
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

const PendingRegistrationsTable = () => {
    const { pendingRegistrations, approveRegistration, rejectRegistration } = useAuth();

    /* Local map: username → selected role (default PUBLIC_USER) */
    const [roleSelections, setRoleSelections] = useState({});

    const setRole = (username, role) =>
        setRoleSelections((prev) => ({ ...prev, [username]: role }));

    const handleApprove = (username) => {
        const role = roleSelections[username] ?? 'PUBLIC_USER';
        try {
            approveRegistration(username, role);
            toast.success(`Approved @${username} as ${role.replace(/_/g, ' ')}`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleReject = (username) => {
        if (!confirm(`Reject the registration from @${username}?`)) return;
        rejectRegistration(username);
        toast.success(`Registration for @${username} rejected`);
    };

    if (pendingRegistrations.length === 0) {
        return (
            <div className="bg-[#242424] rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaClock className="text-yellow-400" />
                    Pending Registrations
                </h2>
                <p className="text-white/50 text-sm py-4 text-center">
                    No pending registrations.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#242424] rounded-xl p-6 mb-6 border border-yellow-500/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                Pending Registrations
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                    {pendingRegistrations.length} awaiting review
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
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
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRegistrations.map((p) => (
                            <tr key={p.id} className="border-b border-b-[#3a3a3a]">
                                <td className="py-3 px-4">
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

                                <td className="py-3 px-4">
                                    <p className="text-sm text-white/80">{p.email}</p>
                                    {p.phone && <p className="text-xs text-white/40">{p.phone}</p>}
                                </td>

                                <td className="py-3 px-4">
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/70">
                                        {p.ward || '—'}
                                    </span>
                                </td>

                                <td className="py-3 px-4">
                                    <select
                                        value={roleSelections[p.username] ?? 'PUBLIC_USER'}
                                        onChange={(e) => setRole(p.username, e.target.value)}
                                        className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                    >
                                        {ROLE_OPTIONS.map((opt) => (
                                            <option key={opt.code} value={opt.code} className="bg-[#242424]">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="py-3 px-4 text-right">
                                    <button
                                        onClick={() => handleApprove(p.username)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 mr-2 rounded-md text-green-400 hover:bg-green-500/10 transition-colors"
                                    >
                                        <FaCheck className="w-3 h-3" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(p.username)}
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
        </div>
    );
};

export default PendingRegistrationsTable;