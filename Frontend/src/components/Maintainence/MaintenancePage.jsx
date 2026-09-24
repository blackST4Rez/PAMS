import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import DueSoonPanel from './DueSoonPanel';
import SchedulesTable from './SchedulesTable';
import ScheduleModal from './ScheduleModal';
import LogMaintenanceModal from './LogMaintenanceModal';
import { useAuth } from '../Context/AuthContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { scheduleBucket } from '../mock/mockMaintenance';

const MaintenancePage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const {
        allSchedules,
        dueSoonSchedules,
        loading: maintenanceLoading,
    } = useMaintenance();

    const [showCreate, setShowCreate] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState(null);
    const [loggingScheduleId, setLoggingScheduleId] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        assetId: '',
        bucket: '',
    });

    const dueSoon = useMemo(() => dueSoonSchedules(30), [dueSoonSchedules]);

    const filteredSchedules = useMemo(() => {
        const rows = allSchedules();
        const q = filters.search.trim().toLowerCase();

        return rows.filter((s) => {
            if (filters.assetId && s.assetId !== filters.assetId) return false;

            if (filters.bucket) {
                const actualBucket = scheduleBucket(s);
                if (actualBucket !== filters.bucket) return false;
            }

            if (q) {
                const haystack = [s.title, s.description]
                    .filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [allSchedules, filters]);

    if (authLoading || maintenanceLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <p className="text-white/50 text-sm">Loading…</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasPermission('maintenance.view')) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view maintenance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const canCreate = hasPermission('maintenance.create');

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold text-white">Maintenance</h1>
                                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold rounded-full bg-[#173ef0] text-white">
                                    {filteredSchedules.length}
                                </span>
                            </div>
                            <p className="text-white/60 text-lg mt-1">
                                Schedule recurring maintenance and log completed work
                            </p>
                        </div>
                        {canCreate && (
                            <button
                                onClick={() => setShowCreate(true)}
                                className="px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] transition-colors whitespace-nowrap"
                            >
                                + New Schedule
                            </button>
                        )}
                    </div>

                    <DueSoonPanel
                        schedules={dueSoon}
                        canLog={canCreate}
                        onLog={(id) => setLoggingScheduleId(id)}
                    />

                    <SchedulesTable
                        schedules={filteredSchedules}
                        filters={filters}
                        onFiltersChange={setFilters}
                        canEdit={canCreate}
                        onEdit={(id) => setEditingScheduleId(id)}
                        onLog={(id) => setLoggingScheduleId(id)}
                    />
                </div>
            </div>

            {showCreate && (
                <ScheduleModal
                    onClose={() => setShowCreate(false)}
                    onSaved={() => setShowCreate(false)}
                />
            )}

            {editingScheduleId && (
                <ScheduleModal
                    scheduleId={editingScheduleId}
                    onClose={() => setEditingScheduleId(null)}
                    onSaved={() => setEditingScheduleId(null)}
                />
            )}

            {loggingScheduleId && (
                <LogMaintenanceModal
                    scheduleId={loggingScheduleId}
                    onClose={() => setLoggingScheduleId(null)}
                    onSaved={() => setLoggingScheduleId(null)}
                />
            )}
        </div>
    );
};

export default MaintenancePage;