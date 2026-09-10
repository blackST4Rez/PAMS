import { FaClock, FaClipboardCheck, FaUserCheck, FaFileAlt, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';

const RecentActivity = () => {
    const activities = [
        { icon: FaClipboardCheck, color: 'text-green-400', title: 'Inspection completed', detail: 'Town Hall Building', time: '10 min ago' },
        { icon: FaUserCheck, color: 'text-blue-400', title: 'Asset verified', detail: 'Fire Truck #1', time: '45 min ago' },
        { icon: FaCamera, color: 'text-purple-400', title: 'Photos uploaded', detail: 'Water Treatment Plant', time: '2 hours ago' },
        { icon: FaFileAlt, color: 'text-yellow-400', title: 'Field report submitted', detail: 'Weekly Summary #12', time: '3 hours ago' },
        { icon: FaMapMarkerAlt, color: 'text-red-400', title: 'Location updated', detail: 'Community Center Site', time: '5 hours ago' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FaClock className="text-[#173ef0]" />
                Recent Activity
            </h3>
            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto max-h-75">
                {activities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                            <div className="p-2 rounded-lg shrink-0">
                                <Icon className={`${item.color} w-4 h-4`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">{item.title}</p>
                                <p className="text-xs text-white/50 mt-0.5">{item.detail}</p>
                            </div>
                            <span className="text-xs text-white/40 shrink-0">{item.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivity;