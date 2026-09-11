import { FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_USER_ACTIVITY } from '../../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../chartTheme';

const UserActivityHeatmap = () => {
    const max = Math.max(...CHART_USER_ACTIVITY.map((d) => d.value));
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-semibold text-white">User Activity</h3>
            </div>
            <div className="flex-1 min-h-48">
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={CHART_USER_ACTIVITY}>
                        <XAxis dataKey="day" {...axisStyle} />
                        <YAxis {...axisStyle} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {CHART_USER_ACTIVITY.map((d, i) => {
                                const intensity = d.value / max;
                                const color = `rgba(23, 62, 240, ${0.3 + intensity * 0.7})`;
                                return <Cell key={i} fill={color} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white">Peak Activity</span>
                <span className="font-semibold text-white">Wed (247 actions)</span>
            </div>
        </div>
    );
};

export default UserActivityHeatmap;