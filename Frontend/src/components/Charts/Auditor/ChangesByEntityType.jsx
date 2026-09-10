import { FaChartBar } from 'react-icons/fa';

const ChangesByEntityType = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartBar className="w-5 h-5 text-green-400" />
                <h3 className="text-sm font-semibold text-white">Changes by Entity Type</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartBar className="w-16 h-16 text-green-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Assets', value: '124' },
                    { label: 'Users', value: '52' },
                    { label: 'Maintenance', value: '48' },
                    { label: 'Approvals', value: '38' },
                    { label: 'Disposals', value: '22' },
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

export default ChangesByEntityType;