import { FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_REVENUE_VS_EXPENSE } from '../../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../chartTheme';

const RevenueVsExpense = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Revenue vs Expense</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CHART_REVENUE_VS_EXPENSE}>
                    <XAxis dataKey="name" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle}
                        formatter={(v) => [`रू ${v} करोड`, 'Amount']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {CHART_REVENUE_VS_EXPENSE.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white">Net Balance</span>
            <span className="font-semibold text-green-400">+रू 6.6 करोड</span>
        </div>
    </div>
);

export default RevenueVsExpense;