import Header from '../Common/Header';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import { useAuth } from '../Context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const roleLabel = user?.roles?.[0]?.replace(/_/g, ' ') || 'User';

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome, {user?.fullName || user?.username}
                        </h1>
                        <p className="text-white/60 text-lg mt-1">
                            {roleLabel} Dashboard
                        </p>
                    </div>

                    <div className="bg-[#1c1c1c] border border-white/10 p-6 lg:p-8 border-l-10 border-l-[#3849e8]">
                        <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                            Use the sidebar to navigate to the features available to
                            you. Everything you have access to is listed there.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;