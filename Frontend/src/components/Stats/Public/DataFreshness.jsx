import { FaCheckCircle } from 'react-icons/fa';

const DataFreshness = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-sky-400 mb-4">Data Freshness</h3>
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-sm text-white/60">Last Update</span>
                    <span className="text-sm font-medium text-white flex items-center gap-1.5">
                        <FaCheckCircle className="w-4 h-4 text-emerald-300" />
                        Today, 3:00 AM
                    </span>
                </div>
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-sm text-white/60">Next Update</span>
                    <span className="text-sm font-medium text-white">Monday, 3:00 AM</span>
                </div>
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-sm text-white/60">Data Completeness</span>
                    <span className="text-sm font-medium text-green-400">98.5%</span>
                </div>
            </div>
        </div>
    );
};

export default DataFreshness;