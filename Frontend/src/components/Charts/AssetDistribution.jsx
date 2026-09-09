import { FaChartPie } from 'react-icons/fa';

const AssetDistribution = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                    <FaChartPie className="w-4 h-4 text-[#173ef0]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Asset Distribution</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 min-h-30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <FaChartPie className="w-16 h-16 text-[#173ef0]/20 mx-auto" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Interactive chart coming soon</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-gray-700">Buildings (35%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-linear-to-br from-green-500 to-green-600 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-gray-700">Vehicles (25%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-gray-700">Equipment (20%)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="w-3 h-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-full shadow-sm"></span>
                    <span className="text-xs font-medium text-gray-700">Others (20%)</span>
                </div>
            </div>
        </div>
    );
};

export default AssetDistribution;