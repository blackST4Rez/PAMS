import { FaUserClock } from 'react-icons/fa';

const InactiveUsers = () => {
    const users = [
        { name: 'David Miller', role: 'Field Officer', lastActive: '45 days ago' },
        { name: 'Emily Davis', role: 'Asset Manager', lastActive: '38 days ago' },
        { name: 'Chris Wilson', role: 'Auditor', lastActive: '35 days ago' },
        { name: 'Lisa Anderson', role: 'Finance Officer', lastActive: '32 days ago' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaUserClock className="w-4 h-4 text-[#173ef0]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Inactive Users (30+ days)</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {users.map((user) => (
                    <div key={user.name} className="flex items-center justify-between p-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/50 mt-0.5">{user.role}</p>
                        </div>
                        <span className="text-xs font-medium text-red-400 ml-3 shrink-0">{user.lastActive}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InactiveUsers;