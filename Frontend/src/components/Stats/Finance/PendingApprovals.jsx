import { FaFileInvoice } from 'react-icons/fa';

const PendingApprovals = () => {
    return (
        <div className="bg-[#242424] rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-white uppercase tracking-wider">Pending Approvals</p>
                    <p className="text-3xl font-bold text-white mt-1.5">47</p>
                </div>
                <div className="p-3 rounded-xl shrink-0">
                    <FaFileInvoice className="w-6 h-6 text-orange-200" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#173ef0]">
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">32 Invoices</span>
                <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">15 Requisitions</span>
            </div>
        </div>
    );
};

export default PendingApprovals;