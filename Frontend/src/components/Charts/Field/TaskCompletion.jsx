import { FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_TASK_COMPLETION } from '../../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../chartTheme';

const TaskCompletion = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Task Completion</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CHART_TASK_COMPLETION}>
                    <XAxis dataKey="name" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Rate']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {CHART_TASK_COMPLETION.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white">Completion Rate</span>
            <span className="font-semibold text-green-400">88.5%</span>
        </div>
    </div>
);

export default TaskCompletion;