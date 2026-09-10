const ComplianceScore = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Compliance Score</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#173ef0" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 56 * 0.82} ${2 * Math.PI * 56 * 0.18}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">82%</p>
                            <p className="text-xs text-white/50">Overall</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-1.5 w-full">
                    <div className="flex justify-between text-xs">
                        <span className="text-white/60">Documentation</span>
                        <span className="text-white">92%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-white/60">Verification</span>
                        <span className="text-white">88%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-white/60">Valuation</span>
                        <span className="text-white">76%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-white/60">Maintenance</span>
                        <span className="text-white">64%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceScore;