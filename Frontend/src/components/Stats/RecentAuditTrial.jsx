import { FaClock } from 'react-icons/fa';

const RecentAuditTrail = () => {
    const audits = [
        { title: 'User login', detail: 'admin@system.com', time: '2 min ago' },
        { title: 'Asset updated', detail: 'Asset #A-2341', time: '15 min ago' },
        { title: 'Role changed', detail: 'user@example.com', time: '1 hour ago' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaClock className="w-4 h-4 text-sky-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">Recent Audit Trail</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {audits.map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{item.title}</p>
                            <p className="text-xs text-white/50 mt-0.5 truncate">{item.detail}</p>
                        </div>
                        <span className="text-xs font-medium text-white ml-3 shrink-0">{item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentAuditTrail;