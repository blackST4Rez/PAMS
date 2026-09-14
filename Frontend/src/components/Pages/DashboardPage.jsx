import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import { useAuth } from '../Context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const roleLabel = user?.roles?.[0]?.replace('_', ' ') || 'User';

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

                    {/* Navigational message */}
                    <div className="bg-[#242424] border border-white/10 rounded p-6 lg:p-8 border-l-10 border-l-[#3849e8]">
                        <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                            Use the sidebar to navigate to the features available to you. Everything you
                            have access to is listed there.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;