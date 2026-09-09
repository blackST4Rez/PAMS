import { FaHeartbeat } from 'react-icons/fa';

const SystemHealth = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">System Health</p>
                    <p className="text-3xl font-bold text-green-600 mt-1.5">99.8%</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl shrink-0">
                    <FaHeartbeat className="w-6 h-6 text-green-600" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Operational
                </span>
            </div>
        </div>
    );
};

export default SystemHealth;