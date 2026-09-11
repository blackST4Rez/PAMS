import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { MOCK_FIELD_TASKS } from '../../mock/dashboardData';

const priorityColors = {
    High: 'bg-red-500/20 text-red-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    Low: 'bg-green-500/20 text-green-400',
};
const statusColors = {
    Completed: 'bg-green-500/20 text-green-400',
    'In Progress': 'bg-blue-500/20 text-blue-400',
    Pending: 'bg-yellow-500/20 text-yellow-400',
};

const FieldTasksTable = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Field Tasks</h3>
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg"><FaSearch className="w-4 h-4 text-white/60" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg"><FaFilter className="w-4 h-4 text-white/60" /></button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173ef0] text-white text-sm font-medium rounded-lg hover:bg-[#0020ad]">
                    <FaDownload className="w-3 h-3" /> Export
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        {['ID', 'Task', 'Location', 'Priority', 'Status', 'Due Date'].map((h, i) => (
                            <th key={h} className={`text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3 ${i >= 5 ? 'text-right' : 'text-left'
                                }`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_FIELD_TASKS.map((t) => (
                        <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2.5 px-3 text-sm font-medium text-white">{t.id}</td>
                            <td className="py-2.5 px-3 text-sm text-white">{t.task}</td>
                            <td className="py-2.5 px-3 text-sm text-white/60">{t.location}</td>
                            <td className="py-2.5 px-3">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[t.priority]}`}>{t.priority}</span>
                            </td>
                            <td className="py-2.5 px-3">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[t.status]}`}>{t.status}</span>
                            </td>
                            <td className="py-2.5 px-3 text-sm text-white/60 text-right">{t.due}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-white/60">Showing {MOCK_FIELD_TASKS.length} of 342 tasks</span>
            <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg">Previous</button>
                <button className="px-3 py-1 text-sm bg-[#173ef0] text-white rounded-lg">1</button>
                <button className="px-3 py-1 text-sm text-white/60 hover:bg-white/5 rounded-lg">Next</button>
            </div>
        </div>
    </div>
);

export default FieldTasksTable;