import { FaMap, FaBuilding, FaCar, FaRoad, FaIndustry, FaDesktop } from 'react-icons/fa';

const CategoryBrowser = () => {
    const categories = [
        { icon: FaMap, label: 'Land', count: 245, color: 'text-green-400', bg: 'bg-green-500/20' },
        { icon: FaBuilding, label: 'Building', count: 187, color: 'text-blue-400', bg: 'bg-blue-500/20' },
        { icon: FaCar, label: 'Vehicle', count: 92, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        { icon: FaRoad, label: 'Road', count: 523, color: 'text-orange-400', bg: 'bg-orange-500/20' },
        { icon: FaIndustry, label: 'Infrastructure', count: 112, color: 'text-purple-400', bg: 'bg-purple-500/20' },
        { icon: FaDesktop, label: 'Office Equipment', count: 88, color: 'text-red-400', bg: 'bg-red-500/20' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Category Browser</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <div key={cat.label} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${cat.bg}`}>
                                    <Icon className={`w-4 h-4 ${cat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{cat.label}</p>
                                    <p className="text-xs text-white/50">{cat.count} assets</p>
                                </div>
                            </div>
                            <button className="text-xs font-medium text-[#173ef0] hover:text-white transition-colors duration-200">
                                View All
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryBrowser;