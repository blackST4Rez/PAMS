import { 
    FaTachometerAlt, 
    FaUsers, 
    FaBox, 
    FaShieldAlt, 
    FaCog, 
    FaList, 
    FaLink, 
    FaHdd, 
    FaDatabase 
} from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                <div className="mb-4 px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <FaTachometerAlt className="text-[#173ef0]" />
                        Dashboard Menu
                    </h3>
                </div>
                <nav className="space-y-1 px-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaUsers className="w-5 h-5" />
                        <span>User Management</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaBox className="w-5 h-5" />
                        <span>Asset Management</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaShieldAlt className="w-5 h-5" />
                        <span>Roles & Permissions</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaCog className="w-5 h-5" />
                        <span>System Configuration</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaList className="w-5 h-5" />
                        <span>Audit Trail</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaLink className="w-5 h-5" />
                        <span>Integration Logs</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaHdd className="w-5 h-5" />
                        <span>System Backup</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700">
                        <FaDatabase className="w-5 h-5" />
                        <span>Database Status</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;