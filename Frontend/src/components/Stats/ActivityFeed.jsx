import * as Fa from 'react-icons/fa';
import { MOCK_ACTIVITY_SYSADMIN } from '../mock/dashboardData';

const ActivityFeed = () => (
    <div className="p-6 h-full flex flex-col">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
            <Fa.FaSignal className="text-emerald-400 w-5 h-5" /> Recent Activity Feed
        </h3>
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
            {MOCK_ACTIVITY_SYSADMIN.map((item, i) => {
                const Icon = Fa[item.icon] || Fa.FaCircle;
                return (
                    <div key={i} className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5">
                        <div className="p-2.5 rounded-lg shrink-0"><Icon className={`${item.color} w-4 h-4`} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">
                                <span className="font-semibold">{item.title}</span> {item.action}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">{item.time}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default ActivityFeed;