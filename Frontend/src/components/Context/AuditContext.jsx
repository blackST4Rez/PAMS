import { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_AUDIT_LOG, makeAuditId } from '../mock/mockAudit';

const AuditContext = createContext(null);

const LS = {
    log: () => 'mock_audit_log',
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

/* ============================================================
   STANDALONE LOGGER
   Importable from any context file. Writes directly to localStorage.
   No React state, no provider required.
   ============================================================ */
export const logAuditEvent = ({
    entityType,
    entityId,
    action,
    actor,
    summary,
    before = null,
    after = null,
}) => {
    if (!entityType || !action) return;

    const entry = {
        id: makeAuditId(),
        entityType,
        entityId: entityId ?? '',
        action,
        actor: actor ?? 'unknown',
        at: new Date().toISOString(),
        summary: summary ?? '',
        before,
        after,
    };

    const current = readJSON(LS.log(), []);
    const next = [entry, ...current].slice(0, 500); // cap at 500 most recent

    writeJSON(LS.log(), next);

    try {
        window.dispatchEvent(new CustomEvent('audit:new-event'));
    } catch {
        /* ignore — server-side rendering or non-browser env */
    }
};

/* ============================================================
   READS
   ============================================================ */
const readLog = () => {
    const stored = readJSON(LS.log(), []);
    return Array.isArray(stored) ? stored : [];
};

/* ============================================================
   PROVIDER
   ============================================================ */
export const AuditProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    /*
      Boot: read whatever's in localStorage. The seed is empty by design,
      so a fresh install starts with an empty audit trail. Every entry
      comes from a real action.
    */
    useEffect(() => {
        const stored = readJSON(LS.log(), []);
        setEntries(Array.isArray(stored) ? stored : []);
        setLoading(false);
    }, []);

    /*
      Live updates:
        • `storage` event fires in other tabs when localStorage changes
        • `audit:new-event` custom event fires in this tab
    */
    useEffect(() => {
        const refresh = () => {
            setEntries(readLog());
            setVersion((v) => v + 1);
        };

        const onStorage = (e) => {
            if (e.key === LS.log()) refresh();
        };

        window.addEventListener('storage', onStorage);
        window.addEventListener('audit:new-event', refresh);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('audit:new-event', refresh);
        };
    }, []);

    /* ============ READS ============ */

    const allEntries = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;
        return [...entries].sort(
            (a, b) => new Date(b.at) - new Date(a.at)
        );
    };

    const getEntry = (id) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;
        return entries.find((e) => e.id === id) ?? null;
    };

    const totalCount = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;
        return entries.length;
    };

    const allActors = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;
        const set = new Set();
        for (const e of entries) if (e.actor) set.add(e.actor);
        return [...set].sort();
    };

    return (
        <AuditContext.Provider
            value={{
                loading,
                allEntries,
                getEntry,
                totalCount,
                allActors,
            }}
        >
            {children}
        </AuditContext.Provider>
    );
};

export const useAudit = () => {
    const ctx = useContext(AuditContext);
    if (!ctx) {
        throw new Error('useAudit must be used inside <AuditProvider>');
    }
    return ctx;
};