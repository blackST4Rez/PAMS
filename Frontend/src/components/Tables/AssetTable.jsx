import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const AssetTable = () => {
    const assets = [
        { id: 'A-001', name: 'Town Hall Building', category: 'Building', status: 'Active', value: '$2.4M', date: '2023-01-15' },
        { id: 'A-002', name: 'Fire Truck #1', category: 'Vehicle', status: 'Maintenance', value: '$850K', date: '2023-03-20' },
        { id: 'A-003', name: 'Water Treatment Plant', category: 'Equipment', status: 'Active', value: '$1.2M', date: '2023-05-10' },
        { id: 'A-004', name: 'Community Center', category: 'Building', status: 'Active', value: '$1.8M', date: '2023-07-01' },
        { id: 'A-005', name: 'School Bus #3', category: 'Vehicle', status: 'Disposed', value: '$120K', date: '2023-09-15' },
    ];

    const statusColors = {
        'Active': 'bg-green-100 text-green-700',
        'Maintenance': 'bg-yellow-100 text-yellow-700',
        'Disposed': 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Asset Register</h3>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <FaSearch className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <FaFilter className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173ef0] text-white text-sm font-medium rounded-lg hover:bg-[#0020ad] transition-colors duration-200">
                        <FaDownload className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">ID</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">Asset Name</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">Category</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">Status</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">Value</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-3">Acquired</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-2.5 px-3 text-sm font-medium text-gray-900">{asset.id}</td>
                                <td className="py-2.5 px-3 text-sm text-gray-900">{asset.name}</td>
                                <td className="py-2.5 px-3 text-sm text-gray-600">{asset.category}</td>
                                <td className="py-2.5 px-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[asset.status]}`}>
                                        {asset.status}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3 text-sm font-medium text-gray-900 text-right">{asset.value}</td>
                                <td className="py-2.5 px-3 text-sm text-gray-500 text-right">{asset.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Showing 5 of 8,492 assets</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">Previous</button>
                    <button className="px-3 py-1 text-sm bg-[#173ef0] text-white rounded-lg">1</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">2</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">3</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AssetTable;