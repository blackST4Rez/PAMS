const QuickStatsCard = () => (
    <div className="p-6 h-full flex flex-col">
        <h3 className="text-xl font-semibold text-sky-400 mb-4">Quick Stats</h3>
        <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center gap-6 py-2.5">
                <span className="text-sm text-white/60">Total Value</span>
                <span className="font-semibold text-white">रू 24.8 करोड</span>
            </div>
            <div className="flex justify-between items-center gap-6 py-2.5">
                <span className="text-sm text-white/60">Most Common</span>
                <span className="font-semibold text-white">Roads (523)</span>
            </div>
            <div className="flex justify-between items-center gap-6 py-2.5">
                <span className="text-sm text-white/60">Newest Asset</span>
                <span className="font-semibold text-white">Ward 3 Hall</span>
            </div>
        </div>
    </div>
);

export default QuickStatsCard;