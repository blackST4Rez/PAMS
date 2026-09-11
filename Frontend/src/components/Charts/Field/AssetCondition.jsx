import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_ASSET_CONDITION } from '../../mock/dashboardData';
import { tooltipStyle } from '../chartTheme';

const AssetCondition = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Asset Condition</h3>
        </div>
        <div className="flex-1 min-h-48">
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie data={CHART_ASSET_CONDITION} dataKey="value" nameKey="name"
                        innerRadius={45} outerRadius={70} paddingAngle={4}>
                        {CHART_ASSET_CONDITION.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
            {CHART_ASSET_CONDITION.map((d) => (
                <div key={d.name} className="flex justify-between items-center text-sm">
                    <span className="text-white">{d.name}</span>
                    <span className="font-medium text-white">{d.value}%</span>
                </div>
            ))}
        </div>
    </div>
);

export default AssetCondition;