import { FaChartPie } from 'react-icons/fa';

const AssetCondition = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Asset Condition</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-orange-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Excellent', value: '42%' },
                    { label: 'Good', value: '35%' },
                    { label: 'Fair', value: '18%' },
                    { label: 'Poor', value: '5%' },
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

export default AssetCondition;