import { FaCheckCircle } from 'react-icons/fa';

const PriorityApproval = () => {
    const approvals = [
        { title: 'Asset Transfer', time: '2 hours ago', status: 'Pending', statusColor: 'yellow' },
        { title: 'New User Request', time: '5 hours ago', status: 'Pending', statusColor: 'yellow' },
        { title: 'Asset Disposal', time: '1 day ago', status: 'Urgent', statusColor: 'red' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaCheckCircle className="w-5 h-5 text-[#173ef0]" />
                <h3 className="text-sm font-semibold text-gray-700">Priority Approvals</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {approvals.map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 shrink-0 ${
                            item.statusColor === 'red' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
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