import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import Sidebar from '../../Sidebars/FieldOfficerSidebar';

{/* Import Stats Components */ }
import TotalInspections from '../../Stats/Field/TotalInspections';
import AssetsVerified from '../../Stats/Field/AssetsVerified';
import PendingTasks from '../../Stats/Field/PendingTasks';
import FieldReports from '../../Stats/Field/FieldReports';

{/* Import Chart Components */ }
import InspectionTrend from '../../Charts/Field/InspectionTrend';
import AssetCondition from '../../Charts/Field/AssetCondition';
import TaskCompletion from '../../Charts/Field/TaskCompletion';

{/* Import Table Components */ }
import FieldTasksTable from '../../Tables/Field/FieldTasksTable';
import RecentActivity from '../../Tables/Field/RecentActivity';

const FieldOfficerPage = () => {
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
                        <h1 className="text-3xl font-bold text-white">Field Officer Dashboard</h1>
                        <p className="text-white text-lg mt-1">Manage inspections, verify assets, and report field activities</p>
                    </div>

                    {/* Header Stats - 4 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <TotalInspections />
                        <AssetsVerified />
                        <PendingTasks />
                        <FieldReports />
                    </div>

                    {/* Charts - 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <InspectionTrend />
                        <AssetCondition />
                        <TaskCompletion />
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tasks Table - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <FieldTasksTable />
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

export default FieldOfficerPage;