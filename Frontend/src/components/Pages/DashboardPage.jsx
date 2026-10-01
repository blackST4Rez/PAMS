import Footer from '../Common/Footer';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import { useAuth } from '../Context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const roleLabel = user?.roles?.[0]?.replace(/_/g, ' ') || 'User';

    return (
        <div className="h-screen bg-gray-700 flex overflow-hidden">
            <UnifiedSidebar />

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto content-scroll bg-[#1a1a1a] min-h-0">
                    <PageToolbar />

                    <div className="mt-5 mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome, {user?.fullName || user?.username}
                        </h1>
                        <p className="text-white/60 text-lg mt-1">
                            {roleLabel} Dashboard
                        </p>
                    </div>

                    <div className="bg-[#1c1c1c] border border-white/10 mx-4 p-6 lg:p-8 border-l-10 border-l-[#3849e8]">
                        <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                            Use the sidebar to navigate to the features available to
                            you. Everything you have access to is listed there.
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default DashboardPage;