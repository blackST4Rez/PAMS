import { FaChartBar } from 'react-icons/fa';

const RevenueVsExpense = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartBar className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-semibold text-white">Revenue vs Expense</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartBar className="w-16 h-16 text-red-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white">Net Balance</span>
                <span className="font-semibold text-green-400">+$6.6M</span>
            </div>
        </div>
    );
};

export default RevenueVsExpense;