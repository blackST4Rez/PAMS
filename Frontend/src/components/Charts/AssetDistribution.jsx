import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_ASSET_DISTRIBUTION } from '../mock/dashboardData';
import { tooltipStyle } from './chartTheme';

const AssetDistribution = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="w-4 h-4 text-[#173ef0]" />
            <h3 className="text-sm font-semibold text-white">Asset Distribution</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie data={CHART_ASSET_DISTRIBUTION} dataKey="value" nameKey="name"
                        innerRadius={45} outerRadius={70} paddingAngle={4}>
                        {CHART_ASSET_DISTRIBUTION.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
            {CHART_ASSET_DISTRIBUTION.map((d) => (
                <div key={d.name} className="flex items-center gap-2 p-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs font-medium text-white">{d.name} ({d.value}%)</span>
                </div>
            ))}
        </div>
    </div>
);

export default AssetDistribution;