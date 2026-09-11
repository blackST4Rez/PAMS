import { FaCreditCard } from 'react-icons/fa';

const TotalExpenses = () => (
    <div className="bg-[#242424] rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-xs font-medium text-white uppercase tracking-wider">Total Expenses</p>
                <p className="text-3xl font-bold text-white mt-1.5">रू 18.2 करोड</p>
            </div>
            <div className="p-3 rounded-xl shrink-0">
                <FaCreditCard className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[#173ef0]">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                +रू 1.8 करोड this month
            </span>
        </div>
    </div>
);

export default TotalExpenses;