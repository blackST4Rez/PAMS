import { FaEye } from 'react-icons/fa';

const LatestPublicAssets = () => {
    const assets = [
        { id: 'AST-001', name: 'Ward 3 Community Hall', category: 'Building', ward: 'Ward 3', value: '$1.2M', date: '2024-04-15' },
        { id: 'AST-002', name: 'Ward 1 Road Section', category: 'Road', ward: 'Ward 1', value: '$850K', date: '2024-04-14' },
        { id: 'AST-003', name: 'Ward 5 Public Park Land', category: 'Land', ward: 'Ward 5', value: '$2.4M', date: '2024-04-13' },
        { id: 'AST-004', name: 'Ward 2 Fire Truck', category: 'Vehicle', ward: 'Ward 2', value: '$420K', date: '2024-04-12' },
        { id: 'AST-005', name: 'Ward 7 Water Pump', category: 'Infrastructure', ward: 'Ward 7', value: '$180K', date: '2024-04-11' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Latest Public Assets</h3>
                <button className="text-xs font-medium text-[#173ef0] hover:text-white transition-colors duration-200">
                    View All →
                </button>
            </div>
            <div className="flex-1 space-y-2.5">
                {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-white/40">{asset.id}</span>
                                <span className="text-xs text-white/30">•</span>
                                <span className="text-xs text-white/50">{asset.category}</span>
                                <span className="text-xs text-white/30">•</span>
                                <span className="text-xs text-white/50">{asset.ward}</span>
                            </div>
                            <p className="text-sm font-medium text-white mt-0.5 truncate">{asset.name}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-3 shrink-0">
                            <span className="text-sm font-semibold text-white">{asset.value}</span>
                            <button className="p-1.5 bg-white/10 rounded-lg hover:bg-[#173ef0] transition-colors duration-200">
                                <FaEye className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestPublicAssets;