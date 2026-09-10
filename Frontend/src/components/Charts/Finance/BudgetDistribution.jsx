import { FaChartPie } from 'react-icons/fa';

const BudgetDistribution = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Budget Distribution</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-orange-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Infrastructure', value: '$8.4M (34%)' },
                    { label: 'Education', value: '$6.2M (25%)' },
                    { label: 'Healthcare', value: '$4.9M (20%)' },
                    { label: 'Others', value: '$5.3M (21%)' },
                ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                        <span className="text-white">{item.label}</span>
                        <span className="font-medium text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetDistribution;