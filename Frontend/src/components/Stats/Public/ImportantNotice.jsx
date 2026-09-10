import { FaInfoCircle } from 'react-icons/fa';

const ImportantNotice = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-yellow-400" />
                Important Notice
            </h3>
            <div className="flex-1 space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-400 font-medium">Update Schedule</p>
                    <p className="text-xs text-white/60 mt-1">Data updated every Monday at 3:00 AM</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white">Last Updated</p>
                    <p className="text-xs text-white/60 mt-1">Today, 3:00 AM</p>
                </div>
            </div>
        </div>
    );
};

export default ImportantNotice;