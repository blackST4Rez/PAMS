import { FaChartPie } from 'react-icons/fa';

const UserByRole = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartPie className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">Users by Role</h3>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 min-h-30">
                <div className="text-center">
                    <FaChartPie className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-xs text-gray-400 mt-2">Chart Placeholder</p>
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
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserByRole;