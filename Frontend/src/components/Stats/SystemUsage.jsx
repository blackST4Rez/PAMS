import { FaChartBar } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_SYSTEM_USAGE } from '../mock/dashboardData';
import { tooltipStyle, axisStyle } from '../Charts/chartTheme';

const SystemUsage = () => (
    <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-white">System Usage</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={CHART_SYSTEM_USAGE}>
                    <defs>
                        <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" {...axisStyle} />
                    <YAxis {...axisStyle} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#usageFill)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white">API calls today</span>
            <span className="font-semibold text-white">2.4k</span>
        </div>
    </div>
);

export default SystemUsage;