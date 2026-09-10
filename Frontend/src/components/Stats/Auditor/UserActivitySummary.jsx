import { FaUserCheck } from 'react-icons/fa';

const UserActivitySummary = () => {
    const users = [
        { name: 'John Doe', role: 'Admin', actions: 245, trend: '+12%' },
        { name: 'Jane Smith', role: 'Asset Manager', actions: 187, trend: '+8%' },
        { name: 'Mike Johnson', role: 'Finance Officer', actions: 156, trend: '-3%' },
        { name: 'Sarah Wilson', role: 'Field Officer', actions: 134, trend: '+15%' },
        { name: 'Robert Brown', role: 'Auditor', actions: 98, trend: '+5%' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaUserCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">Top 5 Active Users</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {users.map((user, index) => (
                    <div key={user.name} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#173ef0]/20 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-white/50">{user.role}</p>
                            </div>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                            <p className="text-sm font-semibold text-white">{user.actions}</p>
                            <p className={`text-xs ${
                                user.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            }`}>{user.trend}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserActivitySummary;