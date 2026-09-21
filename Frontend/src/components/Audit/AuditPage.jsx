import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import AuditTable from './AuditTable';
import AuditDetailDrawer from './AuditDetailDrawer';
import { useAuth } from '../Context/AuthContext';
import { useAudit } from '../Context/AuditContext';

const AuditPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const { allEntries, allActors, loading: auditLoading } = useAudit();

    const [selectedEntryId, setSelectedEntryId] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        entityType: '',
        action: '',
        actor: '',
    });

    const entries = useMemo(() => allEntries(), [allEntries]);
    const actors = useMemo(() => allActors(), [allActors]);

    const filteredEntries = useMemo(() => {
        const q = filters.search.trim().toLowerCase();

        return entries.filter((e) => {
            if (filters.entityType && e.entityType !== filters.entityType) return false;
            if (filters.action && e.action !== filters.action) return false;
            if (filters.actor && e.actor !== filters.actor) return false;

            if (q) {
                const haystack = [e.summary, e.entityId, e.actor]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [entries, filters]);

    if (authLoading || auditLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <p className="text-white/50 text-sm">Loading…</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!hasPermission('audit.view')) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] rounded-xl p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view the audit trail.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6 px-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold text-white">
                                Audit Trail
                            </h1>
                            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold rounded-full bg-[#173ef0] text-white">
                                {filteredEntries.length}
                            </span>
                        </div>
                        <p className="text-white/60 text-lg mt-1">
                            Every create, update, and delete action across the system
                        </p>
                    </div>

                    <AuditTable
                        entries={filteredEntries}
                        filters={filters}
                        onFiltersChange={setFilters}
                        actors={actors}
                        onRowClick={(id) => setSelectedEntryId(id)}
                    />
                </div>
            </div>

            {selectedEntryId && (
                <AuditDetailDrawer
                    entryId={selectedEntryId}
                    onClose={() => setSelectedEntryId(null)}
                />
            )}

            <Footer />
        </div>
    );
};

export default AuditPage;