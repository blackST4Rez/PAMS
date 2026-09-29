import { useMemo, useState } from 'react';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import RolesTable from './RolesTable';
import RoleDetailDrawer from './RoleDetailDrawer';
import CreateRoleModal from './CreateRoleModal';
import { useAuth } from '../Context/AuthContext';
import { useRoles } from '../Context/RolesContext';

const RolesPage = () => {
    const {
        hasPermission,
        allUsers,
        loading: authLoading,
        profileVersion,
    } = useAuth();
    const { allRoles, loading: rolesLoading, version } = useRoles();

    const [selectedRoleCode, setSelectedRoleCode] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const users = useMemo(() => allUsers(), [profileVersion]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const roles = useMemo(() => allRoles(), [version]);

    if (authLoading || rolesLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <Loader />
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (!hasPermission('admin.roles')) {
        return (
            <div className="min-h-screen bg-gray-700 flex">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to manage roles.
                            </p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 flex">
            <UnifiedSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-4 sm:p-6 lg:px-8 lg:pt-4 lg:pb-8 overflow-y-auto bg-[#1a1a1a]">
                    <PageToolbar />

                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold text-white">Roles</h1>
                                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold rounded-full bg-[#173ef0] text-white">
                                    {roles.length}
                                </span>
                            </div>
                            <p className="text-white/60 text-lg mt-1">
                                Manage role permissions — changes take effect immediately
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] transition-colors whitespace-nowrap"
                        >
                            + New Role
                        </button>
                    </div>

                    <RolesTable
                        roles={roles}
                        users={users}
                        onRowClick={(code) => setSelectedRoleCode(code)}
                    />
                </div>

                <Footer />
            </div>

            {selectedRoleCode && (
                <RoleDetailDrawer
                    roleCode={selectedRoleCode}
                    users={users}
                    onClose={() => setSelectedRoleCode(null)}
                />
            )}

            {showCreate && (
                <CreateRoleModal onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default RolesPage;