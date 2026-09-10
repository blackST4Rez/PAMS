import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const FieldTasksTable = () => {
    const tasks = [
        { id: 'TSK-001', task: 'Building Inspection', location: 'Town Hall', priority: 'High', status: 'In Progress', due: '2024-04-20' },
        { id: 'TSK-002', task: 'Asset Verification', location: 'Water Plant', priority: 'Medium', status: 'Pending', due: '2024-04-21' },
        { id: 'TSK-003', task: 'Maintenance Check', location: 'Fire Station', priority: 'High', status: 'Completed', due: '2024-04-18' },
        { id: 'TSK-004', task: 'Site Survey', location: 'Community Center', priority: 'Low', status: 'Pending', due: '2024-04-22' },
        { id: 'TSK-005', task: 'Equipment Audit', location: 'Public Works', priority: 'Medium', status: 'In Progress', due: '2024-04-19' },
    ];

    const priorityColors = {
        'High': 'bg-red-500/20 text-red-400',
        'Medium': 'bg-yellow-500/20 text-yellow-400',
        'Low': 'bg-green-500/20 text-green-400',
    };

    const statusColors = {
        'Completed': 'bg-green-500/20 text-green-400',
        'In Progress': 'bg-blue-500/20 text-blue-400',
        'Pending': 'bg-yellow-500/20 text-yellow-400',
    };

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Field Tasks</h3>
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
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Task</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Location</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Priority</th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Status</th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider py-2.5 px-3">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                                <td className="py-2.5 px-3 text-sm font-medium text-white">{task.id}</td>
                                <td className="py-2.5 px-3 text-sm text-white">{task.task}</td>
                                <td className="py-2.5 px-3 text-sm text-white/60">{task.location}</td>
                                <td className="py-2.5 px-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3 text-sm text-white/60 text-right">{task.due}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-white/60">Showing 5 of 342 tasks</span>
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

export default FieldTasksTable;