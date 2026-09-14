import { useAuth } from '../Context/AuthContext';

/*
  Role schema — label + color for each role code.
  Edit here to add/remove/rename roles.
*/
const ROLE_SCHEMA = {
    SYS_ADMIN: { label: 'System Admin', color: 'bg-purple-500/20 text-purple-300' },
    ASSET_MANAGER: { label: 'Asset Manager', color: 'bg-blue-500/20 text-blue-300' },
    FINANCE_OFFICER: { label: 'Finance Officer', color: 'bg-green-500/20 text-green-300' },
    FIELD_OFFICER: { label: 'Field Officer', color: 'bg-yellow-500/20 text-yellow-300' },
    AUDITOR: { label: 'Auditor', color: 'bg-orange-500/20 text-orange-300' },
    PUBLIC_USER: { label: 'Public User', color: 'bg-gray-500/20 text-gray-300' },
};

const STATUS_SCHEMA = {
    Active: { color: 'bg-green-500/20 text-green-300' },
    Inactive: { color: 'bg-red-500/20 text-red-300' },
};

const UsersTable = () => {
    const { allUsers, updateUserRole, updateUserStatus, deleteUser } = useAuth();
    const users = allUsers();

    const handleRoleChange = (username, newRole) => {
        updateUserRole(username, newRole);
    };

    const handleToggleStatus = (username, currentStatus) => {
        updateUserStatus(username, currentStatus === 'Active' ? 'Inactive' : 'Active');
    };

    const handleDelete = (username) => {
        if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
        try {
            deleteUser(username);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="bg-[#242424] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                    Active Users
                    <span className="ml-2 text-sm font-normal text-white/40">
                        ({users.length})
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
                                            onClick={() => handleToggleStatus(u.username, u.status)}
                                            className="text-xs font-medium px-3 py-1.5 mr-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        {u.source === 'extra' && (
                                            <button
                                                onClick={() => handleDelete(u.username)}
                                                className="text-xs font-medium px-3 py-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
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
        </div>
    );
};

export default UsersTable;