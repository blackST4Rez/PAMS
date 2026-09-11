import { FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_ASSET_VALUE_TREND } from '../mock/dashboardData';
import { tooltipStyle, axisStyle } from './chartTheme';

const AssetValueTrend = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Asset Value Trend</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={CHART_ASSET_VALUE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle}
                        formatter={(v) => [`रू ${v} करोड`, 'Value']} />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2}
                        dot={{ fill: '#22c55e', r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between p-3">
            <span className="text-sm font-medium text-white">Total Value</span>
            <div className="text-right">
                <span className="text-sm font-bold text-white">रू 12.4 करोड</span>
                <span className="text-xs text-green-400 ml-2">↑ 8.5%</span>
            </div>
        </div>
    </div>
);

export default AssetValueTrend;