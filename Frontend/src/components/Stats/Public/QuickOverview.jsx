const QuickOverview = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-sky-400 mb-4">Quick Overview</h3>
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-l text-white/60">Total Assets</span>
                    <span className="font-semibold text-white">1,247</span>
                </div>
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-l text-white/60">Categories</span>
                    <span className="font-semibold text-white">6</span>
                </div>
                <div className="flex justify-between items-center gap-6 py-2.5">
                    <span className="text-l text-white/60">Wards</span>
                    <span className="font-semibold text-white">9</span>
                </div>
            </div>
        </div>
    );
};

export default QuickOverview;