import { FaCalendarAlt } from 'react-icons/fa';

const MaintenanceSchedule = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaCalendarAlt className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Maintenance Schedule</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaCalendarAlt className="w-16 h-16 text-orange-400 mx-auto" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-white">Upcoming</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">7 tasks</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-white">Overdue</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">3 tasks</span>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceSchedule;