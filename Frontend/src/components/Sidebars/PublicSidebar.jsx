import {
    FaTachometerAlt,
    FaBullhorn,
    FaInfoCircle,
    FaChartBar,
    FaClock,
} from 'react-icons/fa';

const PublicUserSidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                {/* Sidebar Header */}
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <FaBullhorn className="text-[#173ef0]" />
                        Public Menu
                    </h3>
                </div>

                {/* Sidebar Navigation Menu */}
                <nav className="space-y-1 px-2">
                    {/* Overview - Active */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>

                    {/* Important Notice */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaInfoCircle className="w-5 h-5" />
                        <span>Important Notice</span>
                    </button>

                    {/* Assets by Wards */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaChartBar className="w-5 h-5" />
                        <span>Assets by Wards</span>
                    </button>

                    {/* Public Notices */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaBullhorn className="w-5 h-5" />
                        <span>Public Notices</span>
                    </button>

                    {/* Latest Public Assets */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaClock className="w-5 h-5" />
                        <span>Latest Public Assets</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default PublicUserSidebar;