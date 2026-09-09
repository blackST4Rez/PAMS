import { FaTags } from 'react-icons/fa';

const AssetsByCategory = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1.5">12</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl shrink-0">
                    <FaTags className="w-6 h-6 text-purple-600" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    8 Active
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                    4 Inactive
                </span>
            </div>
        </div>
    );
};

export default AssetsByCategory;