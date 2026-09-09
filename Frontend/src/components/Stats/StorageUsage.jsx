const StorageUsage = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Storage Usage</h3>
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">85.6 GB used</span>
                    <span className="text-white/60 font-medium">100 GB total</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-[#173ef0] h-2.5 rounded-full transition-all duration-500" style={{ width: '85.6%' }}></div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-white/40">
                    <span>Used: 85.6%</span>
                    <span>Free: 14.4%</span>
                </div>
            </div>
        </div>
    );
};

export default StorageUsage;