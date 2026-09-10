import { FaFlag } from 'react-icons/fa';

const FlaggedItems = () => {
    const items = [
        { title: 'Missing documentation', count: 12, severity: 'high' },
        { title: 'Overdue valuations', count: 8, severity: 'medium' },
        { title: 'Unverified assets', count: 15, severity: 'high' },
        { title: 'Irregular changes', count: 4, severity: 'critical' },
    ];

    const severityColors = {
        critical: 'bg-red-500/20 text-red-400',
        high: 'bg-orange-500/20 text-orange-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
    };

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FaFlag className="text-red-400" />
                Flagged Items
            </h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 shrink-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[item.severity]}`}>
                                {item.count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlaggedItems;