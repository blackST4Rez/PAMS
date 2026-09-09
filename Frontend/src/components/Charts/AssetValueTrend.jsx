import { FaChartLine } from 'react-icons/fa';

const AssetValueTrend = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaChartLine className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Asset Value Trend</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaChartLine className="w-16 h-16 text-green-400 mx-auto" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3">
                <span className="text-sm font-medium text-white">Total Value</span>
                <div className="text-right">
                    <span className="text-sm font-bold text-white">$12.4M</span>
                    <span className="text-xs text-green-400 ml-2">↑ 8.5%</span>
                </div>
            </div>
        </div>
    );
};

export default AssetValueTrend;