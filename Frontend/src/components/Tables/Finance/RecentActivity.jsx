import * as Fa from 'react-icons/fa';
import { MOCK_ACTIVITY_FINANCE } from '../../mock/dashboardData';

const RecentActivity = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Fa.FaClock className="text-[#173ef0]" /> Recent Activity
        </h3>
        <div className="flex-1 space-y-3 overflow-y-auto max-h-75">
            {MOCK_ACTIVITY_FINANCE.map((item, i) => {
                const Icon = Fa[item.icon] || Fa.FaCircle;
                return (
                    <div key={i} className="flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-lg">
                        <div className="p-2 rounded-lg shrink-0"><Icon className={`${item.color} w-4 h-4`} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{item.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">{item.detail}</p>
                        </div>
                        <span className="text-xs text-white/40 shrink-0">{item.time}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

export default RecentActivity;