import { useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import UsersTable from './UsersTable';
import PendingRegistrationsTable from './PendingResgistrationTable';
import RegisterUserModal from './RegisterUserModal';
import { useAuth } from '../Context/AuthContext';

const UsersPage = () => {
    const { hasPermission, loading } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col lg:flex-row w-full">
                    <UnifiedSidebar />
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                            <p className="text-white/50 text-sm">Loading…</p>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }

    if (!hasPermission('admin.users')) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col lg:flex-row w-full">
                    <UnifiedSidebar />
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                            <div className="bg-[#242424] p-8 max-w-xl">
                                <h2 className="text-lg font-semibold text-white mb-2">Access Denied</h2>
                                <p className="text-white/60 text-sm">
                                    You do not have permission to manage users.
                                </p>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                        <div className="mb-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white">User Management</h1>
                                <p className="text-white/60 text-lg mt-1">
                                    Approve registrations and assign roles
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] transition-colors whitespace-nowrap"
                            >
                                + Register New User
                            </button>
                        </div>

                        <PendingRegistrationsTable />
                        <UsersTable />
                    </div>

                    <Footer />
                </div>
            </div>

            {showRegister && (
                <RegisterUserModal onClose={() => setShowRegister(false)} />
            )}
        </div>
    );
};

export default UsersPage;