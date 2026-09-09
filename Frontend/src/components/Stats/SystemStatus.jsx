import { FaCheckCircle } from 'react-icons/fa';

const SystemStatus = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">System Status</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Backup</span>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <FaCheckCircle className="w-4 h-4" />
                        Today, 3:00 AM
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <FaCheckCircle className="w-4 h-4" />
                        2.4 GB / Operational
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;