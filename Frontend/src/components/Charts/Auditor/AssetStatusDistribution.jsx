import { FaChartPie } from 'react-icons/fa';

const AssetStatusDistribution = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Asset Status Distribution</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-orange-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-white">Active (73%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-white">Pending (12%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-white">Retired (10%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                    <span className="text-white">Cancelled (5%)</span>
                </div>
            </div>
        </div>
    );
};

export default AssetStatusDistribution;