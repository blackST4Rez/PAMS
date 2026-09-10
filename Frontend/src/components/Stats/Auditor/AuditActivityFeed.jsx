import { FaSignal, FaEdit, FaTrash, FaUserCog, FaFileInvoice, FaLock, FaCheckCircle } from 'react-icons/fa';

const AuditActivityFeed = () => {
    const activities = [
        { icon: FaEdit, color: 'text-blue-400', title: 'Asset value updated', user: 'john.doe', time: '2 minutes ago' },
        { icon: FaUserCog, color: 'text-purple-400', title: 'User role changed', user: 'admin', time: '15 minutes ago' },
        { icon: FaTrash, color: 'text-red-400', title: 'Asset disposed', user: 'jane.smith', time: '1 hour ago' },
        { icon: FaFileInvoice, color: 'text-yellow-400', title: 'Invoice approved', user: 'mike.johnson', time: '2 hours ago' },
        { icon: FaCheckCircle, color: 'text-green-400', title: 'Maintenance completed', user: 'sarah.wilson', time: '3 hours ago' },
        { icon: FaLock, color: 'text-red-400', title: 'Login blocked', user: 'system', time: '4 hours ago' },
        { icon: FaEdit, color: 'text-blue-400', title: 'Asset details modified', user: 'robert.brown', time: '5 hours ago' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
                <FaSignal className="text-emerald-400 w-5 h-5" />
                Audit Activity Feed
            </h3>
            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto scrollbar-hide">
                {activities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 rounded-lg transition-colors duration-200">
                            <div className="p-2.5 rounded-lg shrink-0">
                                <Icon className={`${item.color} w-4 h-4`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white"><span className="font-semibold">{item.title}</span></p>
                                <p className="text-xs text-white/50 mt-0.5">by {item.user}</p>
                            </div>
                            <span className="text-xs text-white/40 shrink-0">{item.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AuditActivityFeed;