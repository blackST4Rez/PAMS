import { useMemo, useState } from 'react';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ApprovalsTable from './ApprovalsTable';
import ApprovalDetailDrawer from './ApprovalDetailDrawer';
import { useAuth } from '../Context/AuthContext';
import { useApprovals } from '../Context/ApprovalsContext';

const OVERSIGHT_ROLES = ['SYS_ADMIN', 'AUDITOR'];

const ApprovalsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const {
        pendingForRoles,
        allRequests,
        isChainMember,
        loading: approvalsLoading,
    } = useApprovals();

    const [selectedRequestId, setSelectedRequestId] = useState(null);

    const userRoles = useMemo(() => user?.roles ?? [], [user]);

    const myQueue = useMemo(
        () => pendingForRoles(userRoles),
        [pendingForRoles, userRoles]
    );

    const canOversee = userRoles.some((r) => OVERSIGHT_ROLES.includes(r));
    const everyRequest = useMemo(
        () => (canOversee ? allRequests() : []),
        [canOversee, allRequests]
    );

    if (authLoading || approvalsLoading) {
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

    const canEnter = isChainMember(userRoles) || canOversee;

    if (!canEnter) {
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
                                You do not have permission to view approvals.
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

                    <div className="mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">Approvals</h1>
                        <p className="text-white/60 text-lg mt-1">
                            Review and act on requests waiting for your role
                        </p>
                    </div>

                    <section className="mb-8 px-4">
                        <div className="mb-4 flex items-center flex-wrap">
                            <h2 className="text-xl font-semibold text-white">
                                My Approvals
                            </h2>
                            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-[#173ef0] text-white ml-3">
                                {myQueue.length}
                            </span>
                        </div>

                        {myQueue.length === 0 ? (
                            <div className="bg-[#242424] p-8">
                                <p className="text-white/50 text-sm text-center">
                                    Nothing waiting on your role right now.
                                </p>
                            </div>
                        ) : (
                            <ApprovalsTable
                                requests={myQueue}
                                onRowClick={(id) => setSelectedRequestId(id)}
                            />
                        )}
                    </section>

                    {canOversee && (
                        <section>
                            <div className="mb-4 flex items-center flex-wrap px-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Oversight — All Requests
                                </h2>
                                <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-[#173ef0] text-white ml-3">
                                    {everyRequest.length}
                                </span>
                            </div>

                            {everyRequest.length === 0 ? (
                                <div className="bg-[#242424] p-8">
                                    <p className="text-white/50 text-sm text-center">
                                        No approval requests in the system.
                                    </p>
                                </div>
                            ) : (
                                <ApprovalsTable
                                    requests={everyRequest}
                                    onRowClick={(id) => setSelectedRequestId(id)}
                                    showCurrentOwner
                                />
                            )}
                        </section>
                    )}
                </div>

                <Footer />
            </div>

            {selectedRequestId && (
                <ApprovalDetailDrawer
                    requestId={selectedRequestId}
                    onClose={() => setSelectedRequestId(null)}
                />
            )}
        </div>
    );
};

export default ApprovalsPage;