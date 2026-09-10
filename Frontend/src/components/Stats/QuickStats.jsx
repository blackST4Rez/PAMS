const QuickStats = () => {
    return (
        <div className="p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Stats</h3>
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <span className="text-sm text-white/60">Active Users</span>
                    <span className="font-semibold text-green-400">1,142</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <span className="text-sm text-white/60">Inactive Users</span>
                    <span className="font-semibold text-yellow-300">112</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <span className="text-sm text-white/60">Locked Accounts</span>
                    <span className="font-semibold text-red-400">30</span>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;