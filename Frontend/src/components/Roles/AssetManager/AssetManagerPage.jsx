import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import Sidebar from '../../Sidebars/AssetManagerSidebar';

{/* Import Stats Components */}
import TotalAssets from '../../Stats/TotalAssets';
import AssetsByCategory from '../../Stats/AssetsByCategory';
import AssetsByStatus from '../../Stats/AssetsByStatus';
import RecentAssets from '../../Stats/RecentAssets';

{/* Import Chart Components */}
import AssetDistribution from '../../Charts/AssetDistribution';
import AssetValueTrend from '../../Charts/AssetValueTrend';
import MaintenanceSchedule from '../../Charts/MaintainanceSchedule';

{/* Import Table Components */}
import AssetTable from '../../Tables/AssetTable';
import RecentActivity from '../../Tables/RecentActivity';

const AssetManagerPage = () => {
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
                        <h1 className="text-3xl font-bold text-gray-900">Asset Dashboard</h1>
                        <p className="text-gray-600 text-lg mt-1">Manage and monitor all your public assets</p>
                    </div>

                    {/* Header Stats - 4 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <TotalAssets />
                        <AssetsByCategory />
                        <AssetsByStatus />
                        <RecentAssets />
                    </div>

                    {/* Charts - 3 columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <AssetDistribution />
                        <AssetValueTrend />
                        <MaintenanceSchedule />
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Asset Table - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <AssetTable />
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

export default AssetManagerPage;