import { 
    FaTachometerAlt, 
    FaBox, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaWrench, 
    FaChartLine, 
    FaFileAlt, 
    FaSearch, 
    FaTags 
} from 'react-icons/fa';

const AssetManagerSidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                {/* Sidebar Header */}
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <FaBox className="text-[#173ef0]" />
                        Asset Menu
                    </h3>
                </div>
                
                {/* Sidebar Navigation Menu */}
                <nav className="space-y-1 px-2">
                    {/* Overview - Active */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>
                    
                    {/* All Assets */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaBox className="w-5 h-5" />
                        <span>All Assets</span>
                    </button>
                    
                    {/* Add Asset */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaPlus className="w-5 h-5" />
                        <span>Add Asset</span>
                    </button>
                    
                    {/* Edit Asset */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaEdit className="w-5 h-5" />
                        <span>Edit Asset</span>
                    </button>
                    
                    {/* Dispose Asset */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaTrash className="w-5 h-5" />
                        <span>Dispose Asset</span>
                    </button>
                    
                    {/* Maintenance */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaWrench className="w-5 h-5" />
                        <span>Maintenance</span>
                    </button>
                    
                    {/* Valuation */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaChartLine className="w-5 h-5" />
                        <span>Valuation</span>
                    </button>
                    
                    {/* Reports */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaFileAlt className="w-5 h-5" />
                        <span>Reports</span>
                    </button>
                    
                    {/* Search */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaSearch className="w-5 h-5" />
                        <span>Search Assets</span>
                    </button>
                    
                    {/* Categories */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaTags className="w-5 h-5" />
                        <span>Categories</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default AssetManagerSidebar;