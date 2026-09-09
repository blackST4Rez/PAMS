import { FaClock } from 'react-icons/fa';

const RecentAssets = () => {
    return (
        <div className="bg-[#242424] rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-white uppercase tracking-wider">Recent Assets</p>
                    <p className="text-3xl font-bold text-white mt-1.5">24</p>
                </div>
                <div className="p-3 rounded-xl shrink-0">
                    <FaClock className="w-6 h-6 text-sky-300" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#173ef0]">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                    This week
                </span>
                <span className="text-xs text-white/60">+18 added</span>
            </div>
        </div>
    );
};

export default RecentAssets;