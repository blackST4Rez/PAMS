import { FaChartBar } from 'react-icons/fa';

const WardBreakdown = () => {
    const wards = [
        { ward: 'Ward 1', count: 186, percent: 15 },
        { ward: 'Ward 2', count: 142, percent: 11 },
        { ward: 'Ward 3', count: 168, percent: 13 },
        { ward: 'Ward 4', count: 124, percent: 10 },
        { ward: 'Ward 5', count: 156, percent: 13 },
        { ward: 'Ward 6', count: 134, percent: 11 },
        { ward: 'Ward 7', count: 118, percent: 9 },
        { ward: 'Ward 8', count: 112, percent: 9 },
        { ward: 'Ward 9', count: 107, percent: 9 },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartBar className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Assets by Ward</h3>
            </div>
            <div className="flex-1 space-y-2">
                {wards.map((ward) => (
                    <div key={ward.ward}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-white">{ward.ward}</span>
                            <span className="font-medium text-white">{ward.count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="bg-[#173ef0] h-1.5 rounded-full transition-all duration-500" style={{ width: `${ward.percent * 5}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-green-400">Highest: Ward 1 (186)</span>
                <span className="text-red-400">Lowest: Ward 9 (107)</span>
            </div>
        </div>
    );
};

export default WardBreakdown;