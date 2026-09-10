import Header from '../../Common/Header';
import Footer from '../../Common/Footer';

{/* Import Sidebar */}
import PublicUserSidebar from '../../Sidebars/PublicSidebar';

{/* Import Stats Components */}
import TotalPublicAssets from '../../Stats/Public/TotalPublicAssets';
import AssetCategories from '../../Stats/Public/AssetCategories';
import RecentAdditions from '../../Stats/Public/RecentAdditions';

{/* Import Search & Filter Components */}
import AssetSearchBar from '../../Stats/Public/AssetSearchBar';


{/* Import Map Components */}
import GISMapView from '../../Stats/Public/GISMapView';
import MapLegend from '../../Stats/Public/MapLegend';
import MapControls from '../../Stats/Public/MapControls'

{/* Import Public Info Components */}
import QuickStatsCard from '../../Stats/Public/QuickStatsCard';
import FAQSection from '../../Stats/Public/FAQSection';
import QuickOverview from '../../Stats/Public/QuickOverview';
import DataFreshness from '../../Stats/Public/DataFreshness';
import PageHeader from '../../Stats/Public/PageHeader';

const PublicUserPage = () => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            {/* Header Component */}
            <Header />

            {/* Main Layout - Sidebar + Content */}
            <div className="flex flex-1">
                {/* Public User Sidebar */}
                <PublicUserSidebar />

                {/* Right Content Area */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto min-w-0 bg-[#1a1a1a]">

                    {/* Page Header */}
                    <div className="flex justify-between mb-6">
                        <div className="flex-col">
                            <h1 className="text-3xl font-bold text-white">Public Asset Dashboard</h1>
                            <p className="text-white/70 text-lg mt-1">Explore and search all public assets in your municipality</p>
                        </div>
                        <PageHeader />
                    </div>

                    {/* Header Stats - 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <TotalPublicAssets />
                        <AssetCategories />
                        <RecentAdditions />
                    </div>

                    {/* Quick Actions/Search - Full width */}
                    <div className="mb-6">
                        <AssetSearchBar />
                    </div>

                    {/* Interactive Map Section */}
                    <div className="mb-6">
                        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white">Interactive Map View</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-l text-white/80">Last updated: Today, 3:00 AM</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                {/* Map - Takes 3 columns */}
                                <div className="lg:col-span-3">
                                    <GISMapView />
                                </div>
                                {/* Map Controls & Legend - Takes 1 column */}
                                <div className="space-y-4">
                                    <MapLegend />
                                    <MapControls />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-6">
                        <FAQSection />
                    </div>

                    {/* Additional Widgets */}
                    <div className="flex justify-between">
                        <QuickOverview />
                        <QuickStatsCard />
                        <DataFreshness />
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default PublicUserPage;