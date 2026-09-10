import { FaSignal, FaUser, FaBox, FaShieldAlt, FaLock, FaHdd } from 'react-icons/fa';

const ActivityFeed = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
                <FaSignal className="text-emerald-400 w-5 h-5" />
                Recent Activity Feed
            </h3>
            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto scrollbar-hide">
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaUser className="text-blue-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">John Doe</span> logged in</p>
                        <p className="text-xs text-white/50 mt-0.5">2 minutes ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaBox className="text-green-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">Jane Smith</span> added new asset</p>
                        <p className="text-xs text-white/50 mt-0.5">15 minutes ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaShieldAlt className="text-yellow-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">Admin</span> updated role permissions</p>
                        <p className="text-xs text-white/50 mt-0.5">1 hour ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaLock className="text-red-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">System</span> locked user account</p>
                        <p className="text-xs text-white/50 mt-0.5">2 hours ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaHdd className="text-purple-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">Backup</span> completed successfully</p>
                        <p className="text-xs text-white/50 mt-0.5">3 hours ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaUser className="text-blue-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">Mike Johnson</span> requested access</p>
                        <p className="text-xs text-white/50 mt-0.5">4 hours ago</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 hover:bg-white/5 transition-colors duration-200">
                    <div className="p-2.5 rounded-lg shrink-0">
                        <FaBox className="text-green-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white"><span className="font-semibold">Sarah Wilson</span> updated asset details</p>
                        <p className="text-xs text-white/50 mt-0.5">5 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;