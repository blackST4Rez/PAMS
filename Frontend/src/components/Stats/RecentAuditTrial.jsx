import { FaHistory } from 'react-icons/fa';
import { MOCK_AUDIT_TRAIL } from '../mock/dashboardData';

const severityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
};

const RecentAuditTrail = () => (
    <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg"><FaHistory className="w-4 h-4 text-sky-300" /></div>
            <h3 className="text-sm font-semibold text-white">Recent Audit Trail</h3>
        </div>
        <div className="flex-1 space-y-2.5">
            {MOCK_AUDIT_TRAIL.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.action}</p>
                        <p className="text-xs text-white/50 mt-0.5 truncate">{item.user}</p>
                    </div>
                    <div className="flex flex-col items-end ml-3 shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityColors[item.severity]}`}>
                            {item.severity}
                        </span>
                        <span className="text-xs text-white/40 mt-1">{item.time}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default RecentAuditTrail;