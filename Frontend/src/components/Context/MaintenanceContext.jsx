import { createContext, useContext, useEffect, useState } from 'react';
import {
    MOCK_MAINTENANCE_SCHEDULES,
    MOCK_MAINTENANCE_LOGS,
    makeScheduleId,
    makeLogId,
    computeNextDue,
    daysUntil,
    scheduleBucket,
} from '../mock/mockMaintenance';
import { logAuditEvent } from './AuditContext';

const MaintenanceContext = createContext(null);

const LS = {
    schedules: () => 'mock_maintenance_schedules',
    logs: () => 'mock_maintenance_logs',
};

const readJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* quota exceeded or private mode — ignore */
    }
};

export const MaintenanceProvider = ({ children }) => {
    const [schedules, setSchedules] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const storedSchedules = readJSON(LS.schedules(), null);
        const storedLogs = readJSON(LS.logs(), null);

        if (Array.isArray(storedSchedules) && storedSchedules.length > 0) {
            setSchedules(storedSchedules);
        } else {
            setSchedules(MOCK_MAINTENANCE_SCHEDULES);
            writeJSON(LS.schedules(), MOCK_MAINTENANCE_SCHEDULES);
        }

        if (Array.isArray(storedLogs) && storedLogs.length > 0) {
            setLogs(storedLogs);
        } else {
            setLogs(MOCK_MAINTENANCE_LOGS);
            writeJSON(LS.logs(), MOCK_MAINTENANCE_LOGS);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (!e.key) return;

            if (e.key === LS.schedules()) {
                const next = readJSON(LS.schedules(), []);
                setSchedules(Array.isArray(next) ? next : []);
            } else if (e.key === LS.logs()) {
                const next = readJSON(LS.logs(), []);
                setLogs(Array.isArray(next) ? next : []);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const persist = (nextSchedules, nextLogs = logs) => {
        setSchedules(nextSchedules);
        setLogs(nextLogs);
        writeJSON(LS.schedules(), nextSchedules);
        writeJSON(LS.logs(), nextLogs);
        setVersion((v) => v + 1);
    };

    /* ============ READS ============ */

    const allSchedules = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...schedules].sort(
            (a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt)
        );
    };

    const schedulesForAsset = (assetId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return schedules
            .filter((s) => s.assetId === assetId)
            .sort((a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt));
    };

    const dueSoonSchedules = (withinDays = 30) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return schedules
            .filter((s) => {
                if (!s.active) return false;
                const days = daysUntil(s.nextDueAt);
                return days <= withinDays;
            })
            .sort((a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt));
    };

    const getSchedule = (id) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        const s = schedules.find((x) => x.id === id);
        if (!s) return null;
        return {
            ...s,
            bucket: scheduleBucket(s),
            daysUntilDue: daysUntil(s.nextDueAt),
        };
    };

    const logsForSchedule = (scheduleId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return logs
            .filter((l) => l.scheduleId === scheduleId)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    };

    const logsForAsset = (assetId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return logs
            .filter((l) => l.assetId === assetId)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    };

    const allLogs = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...logs].sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
    };

    /* ============ WRITES ============ */

    const createSchedule = (payload) => {
        if (!payload.assetId) throw new Error('Asset is required');
        if (!payload.title?.trim()) throw new Error('Title is required');
        if (!payload.frequencyDays || payload.frequencyDays <= 0) {
            throw new Error('Frequency must be a positive number of days');
        }

        const startFrom = payload.lastDoneAt || new Date().toISOString().slice(0, 10);
        const nextDueAt = computeNextDue(startFrom, payload.frequencyDays);

        const schedule = {
            id: makeScheduleId(),
            assetId: payload.assetId,
            title: payload.title.trim(),
            description: payload.description?.trim() ?? '',
            frequencyDays: Number(payload.frequencyDays),
            lastDoneAt: payload.lastDoneAt || null,
            nextDueAt,
            active: true,
            createdBy: payload.createdBy ?? 'unknown',
            createdAt: new Date().toISOString(),
        };

        persist([schedule, ...schedules]);

        logAuditEvent({
            entityType: 'maintenance',
            entityId: schedule.id,
            action: 'CREATE',
            actor: schedule.createdBy,
            summary: `Created maintenance schedule "${schedule.title}"`,
            before: null,
            after: {
                assetId: schedule.assetId,
                frequencyDays: schedule.frequencyDays,
                nextDueAt: schedule.nextDueAt,
            },
        });

        return schedule;
    };

    const updateSchedule = (id, patch) => {
        const existing = schedules.find((s) => s.id === id);
        if (!existing) throw new Error('Schedule not found');

        const updated = { ...existing, ...patch };

        const frequencyChanged =
            patch.frequencyDays !== undefined &&
            Number(patch.frequencyDays) !== Number(existing.frequencyDays);

        const lastDoneChanged =
            patch.lastDoneAt !== undefined &&
            patch.lastDoneAt !== existing.lastDoneAt;

        if (frequencyChanged || lastDoneChanged) {
            const startFrom =
                updated.lastDoneAt || new Date().toISOString().slice(0, 10);
            updated.nextDueAt = computeNextDue(startFrom, updated.frequencyDays);
        }

        persist(schedules.map((s) => (s.id === id ? updated : s)));

        /* Build the before/after from only the changed fields */
        const changedKeys = Object.keys(patch).filter(
            (k) => patch[k] !== existing[k]
        );
        const before = {};
        const after = {};
        for (const k of changedKeys) {
            before[k] = existing[k];
            after[k] = patch[k];
        }
        if (frequencyChanged || lastDoneChanged) {
            before.nextDueAt = existing.nextDueAt;
            after.nextDueAt = updated.nextDueAt;
        }

        if (changedKeys.length > 0) {
            logAuditEvent({
                entityType: 'maintenance',
                entityId: id,
                action: 'UPDATE',
                actor: patch.updatedBy ?? 'unknown',
                summary: `Updated maintenance schedule "${existing.title}" — ${changedKeys.join(', ')}`,
                before,
                after,
            });
        }

        return updated;
    };

    const deactivateSchedule = (id) => {
        const existing = schedules.find((s) => s.id === id);
        if (!existing) throw new Error('Schedule not found');

        const updated = { ...existing, active: false };
        persist(schedules.map((s) => (s.id === id ? updated : s)));

        logAuditEvent({
            entityType: 'maintenance',
            entityId: id,
            action: 'UPDATE',
            actor: 'unknown',
            summary: `Deactivated maintenance schedule "${existing.title}"`,
            before: { active: true },
            after: { active: false },
        });

        return updated;
    };

    const activateSchedule = (id) => {
        const existing = schedules.find((s) => s.id === id);
        if (!existing) throw new Error('Schedule not found');

        const updated = { ...existing, active: true };
        persist(schedules.map((s) => (s.id === id ? updated : s)));

        logAuditEvent({
            entityType: 'maintenance',
            entityId: id,
            action: 'UPDATE',
            actor: 'unknown',
            summary: `Reactivated maintenance schedule "${existing.title}"`,
            before: { active: false },
            after: { active: true },
        });

        return updated;
    };

    const deleteSchedule = (id) => {
        const existing = schedules.find((s) => s.id === id);

        persist(
            schedules.filter((s) => s.id !== id),
            logs.filter((l) => l.scheduleId !== id)
        );

        if (existing) {
            logAuditEvent({
                entityType: 'maintenance',
                entityId: id,
                action: 'DELETE',
                actor: 'unknown',
                summary: `Deleted maintenance schedule "${existing.title}"`,
                before: { title: existing.title, assetId: existing.assetId },
                after: null,
            });
        }
    };

    const logMaintenance = (scheduleId, payload) => {
        const schedule = schedules.find((s) => s.id === scheduleId);
        if (!schedule) throw new Error('Schedule not found');

        const completedAt = payload.completedAt || new Date().toISOString();
        const completedDateOnly = completedAt.slice(0, 10);

        const nextDueAt = computeNextDue(
            completedDateOnly,
            schedule.frequencyDays
        );

        const logEntry = {
            id: makeLogId(),
            scheduleId,
            assetId: schedule.assetId,
            title: payload.title?.trim() || schedule.title,
            description: payload.description?.trim() ?? '',
            cost: Number(payload.cost) || 0,
            vendor: payload.vendor?.trim() ?? '',
            completedAt,
            nextDueAt,
            loggedBy: payload.loggedBy ?? 'unknown',
            createdAt: new Date().toISOString(),
        };

        const updatedSchedule = {
            ...schedule,
            lastDoneAt: completedDateOnly,
            nextDueAt,
        };

        persist(
            schedules.map((s) => (s.id === scheduleId ? updatedSchedule : s)),
            [logEntry, ...logs]
        );

        logAuditEvent({
            entityType: 'maintenance',
            entityId: logEntry.id,
            action: 'LOG',
            actor: logEntry.loggedBy,
            summary: `Logged maintenance for "${schedule.title}"${logEntry.cost ? ` — cost ${logEntry.cost}` : ''}`,
            before: {
                lastDoneAt: schedule.lastDoneAt,
                nextDueAt: schedule.nextDueAt,
            },
            after: {
                lastDoneAt: completedDateOnly,
                nextDueAt,
                cost: logEntry.cost,
                vendor: logEntry.vendor,
            },
        });

        return logEntry;
    };

    return (
        <MaintenanceContext.Provider
            value={{
                loading,

                allSchedules,
                schedulesForAsset,
                dueSoonSchedules,
                getSchedule,
                logsForSchedule,
                logsForAsset,
                allLogs,

                createSchedule,
                updateSchedule,
                deactivateSchedule,
                activateSchedule,
                deleteSchedule,
                logMaintenance,
            }}
        >
            {children}
        </MaintenanceContext.Provider>
    );
};

export const useMaintenance = () => {
    const ctx = useContext(MaintenanceContext);
    if (!ctx) {
        throw new Error('useMaintenance must be used inside <MaintenanceProvider>');
    }
    return ctx;
};