import { FaChartPie } from 'react-icons/fa';

const ActivityByRole = () => {
    const roles = [
        { label: 'Administrators', value: 245, color: 'bg-blue-500' },
        { label: 'Asset Managers', value: 187, color: 'bg-green-500' },
        { label: 'Finance Officers', value: 156, color: 'bg-yellow-500' },
        { label: 'Field Officers', value: 134, color: 'bg-purple-500' },
        { label: 'Auditors', value: 98, color: 'bg-red-500' },
    ];

    const total = roles.reduce((sum, r) => sum + r.value, 0);

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaChartPie className="w-4 h-4 text-[#173ef0]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Activity by Role</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-[#173ef0] mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {roles.map((role) => (
                    <div key={role.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 ${role.color} rounded-full`}></span>
                            <span className="text-white">{role.label}</span>
                        </div>
                        <span className="font-medium text-white">{Math.round((role.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityByRole;