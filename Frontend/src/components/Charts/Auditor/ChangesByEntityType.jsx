import { FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_CHANGES_BY_ENTITY } from '../../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../chartTheme';

const ChangesByEntityType = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Changes by Entity Type</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CHART_CHANGES_BY_ENTITY}>
                    <XAxis dataKey="name" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {CHART_CHANGES_BY_ENTITY.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
            {CHART_CHANGES_BY_ENTITY.map((d) => (
                <div key={d.name} className="flex justify-between items-center text-sm">
                    <span className="text-white">{d.name}</span>
                    <span className="font-medium text-white">{d.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default ChangesByEntityType;