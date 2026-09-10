import { FaChartPie } from 'react-icons/fa';

const UserByRole = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Users by Role</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-orange-400 mx-auto" />
                    <p className="text-xs text-white mt-2">Chart Placeholder</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Administrators', value: '12 (8%)' },
                    { label: 'Asset Managers', value: '45 (32%)' },
                    { label: 'Auditors', value: '23 (16%)' },
                    { label: 'Viewers', value: '62 (44%)' },
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

export default UserByRole;