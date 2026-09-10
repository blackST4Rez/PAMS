import { 
    FaTachometerAlt, 
    FaWallet, 
    FaCreditCard, 
    FaFileInvoice, 
    FaExchangeAlt, 
    FaChartPie, 
    FaReceipt, 
    FaUniversity, 
    FaCalculator, 
    FaSearch, 
    FaTags 
} from 'react-icons/fa';

const FinanceOfficerSidebar = () => {
    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                {/* Sidebar Header */}
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <FaWallet className="text-[#173ef0]" />
                        Finance Menu
                    </h3>
                </div>
                
                {/* Sidebar Navigation Menu */}
                <nav className="space-y-1 px-2">
                    {/* Overview - Active */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#173ef0] text-white transition-colors duration-200">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>
                    
                    {/* Budget Management */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaWallet className="w-5 h-5" />
                        <span>Budget Management</span>
                    </button>
                    
                    {/* Expense Tracking */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaCreditCard className="w-5 h-5" />
                        <span>Expense Tracking</span>
                    </button>
                    
                    {/* Invoices */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaFileInvoice className="w-5 h-5" />
                        <span>Invoices</span>
                    </button>
                    
                    {/* Transactions */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaExchangeAlt className="w-5 h-5" />
                        <span>Transactions</span>
                    </button>
                    
                    {/* Financial Reports */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaChartPie className="w-5 h-5" />
                        <span>Financial Reports</span>
                    </button>
                    
                    {/* Receipts */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaReceipt className="w-5 h-5" />
                        <span>Receipts</span>
                    </button>
                    
                    {/* Bank Accounts */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaUniversity className="w-5 h-5" />
                        <span>Bank Accounts</span>
                    </button>
                    
                    {/* Depreciation */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaCalculator className="w-5 h-5" />
                        <span>Depreciation</span>
                    </button>
                    
                    {/* Search */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#173ef0] transition-colors duration-200 text-white/70 hover:text-white">
                        <FaSearch className="w-5 h-5" />
                        <span>Search Records</span>
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

export default FinanceOfficerSidebar;