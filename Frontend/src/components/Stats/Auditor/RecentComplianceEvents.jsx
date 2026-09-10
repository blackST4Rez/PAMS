import { FaCheckCircle } from 'react-icons/fa';

const RecentComplianceEvents = () => {
    const events = [
        { title: 'Q1 Audit Completed', date: 'Mar 28, 2024' },
        { title: 'Policy Updated', date: 'Mar 15, 2024' },
        { title: 'Training Completed', date: 'Mar 10, 2024' },
        { title: 'Compliance Review', date: 'Mar 05, 2024' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-max flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Recent Compliance Events</h3>
            <div className="space-y-3">
                {events.map((event) => (
                    <div key={event.title} className="flex items-start gap-3 p-2.5">
                        <FaCheckCircle className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{event.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">{event.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentComplianceEvents;