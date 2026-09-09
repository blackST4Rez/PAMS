import { FaClock, FaPlus, FaEdit, FaTrash, FaWrench } from 'react-icons/fa';

const RecentActivity = () => {
    const activities = [
        { icon: FaPlus, color: 'text-green-600', bg: 'bg-green-50', title: 'Added new asset', detail: 'Fire Truck #2', time: '10 min ago' },
        { icon: FaEdit, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Updated asset', detail: 'Town Hall Building', time: '1 hour ago' },
        { icon: FaWrench, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Maintenance logged', detail: 'Water Treatment Plant', time: '3 hours ago' },
        { icon: FaTrash, color: 'text-red-600', bg: 'bg-red-50', title: 'Asset disposed', detail: 'School Bus #3', time: '5 hours ago' },
        { icon: FaPlus, color: 'text-green-600', bg: 'bg-green-50', title: 'Added new asset', detail: 'Community Center', time: '1 day ago' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Recent Activity
            </h3>
            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto max-h-75">
                {activities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-start gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                            <div className={`${item.bg} p-2 rounded-lg shrink-0`}>
                                <Icon className={`${item.color} w-4 h-4`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivity;