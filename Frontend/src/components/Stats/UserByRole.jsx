import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_USERS_BY_ROLE } from '../mock/dashboardData';
import { tooltipStyle } from '../Charts/chartTheme';

const UserByRole = () => (
    <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Users by Role</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie data={CHART_USERS_BY_ROLE} dataKey="value" nameKey="name"
                        innerRadius={45} outerRadius={70} paddingAngle={4}>
                        {CHART_USERS_BY_ROLE.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
            {CHART_USERS_BY_ROLE.map((d) => (
                <div key={d.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-white">{d.name}</span>
                    </div>
                    <span className="font-medium text-white">{d.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default UserByRole;