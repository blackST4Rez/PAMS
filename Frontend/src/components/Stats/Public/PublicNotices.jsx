import { FaBullhorn } from 'react-icons/fa';

const PublicNotices = () => {
    const notices = [
        { title: 'System Update', detail: 'New GIS features added', date: 'Mar 28, 2024' },
        { title: 'Data Refresh', detail: 'Asset data updated', date: 'Mar 25, 2024' },
        { title: 'Public Survey', detail: 'Help us improve', date: 'Mar 20, 2024' },
    ];

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FaBullhorn className="text-orange-400" />
                Public Notices
            </h3>
            <div className="flex-1 space-y-2.5">
                {notices.map((notice, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        <p className="text-sm font-medium text-white">{notice.title}</p>
                        <p className="text-xs text-white/60 mt-0.5">{notice.detail}</p>
                        <p className="text-xs text-white/40 mt-1">{notice.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicNotices;