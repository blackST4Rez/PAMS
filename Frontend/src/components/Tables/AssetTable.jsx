import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { MOCK_ASSETS } from '../mock/dashboardData';

const statusColors = {
    'Active': 'bg-green-500/20 text-green-400',
    'Maintenance': 'bg-yellow-500/20 text-yellow-400',
    'Disposed': 'bg-red-500/20 text-red-400',
    'Retired': 'bg-gray-500/20 text-gray-400',
};

const AssetTable = () => {
    const assets = MOCK_ASSETS.slice(0, 8);

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Asset Register</h3>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg">
                        <FaSearch className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg">
                        <FaFilter className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173ef0] text-white text-sm font-medium rounded-lg hover:bg-[#0020ad]">
                        <FaDownload className="w-3 h-3" /> Export
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            {['ID', 'Asset Name', 'Category', 'Status', 'Ward', 'Value', 'Acquired'].map((h, i) => (
                                <th key={h} className={`text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3 ${i >= 5 ? 'text-right' : 'text-left'
                                    }`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((a) => (
                            <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-2.5 px-3 text-sm font-medium text-white">{a.id}</td>
                                <td className="py-2.5 px-3 text-sm text-white">{a.name}</td>
                                <td className="py-2.5 px-3 text-sm text-white/60">{a.category}</td>
                                <td className="py-2.5 px-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[a.status]}`}>
                                        {a.status}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3 text-sm text-white/60">{a.ward}</td>
                                <td className="py-2.5 px-3 text-sm font-medium text-white text-right">{a.value}</td>
                                <td className="py-2.5 px-3 text-sm text-white/60 text-right">{a.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-white/60">Showing {assets.length} of 8,492 assets</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg">Previous</button>
                    <button className="px-3 py-1 text-sm bg-[#173ef0] text-white rounded-lg">1</button>
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg">2</button>
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AssetTable;