import { FaChartLine } from 'react-icons/fa';

const AssetGrowthTrend = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">Asset Growth Trend</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 min-h-30">
                <div className="text-center">
                    <FaChartLine className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-xs text-gray-400 mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">Growth this month</span>
                <span className="font-semibold text-green-600">+12.5%</span>
            </div>
        </div>
    );
};

export default AssetGrowthTrend;