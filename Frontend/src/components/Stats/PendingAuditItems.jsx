import { FaBell } from 'react-icons/fa';

const PendingAuditItems = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Audit Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1.5">23</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl shrink-0">
                    <FaBell className="w-6 h-6 text-red-600" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">12 Critical</span>
                <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full">11 Normal</span>
            </div>
        </div>
    );
};

export default PendingAuditItems;