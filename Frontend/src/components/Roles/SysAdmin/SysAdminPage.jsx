import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import Sidebar from '../../Sidebars/SysAdminSidebar';

{/* Import Stats Components */}
import TotalUsers from '../../Stats/TotalUsers';
import TotalAssets from '../../Stats/TotalAssets';
import SystemHealth from '../../Stats/SystemHealth';
import PendingAuditItems from '../../Stats/PendingAuditItems';

{/* Import Chart Components */}
import UsersByRole from '../../Stats/UserByRole';
import AssetGrowthTrend from '../../Stats/AssetGrowthTrend';
import SystemUsage from '../../Stats/SystemUsage';

{/* Import Priority Components */}
import PriorityApprovals from '../../Stats/PriorityApproval';
import RecentAuditTrail from '../../Stats/RecentAuditTrial';
import SystemAlerts from '../../Stats/SystemAlerts';

{/* Import Widget Components */}
import ActivityFeed from '../../Stats/ActivityFeed';
import QuickStats from '../../Stats/QuickStats';
import StorageUsage from '../../Stats/StorageUsage';
import SystemStatus from '../../Stats/SystemStatus';

const SysAdminPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Component */}
            <Header />

            {/* Main Layout - Sidebar + Content */}
            <div className="flex-1 flex flex-col lg:flex-row w-full px-0 lg:px-0">
                
                {/* Left Sidebar - Features List */}
                <Sidebar />

                {/* Right Content Area - Takes all remaining space */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50">
                    
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
                        <p className="text-gray-600 text-lg mt-1">System Admin Dashboard Overview</p>
                    </div>

                    {/* Header Stats - 4 columns */}
                    {/* Total Users, Total Assets, System Health, Pending Audit Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <TotalUsers />
                        <TotalAssets />
                        <SystemHealth />
                        <PendingAuditItems />
                    </div>

                    {/* Charts - 3 columns */}
                    {/* Users by Role, Asset Growth Trend, System Usage */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <UsersByRole />
                        <AssetGrowthTrend />
                        <SystemUsage />
                    </div>

                    {/* Priority Sections - 3 columns */}
                    {/* Pending Approvals, Recent Audit Trail, System Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <PriorityApprovals />
                        <RecentAuditTrail />
                        <SystemAlerts />
                    </div>

                    {/* Bottom Row - User Activity & Widgets */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Activity Feed - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <ActivityFeed />
                        </div>
                        
                        {/* Widgets Section - Takes 1 column */}
                        <div className="space-y-6">
                            <QuickStats />
                            <StorageUsage />
                            <SystemStatus />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default SysAdminPage;