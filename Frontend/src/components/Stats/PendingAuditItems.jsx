import { FaBell } from 'react-icons/fa';

const PendingAuditItems = () => {
    return (
        <div className="bg-[#242424] rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Pending Audit Items</p>
                    <p className="text-3xl font-bold text-white mt-1.5">23</p>
                </div>
                <div className="p-3 rounded-xl shrink-0">
                    <FaBell className="w-6 h-6 text-blue-400" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#173ef0]">
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    12 Critical
                </span>
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    11 Normal
                </span>
            </div>
        </div>
    );
};

export default PendingAuditItems;