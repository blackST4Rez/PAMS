import { FaCheckCircle } from 'react-icons/fa';

const SystemStatus = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">System Status</h3>
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <span className="text-sm text-white/60">Last Backup</span>
                    <span className="text-sm font-medium text-white flex items-center gap-1.5">
                        <FaCheckCircle className="w-4 h-4 text-[#173ef0]" />
                        Today, 3:00 AM
                    </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <span className="text-sm text-white/60">Database</span>
                    <span className="text-sm font-medium text-white flex items-center gap-1.5">
                        <FaCheckCircle className="w-4 h-4 text-[#173ef0]" />
                        2.4 GB / Operational
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;