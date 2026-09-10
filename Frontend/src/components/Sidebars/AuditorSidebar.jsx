import { 
    FaTachometerAlt, 
    FaClipboardList, 
    FaShieldAlt, 
    FaFileAlt, 
    FaHistory, 
    FaSearch, 
    FaExclamationTriangle, 
    FaChartBar, 
    FaUserCheck, 
    FaLock, 
    FaEye, 
    FaDownload 
} from 'react-icons/fa';

const AuditorSidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                {/* Sidebar Header */}
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <FaShieldAlt className="text-[#173ef0]" />
                        Auditor Menu
                    </h3>
                </div>
                
                {/* Sidebar Navigation Menu */}
                <nav className="space-y-1 px-2">
                    {/* Overview - Active */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>
                    
                    {/* Audit Trail */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaHistory className="w-5 h-5" />
                        <span>Audit Trail</span>
                    </button>
                    
                    {/* Compliance Report */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaClipboardList className="w-5 h-5" />
                        <span>Compliance Report</span>
                    </button>
                    
                    {/* Export Data */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaDownload className="w-5 h-5" />
                        <span>Export Data</span>
                    </button>
                    
                    {/* Investigate */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaSearch className="w-5 h-5" />
                        <span>Investigate</span>
                    </button>
                    
                    {/* View All Changes */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaEye className="w-5 h-5" />
                        <span>View All Changes</span>
                    </button>
                    
                    {/* Flagged Items */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaExclamationTriangle className="w-5 h-5" />
                        <span>Flagged Items</span>
                    </button>
                    
                    {/* User Activity */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaUserCheck className="w-5 h-5" />
                        <span>User Activity</span>
                    </button>
                    
                    {/* Reports */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaFileAlt className="w-5 h-5" />
                        <span>Reports</span>
                    </button>
                    
                    {/* Analytics */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaChartBar className="w-5 h-5" />
                        <span>Analytics</span>
                    </button>
                    
                    {/* Security */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaLock className="w-5 h-5" />
                        <span>Security</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default AuditorSidebar;