import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import Sidebar from '../../Sidebars/AuditorSidebar';

{/* Import Stats Components */}
import TotalAssets from '../../Stats/Auditor/TotalAssets';
import TotalAssetValue from '../../Stats/Auditor/TotalAssetValue';
import RecentChanges from '../../Stats/Auditor/RecentChanges';
import AuditTrailEntries from '../../Stats/Auditor/AuditTrailEntries';

{/* Import Chart Components */}
import AssetStatusDistribution from '../../Charts/Auditor/AssetStatusDistribution';
import ChangesByEntityType from '../../Charts/Auditor/ChangesByEntityType';
import UserActivityHeatmap from '../../Charts/Auditor/UserActivityHeatmap';

{/* Import Priority Components */}
import RecentAuditTrail from '../../Stats/Auditor/RecentAuditTrail';
import ComplianceStatus from '../../Stats/Auditor/ComplianceStatus';
import SuspiciousActivities from '../../Stats/Auditor/SuspiciousActivities';
import UserActivitySummary from '../../Stats/Auditor/UserActivitySummary';

{/* Import Widget Components */}
import AuditActivityFeed from '../../Stats/Auditor/AuditActivityFeed';
import ComplianceScore from '../../Stats/Auditor/ComplianceScore';
import FlaggedItems from '../../Stats/Auditor/FlaggedItems';
import RecentComplianceEvents from '../../Stats/Auditor/RecentComplianceEvents';
import InactiveUsers from '../../Stats/Auditor/InactiveUsers';
import ActivityByRole from '../../Stats/Auditor/ActivityByRole';

const AuditorPage = () => {
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
                        <h1 className="text-3xl font-bold text-white">Auditor Dashboard</h1>
                        <p className="text-white text-lg mt-1">Monitor compliance, audit trails, and system integrity</p>
                    </div>

                    {/* Header Stats - 4 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <TotalAssets />
                        <TotalAssetValue />
                        <RecentChanges />
                        <AuditTrailEntries />
                    </div>

                    {/* Charts - 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <AssetStatusDistribution />
                        <ChangesByEntityType />
                        <UserActivityHeatmap />
                    </div>

                    {/* Priority Sections - 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <RecentAuditTrail />
                        <ComplianceStatus />
                        <SuspiciousActivities />
                    </div>

                    {/* User Activity Summary */}
                    <div className="mb-6">
                        <UserActivitySummary />
                    </div>

                    {/* Bottom Row - Activity Feed & Widgets */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Activity Feed - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <AuditActivityFeed />
                        </div>
                        
                        {/* Widgets Section - Takes 1 column */}
                        <div className="space-y-6">
                            <ComplianceScore />
                            <FlaggedItems />
                            <RecentComplianceEvents />
                        </div>
                    </div>

                    {/* Bottom Widgets - 2 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <InactiveUsers />
                        <ActivityByRole />
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default AuditorPage;