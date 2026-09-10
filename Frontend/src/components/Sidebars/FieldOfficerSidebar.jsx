import { 
    FaTachometerAlt, 
    FaClipboardCheck, 
    FaMapMarkedAlt, 
    FaSearchLocation, 
    FaCamera, 
    FaFileAlt, 
    FaRoute, 
    FaTasks, 
    FaCalendarAlt, 
    FaUserCheck,
    FaHistory,
    FaLocationArrow
} from 'react-icons/fa';

const FieldOfficerSidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                {/* Sidebar Header */}
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <FaClipboardCheck className="text-[#173ef0]" />
                        Field Menu
                    </h3>
                </div>
                
                {/* Sidebar Navigation Menu */}
                <nav className="space-y-1 px-2">
                    {/* Overview - Active */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>
                    
                    {/* Inspections */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaClipboardCheck className="w-5 h-5" />
                        <span>Inspections</span>
                    </button>
                    
                    {/* Asset Verification */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaUserCheck className="w-5 h-5" />
                        <span>Asset Verification</span>
                    </button>
                    
                    {/* Field Reports */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaFileAlt className="w-5 h-5" />
                        <span>Field Reports</span>
                    </button>
                    
                    {/* Tasks */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaTasks className="w-5 h-5" />
                        <span>Tasks</span>
                    </button>
                    
                    {/* Schedule */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaCalendarAlt className="w-5 h-5" />
                        <span>Schedule</span>
                    </button>
                    
                    {/* Location Tracking */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaMapMarkedAlt className="w-5 h-5" />
                        <span>Location Tracking</span>
                    </button>
                    
                    {/* Site Navigation */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaRoute className="w-5 h-5" />
                        <span>Site Navigation</span>
                    </button>
                    
                    {/* Photo Capture */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaCamera className="w-5 h-5" />
                        <span>Photo Capture</span>
                    </button>
                    
                    {/* Asset Search */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaSearchLocation className="w-5 h-5" />
                        <span>Asset Search</span>
                    </button>
                    
                    {/* Activity History */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaHistory className="w-5 h-5" />
                        <span>Activity History</span>
                    </button>
                    
                    {/* Geo Location */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaLocationArrow className="w-5 h-5" />
                        <span>Geo Location</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default FieldOfficerSidebar;