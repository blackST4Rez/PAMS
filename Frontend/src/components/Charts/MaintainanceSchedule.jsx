import { FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_MAINTENANCE } from '../mock/dashboardData';
import { tooltipStyle, axisStyle } from './chartTheme';

const MaintenanceSchedule = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Maintenance Schedule</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CHART_MAINTENANCE}>
                    <XAxis dataKey="name" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {CHART_MAINTENANCE.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-white">Upcoming</span>
                </div>
                <span className="text-sm font-bold text-green-400">7 tasks</span>
            </div>
            <div className="flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-white">Overdue</span>
                </div>
                <span className="text-sm font-bold text-red-400">3 tasks</span>
            </div>
        </div>
    </div>
);

export default MaintenanceSchedule;