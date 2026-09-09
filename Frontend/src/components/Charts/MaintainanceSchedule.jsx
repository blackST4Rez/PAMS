import { FaCalendarAlt } from 'react-icons/fa';

const MaintenanceSchedule = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FaCalendarAlt className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Maintenance Schedule</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaCalendarAlt className="w-16 h-16 text-orange-600/20 mx-auto" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-700">Upcoming</span>
                    </div>
                    <span className="text-sm font-bold text-green-700">7 tasks</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-linear-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-700">Overdue</span>
                    </div>
                    <span className="text-sm font-bold text-red-700">3 tasks</span>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceSchedule;