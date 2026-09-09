import { FaClock } from 'react-icons/fa';

const RecentAssets = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Assets</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1.5">24</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-xl shrink-0">
                    <FaClock className="w-6 h-6 text-teal-600" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                    This week
                </span>
                <span className="text-xs text-gray-500">+18 added</span>
            </div>
        </div>
    );
};

export default RecentAssets;