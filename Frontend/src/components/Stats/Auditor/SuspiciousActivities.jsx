import { FaExclamationTriangle, FaLock, FaUserSecret, FaDatabase } from 'react-icons/fa';

const SuspiciousActivities = () => {
    const alerts = [
        { icon: FaLock, title: 'Multiple failed logins', detail: '3 accounts - 10 attempts', color: 'red' },
        { icon: FaUserSecret, title: 'Unusual access pattern', detail: 'admin@system.com - 2AM', color: 'yellow' },
        { icon: FaDatabase, title: 'Bulk data export', detail: '2,450 records exported', color: 'orange' },
    ];

    const iconColors = {
        yellow: 'text-yellow-400',
        red: 'text-red-400',
        orange: 'text-orange-400',
    };

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg">
                    <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-sm font-semibold text-white">Suspicious Activities</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {alerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                        <div key={alert.title} className="flex items-start gap-3 p-3">
                            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors[alert.color]}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{alert.title}</p>
                                <p className="text-xs text-white/60 mt-0.5">{alert.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuspiciousActivities;