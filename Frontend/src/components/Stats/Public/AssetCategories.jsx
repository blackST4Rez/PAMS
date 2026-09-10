import { FaTags } from 'react-icons/fa';

const AssetCategories = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-white uppercase tracking-wider">Asset Categories</p>
                    <p className="text-3xl font-bold text-white mt-1.5">6</p>
                </div>
                <div className="p-3 rounded-xl shrink-0">
                    <FaTags className="w-5 h-5 text-white" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#173ef0]">
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">Land</span>
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">Building</span>
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">Vehicle</span>
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">+3 more</span>
            </div>
        </div>
    );
};

export default AssetCategories;