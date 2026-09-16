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

    /*
      Boot: hydrate from localStorage. Seed on first load.
    */
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

    /* Cross-tab sync */
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

    /*
      All schedules, sorted by next due date (soonest first).
      Overdue come first because their nextDueAt is in the past.
    */
    const allSchedules = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...schedules].sort(
            (a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt)
        );
    };

    /*
      Schedules for a specific asset.
    */
    const schedulesForAsset = (assetId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return schedules
            .filter((s) => s.assetId === assetId)
            .sort((a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt));
    };

    /*
      Schedules that are due or overdue within N days.
      Overdue (negative days) always included.
    */
    const dueSoonSchedules = (withinDays = 30) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return schedules
            .filter((s) => {
                if (!s.active) return false;
                const days = daysUntil(s.nextDueAt);
                return days <= withinDays; // negative (overdue) also passes
            })
            .sort((a, b) => new Date(a.nextDueAt) - new Date(b.nextDueAt));
    };

    /*
      One schedule by id, with its bucket computed.
    */
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

    /*
      Log entries for a schedule, newest first.
    */
    const logsForSchedule = (scheduleId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return logs
            .filter((l) => l.scheduleId === scheduleId)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    };

    /*
      Log entries for an asset, across all its schedules.
    */
    const logsForAsset = (assetId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return logs
            .filter((l) => l.assetId === assetId)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    };

    /*
      Every log entry, newest first — used on a future maintenance history view.
    */
    const allLogs = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...logs].sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
    };

    /* ============ WRITES ============ */

    /*
      Create a new schedule for an asset.
      `lastDoneAt` is optional — if omitted, nextDueAt is computed from today.
    */
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
        return schedule;
    };

    /*
      Update a schedule (title, description, frequency, lastDoneAt).
      Recomputes nextDueAt when either lastDoneAt or frequencyDays changes,
      since nextDueAt is derived from those two fields.
    */
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
        return updated;
    };

    /*
      Deactivate a schedule. It stays in storage but is marked inactive and
      filtered out of "due soon" queries.
    */
    const deactivateSchedule = (id) => {
        const existing = schedules.find((s) => s.id === id);
        if (!existing) throw new Error('Schedule not found');

        const updated = { ...existing, active: false };
        persist(schedules.map((s) => (s.id === id ? updated : s)));
        return updated;
    };

    /* Reactivate a deactivated schedule */
    const activateSchedule = (id) => {
        const existing = schedules.find((s) => s.id === id);
        if (!existing) throw new Error('Schedule not found');

        const updated = { ...existing, active: true };
        persist(schedules.map((s) => (s.id === id ? updated : s)));
        return updated;
    };

    /*
      Hard-delete a schedule AND its associated logs.
      Prefer deactivateSchedule unless you really want it gone.
    */
    const deleteSchedule = (id) => {
        persist(
            schedules.filter((s) => s.id !== id),
            logs.filter((l) => l.scheduleId !== id)
        );
    };

    /*
      Log a completed maintenance event against a schedule.
      - Creates a log entry
      - Advances the schedule's lastDoneAt to the completed date
      - Advances nextDueAt by frequencyDays from the completed date
    */
    const logMaintenance = (scheduleId, payload) => {
        const schedule = schedules.find((s) => s.id === scheduleId);
        if (!schedule) throw new Error('Schedule not found');

        const completedAt =
            payload.completedAt || new Date().toISOString();
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

        return logEntry;
    };

    return (
        <MaintenanceContext.Provider
            value={{
                loading,

                /* reads */
                allSchedules,
                schedulesForAsset,
                dueSoonSchedules,
                getSchedule,
                logsForSchedule,
                logsForAsset,
                allLogs,

                /* writes */
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