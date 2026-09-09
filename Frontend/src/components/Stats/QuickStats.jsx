const QuickStats = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Stats</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold text-green-600">1,142</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inactive Users</span>
                    <span className="font-semibold text-gray-600">112</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Locked Accounts</span>
                    <span className="font-semibold text-red-600">30</span>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;