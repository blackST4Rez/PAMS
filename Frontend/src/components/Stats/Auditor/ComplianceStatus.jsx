import { FaClipboardList } from 'react-icons/fa';

const ComplianceStatus = () => {
    const items = [
        { label: 'Documentation', value: 92, color: 'bg-green-500' },
        { label: 'Verification', value: 88, color: 'bg-green-500' },
        { label: 'Valuation', value: 76, color: 'bg-yellow-500' },
        { label: 'Maintenance', value: 64, color: 'bg-red-500' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaClipboardList className="w-4 h-4 text-orange-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">Compliance Status</h3>
            </div>
            <div className="flex-1 space-y-3">
                {items.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-white">{item.label}</span>
                            <span className="font-medium text-white">{item.value}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComplianceStatus;