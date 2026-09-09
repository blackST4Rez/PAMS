import { FaCheckCircle } from 'react-icons/fa';

const PriorityApproval = () => {
    const approvals = [
        { title: 'Asset Transfer', time: '2 hours ago', status: 'Pending', statusColor: 'yellow' },
        { title: 'New User Request', time: '5 hours ago', status: 'Pending', statusColor: 'yellow' },
        { title: 'Asset Disposal', time: '1 day ago', status: 'Urgent', statusColor: 'red' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaCheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Priority Approvals</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {approvals.map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">{item.time}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 shrink-0 ${
                            item.statusColor === 'red' 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriorityApproval;