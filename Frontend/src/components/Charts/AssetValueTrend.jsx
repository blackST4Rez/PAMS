import { FaChartLine } from 'react-icons/fa';

const AssetValueTrend = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-50 rounded-lg">
                    <FaChartLine className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Asset Value Trend</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaChartLine className="w-16 h-16 text-green-600/20 mx-auto" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <span className="text-sm font-medium text-gray-600">Total Value</span>
                <div className="text-right">
                    <span className="text-sm font-bold text-green-700">$12.4M</span>
                    <span className="text-xs text-green-600 ml-2">↑ 8.5%</span>
                </div>
            </div>
        </div>
    );
};

export default AssetValueTrend;