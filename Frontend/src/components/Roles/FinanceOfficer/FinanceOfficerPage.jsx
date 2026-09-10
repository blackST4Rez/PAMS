import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import Sidebar from '../../Sidebars/FinanceOfficerSidebar';

{/* Import Stats Components */ }
import TotalBudget from '../../Stats/Finance/TotalBudget';
import TotalExpenses from '../../Stats/Finance/TotalExpenses';
import PendingApprovals from '../../Stats/Finance/PendingApprovals';
import BudgetUtilization from '../../Stats/Finance/BudgetUtilization';

{/* Import Chart Components */ }
import BudgetDistribution from '../../Charts/Finance/BudgetDistribution';
import ExpenseTrend from '../../Charts/Finance/ExpenseTrend';
import RevenueVsExpense from '../../Charts/Finance/RevenueVsExpense';

{/* Import Table Components */ }
import TransactionsTable from '../../Tables/Finance/TransactionsTable';
import RecentActivity from '../../Tables/Finance/RecentActivity';

const FinanceOfficerPage = () => {
    return (
        <div className="min-h-screen bg-[gray-50] flex flex-col">
            {/* Header Component */}
            <Header />

            {/* Main Layout - Sidebar + Content */}
            <div className="flex-1 flex flex-col lg:flex-row w-full px-0 lg:px-0">

                {/* Left Sidebar - Features List */}
                <Sidebar />

                {/* Right Content Area - Takes all remaining space */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white">Finance Dashboard</h1>
                        <p className="text-white text-lg mt-1">Manage budgets, expenses, and financial records</p>
                    </div>

                    {/* Header Stats - 4 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <TotalBudget />
                        <TotalExpenses />
                        <PendingApprovals />
                        <BudgetUtilization />
                    </div>

                    {/* Charts - 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <BudgetDistribution />
                        <ExpenseTrend />
                        <RevenueVsExpense />
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Transactions Table - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <TransactionsTable />
                        </div>

                        {/* Recent Activity - Takes 1 column */}
                        <div>
                            <RecentActivity />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default FinanceOfficerPage;