import { FaChartPie } from 'react-icons/fa';

const AssetDistribution = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaChartPie className="w-4 h-4 text-[#173ef0]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Asset Distribution</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaChartPie className="w-16 h-16 text-[#173ef0] mx-auto" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-white">Buildings (35%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-white">Vehicles (25%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-white">Equipment (20%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-white">Others (20%)</span>
                </div>
            </div>
        </div>
    );
};

export default AssetDistribution;