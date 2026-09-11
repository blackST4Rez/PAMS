import { FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_ASSET_GROWTH } from '../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../Charts/chartTheme';

const AssetGrowthTrend = () => (
    <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Asset Growth Trend</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={CHART_ASSET_GROWTH}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2}
                        dot={{ fill: '#22c55e', r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white">Growth this month</span>
            <span className="font-semibold text-green-400">+12.5%</span>
        </div>
    </div>
);

export default AssetGrowthTrend;