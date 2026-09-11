import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const TransactionsTable = () => {
    const transactions = [
        { id: 'TXN-001', description: 'Road Construction Payment', category: 'Infrastructure', type: 'Expense', amount: '-$245,000', date: '2024-04-15' },
        { id: 'TXN-002', description: 'Property Tax Collection', category: 'Revenue', type: 'Income', amount: '+$180,000', date: '2024-04-14' },
        { id: 'TXN-003', description: 'Equipment Purchase', category: 'Equipment', type: 'Expense', amount: '-$89,500', date: '2024-04-13' },
        { id: 'TXN-004', description: 'Grant from Province', category: 'Grant', type: 'Income', amount: '+$500,000', date: '2024-04-12' },
        { id: 'TXN-005', description: 'Office Supplies', category: 'Administrative', type: 'Expense', amount: '-$12,400', date: '2024-04-11' },
    ];

    const typeColors = {
        'Income': 'bg-green-500/20 text-green-400',
        'Expense': 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200">
                        <FaSearch className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200">
                        <FaFilter className="w-4 h-4 text-white/60" />
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
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">ID</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Description</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Category</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Type</th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Amount</th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                                <td className="py-2.5 px-3 text-sm font-medium text-white">{txn.id}</td>
                                <td className="py-2.5 px-3 text-sm text-white">{txn.description}</td>
                                <td className="py-2.5 px-3 text-sm text-white/60">{txn.category}</td>
                                <td className="py-2.5 px-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[txn.type]}`}>
                                        {txn.type}
                                    </span>
                                </td>
                                <td className={`py-2.5 px-3 text-sm font-medium text-right ${txn.type === 'Income' ? 'text-green-400' : 'text-red-400'
                                    }`}>{txn.amount}</td>
                                <td className="py-2.5 px-3 text-sm text-white/60 text-right">{txn.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-white/60">Showing 5 of 1,247 transactions</span>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg transition-colors duration-200">Previous</button>
                    <button className="px-3 py-1 text-sm bg-[#173ef0] text-white rounded-lg">1</button>
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg transition-colors duration-200">2</button>
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg transition-colors duration-200">3</button>
                    <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg transition-colors duration-200">Next</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionsTable;