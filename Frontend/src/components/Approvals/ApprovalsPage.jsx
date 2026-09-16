import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ApprovalsTable from './ApprovalsTable';
import ApprovalDetailDrawer from './ApprovalDetailDrawer';
import { useAuth } from '../Context/AuthContext';
import { useApprovals } from '../Context/ApprovalsContext';

/* Roles allowed to see the oversight view (all pending requests) */
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

    /* ----- Loading ----- */
    if (authLoading || approvalsLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <p className="text-white/50 text-sm">Loading…</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /*
      Entry gate: a user can reach the page if their role appears in any
      approval chain, OR if they have oversight (Admin/Auditor).
      Approval authority is chain-based, not permission-based.
    */
    const canEnter = isChainMember(userRoles) || canOversee;

    if (!canEnter) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] rounded-xl p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view approvals.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white">Approvals</h1>
                        <p className="text-white/60 text-lg mt-1">
                            Review and act on requests waiting for your role
                        </p>
                    </div>

                    <section className="mb-8">
                        <div className="mb-4 flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-white">
                                My Approvals
                            </h2>
                            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-[#173ef0] text-white">
                                {myQueue.length}
                            </span>
                        </div>

                        {myQueue.length === 0 ? (
                            <div className="p-8">
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
                            <div className="mb-4 flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-white">
                                    Oversight — All Requests
                                </h2>
                                <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-[#173ef0] text-white">
                                    {everyRequest.length}
                                </span>
                            </div>

                            {everyRequest.length === 0 ? (
                                <div className="p-8">
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
            </div>

            {selectedRequestId && (
                <ApprovalDetailDrawer
                    requestId={selectedRequestId}
                    onClose={() => setSelectedRequestId(null)}
                />
            )}

            <Footer />
        </div>
    );
};

export default ApprovalsPage;