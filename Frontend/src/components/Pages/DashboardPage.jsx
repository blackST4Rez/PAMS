import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import PendingApprovalsWidget from '../Widget/PedningApprovalsWidget';
import { useAuth } from '../Context/AuthContext';

/* ---------- Stats: shared / Asset Manager ---------- */
import TotalAssets from '../Stats/TotalAssets';
import AssetsByCategory from '../Stats/AssetsByCategory';
import AssetsByStatus from '../Stats/AssetsByStatus';
import RecentAssets from '../Stats/RecentAssets';

/* ---------- Stats: SysAdmin ---------- */
import TotalUsers from '../Stats/TotalUsers';
import SystemHealth from '../Stats/SystemHealth';
import PendingAuditItems from '../Stats/PendingAuditItems';

/* ---------- Stats: Auditor (aliased) ---------- */
import TotalAssetsAuditor from '../Stats/Auditor/TotalAssets';
import TotalAssetValue from '../Stats/Auditor/TotalAssetValue';
import RecentChanges from '../Stats/Auditor/RecentChanges';
import AuditTrailEntries from '../Stats/Auditor/AuditTrailEntries';

/* ---------- Stats: Field ---------- */
import TotalInspections from '../Stats/Field/TotalInspections';
import AssetsVerified from '../Stats/Field/AssetsVerified';
import PendingTasks from '../Stats/Field/PendingTasks';
import FieldReports from '../Stats/Field/FieldReports';

/* ---------- Stats: Finance ---------- */
import TotalBudget from '../Stats/Finance/TotalBudget';
import TotalExpenses from '../Stats/Finance/TotalExpenses';
import PendingApprovals from '../Stats/Finance/PendingApprovals';
import BudgetUtilization from '../Stats/Finance/BudgetUtilization';

/* ---------- Stats: Public ---------- */
import TotalPublicAssets from '../Stats/Public/TotalPublicAssets';
import AssetCategories from '../Stats/Public/AssetCategories';
import RecentAdditions from '../Stats/Public/RecentAdditions';
import AssetSearchBar from '../Stats/Public/AssetSearchBar';
import GISMapView from '../Stats/Public/GISMapView';

/* ---------- Charts: Asset Manager ---------- */
import AssetDistribution from '../Charts/AssetDistribution';
import AssetValueTrend from '../Charts/AssetValueTrend';
import MaintenanceSchedule from '../Charts/MaintainanceSchedule';

/* ---------- Charts: Auditor ---------- */
import AssetStatusDistribution from '../Charts/Auditor/AssetStatusDistribution';
import ChangesByEntityType from '../Charts/Auditor/ChangesByEntityType';
import UserActivityHeatmap from '../Charts/Auditor/UserActivityHeatmap';

/* ---------- Charts: Field ---------- */
import InspectionTrend from '../Charts/Field/InspectionTrend';
import AssetCondition from '../Charts/Field/AssetCondition';
import TaskCompletion from '../Charts/Field/TaskCompletion';

/* ---------- Charts: Finance ---------- */
import BudgetDistribution from '../Charts/Finance/BudgetDistribution';
import ExpenseTrend from '../Charts/Finance/ExpenseTrend';
import RevenueVsExpense from '../Charts/Finance/RevenueVsExpense';

/* ---------- Charts: SysAdmin ---------- */
import UsersByRole from '../Stats/UserByRole';
import AssetGrowthTrend from '../Stats/AssetGrowthTrend';
import SystemUsage from '../Stats/SystemUsage';

/* ---------- Widgets: SysAdmin ---------- */
import PriorityApprovals from '../Stats/PriorityApproval';
import RecentAuditTrailSys from '../Stats/RecentAuditTrial';
import SystemAlerts from '../Stats/SystemAlerts';
import ActivityFeed from '../Stats/ActivityFeed';
import QuickStats from '../Stats/QuickStats';
import StorageUsage from '../Stats/StorageUsage';
import SystemStatus from '../Stats/SystemStatus';

/* ---------- Widgets: Auditor (aliased) ---------- */
import RecentAuditTrailAud from '../Stats/Auditor/RecentAuditTrail';
import ComplianceStatus from '../Stats/Auditor/ComplianceStatus';
import SuspiciousActivities from '../Stats/Auditor/SuspiciousActivities';
import UserActivitySummary from '../Stats/Auditor/UserActivitySummary';
import AuditActivityFeed from '../Stats/Auditor/AuditActivityFeed';
import ComplianceScore from '../Stats/Auditor/ComplianceScore';
import FlaggedItems from '../Stats/Auditor/FlaggedItems';
import RecentComplianceEvents from '../Stats/Auditor/RecentComplianceEvents';
import InactiveUsers from '../Stats/Auditor/InactiveUsers';
import ActivityByRole from '../Stats/Auditor/ActivityByRole';

/* ---------- Tables (aliased because of name collisions) ---------- */
import AssetTable from '../Tables/AssetTable';
import RecentActivityAsset from '../Tables/RecentActivity';
import RecentActivityField from '../Tables/Field/RecentActivity';
import RecentActivityFinance from '../Tables/Finance/RecentActivity';
import FieldTasksTable from '../Tables/Field/FieldTasksTable';
import TransactionsTable from '../Tables/Finance/TransactionsTable';

const DashboardPage = () => {
    const { user, hasPermission } = useAuth();
    const roleLabel = user?.roles?.[0]?.replace('_', ' ') || 'User';

    // Positive permission checks that map 1:1 to §3 of FEATURES_AND_ROLES.md
    const isAdmin = hasPermission('admin.users');
    const isAuditor = hasPermission('audit.view') && !hasPermission('asset.create');
    const isFinance = hasPermission('valuation.edit') && !hasPermission('asset.create');
    const isField = hasPermission('verification.verify') && !hasPermission('asset.delete');
    const isAssetManager =
        hasPermission('asset.approve') && hasPermission('asset.delete');
    const isPublic = hasPermission('asset.view') && !hasPermission('asset.create');

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome, {user?.fullName || user?.username}
                        </h1>
                        <p className="text-white/70 text-lg mt-1">{roleLabel} Dashboard</p>
                    </div>

                    {/* Pending approvals — auto-shows only if you have any */}
                    <PendingApprovalsWidget />

                    {/* ===== TOP STATS ===== */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <TotalUsers />
                            <TotalAssets />
                            <SystemHealth />
                            <PendingAuditItems />
                        </div>
                    )}

                    {isFinance && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <TotalBudget />
                            <TotalExpenses />
                            <PendingApprovals />
                            <BudgetUtilization />
                        </div>
                    )}

                    {isField && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <TotalInspections />
                            <AssetsVerified />
                            <PendingTasks />
                            <FieldReports />
                        </div>
                    )}

                    {isAuditor && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <TotalAssetsAuditor />
                            <TotalAssetValue />
                            <RecentChanges />
                            <AuditTrailEntries />
                        </div>
                    )}

                    {isAssetManager && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <TotalAssets />
                            <AssetsByCategory />
                            <AssetsByStatus />
                            <RecentAssets />
                        </div>
                    )}

                    {isPublic && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <TotalPublicAssets />
                            <AssetCategories />
                            <RecentAdditions />
                        </div>
                    )}

                    {/* ===== CHARTS ===== */}
                    {(isAssetManager || isField) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {isAssetManager && <AssetDistribution />}
                            {isAssetManager && <AssetValueTrend />}
                            {isAssetManager && <MaintenanceSchedule />}
                            {isField && <InspectionTrend />}
                            {isField && <AssetCondition />}
                            {isField && <TaskCompletion />}
                        </div>
                    )}

                    {isFinance && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <BudgetDistribution />
                            <ExpenseTrend />
                            <RevenueVsExpense />
                        </div>
                    )}

                    {isAuditor && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <AssetStatusDistribution />
                            <ChangesByEntityType />
                            <UserActivityHeatmap />
                        </div>
                    )}

                    {isAdmin && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <UsersByRole />
                            <AssetGrowthTrend />
                            <SystemUsage />
                        </div>
                    )}

                    {/* ===== AUDIT SECTION ===== */}
                    {hasPermission('audit.view') && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <RecentAuditTrailAud />
                                <ComplianceStatus />
                                <SuspiciousActivities />
                            </div>
                            <div className="mb-6">
                                <UserActivitySummary />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <div className="lg:col-span-2">
                                    <AuditActivityFeed />
                                </div>
                                <div className="space-y-6">
                                    <ComplianceScore />
                                    <FlaggedItems />
                                    <RecentComplianceEvents />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <InactiveUsers />
                                <ActivityByRole />
                            </div>
                        </>
                    )}

                    {/* ===== ADMIN SECTION ===== */}
                    {isAdmin && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <PriorityApprovals />
                                <RecentAuditTrailSys />
                                <SystemAlerts />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <div className="lg:col-span-2">
                                    <ActivityFeed />
                                </div>
                                <div className="space-y-6">
                                    <QuickStats />
                                    <StorageUsage />
                                    <SystemStatus />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ===== PUBLIC SEARCH + GIS ===== */}
                    {isPublic && (
                        <>
                            <div className="mb-6">
                                <AssetSearchBar />
                            </div>
                            <div className="mb-6">
                                <GISMapView />
                            </div>
                        </>
                    )}

                    {/* ===== MAIN TABLE + SIDE ACTIVITY ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            {isFinance && <TransactionsTable />}
                            {isField && <FieldTasksTable />}
                            {(isAdmin || isAssetManager || isAuditor) && <AssetTable />}
                        </div>
                        <div>
                            {isFinance && <RecentActivityFinance />}
                            {isField && <RecentActivityField />}
                            {(isAdmin || isAssetManager || isAuditor) && <RecentActivityAsset />}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;