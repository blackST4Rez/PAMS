import { FaExclamationTriangle, FaServer, FaLink, FaLock } from 'react-icons/fa';

const SystemAlerts = () => {
    const alerts = [
        { 
            icon: FaServer, 
            title: 'Storage 85% used', 
            detail: '85.6 GB of 100 GB', 
            color: 'yellow' 
        },
        { 
            icon: FaLink, 
            title: 'Integration failed', 
            detail: 'API timeout - 5 min ago', 
            color: 'red' 
        },
        { 
            icon: FaLock, 
            title: '3 locked accounts', 
            detail: 'Multiple failed attempts', 
            color: 'orange' 
        },
    ];

    const colorClasses = {
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-red-50 border-red-200 text-red-700',
        orange: 'bg-orange-50 border-orange-200 text-orange-700',
    };

    const iconColors = {
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        orange: 'text-orange-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-semibold text-gray-700">System Alerts</h3>
            </div>
            <div className="flex-1 space-y-2.5">
                {alerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                        <div key={alert.title} className={`flex items-start gap-3 p-3 rounded-lg border ${colorClasses[alert.color]}`}>
                            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors[alert.color]}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{alert.title}</p>
                                <p className="text-xs opacity-75 mt-0.5">{alert.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SystemAlerts;