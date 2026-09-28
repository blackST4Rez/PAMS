import { FaTimes } from 'react-icons/fa';
import { useAudit } from '../Context/AuditContext';
import {
    getEntityMeta,
    getActionMeta,
} from '../mock/mockAudit';

/* ISO timestamp → "28 Sep 2026, 14:37:12" */
const fmtIso = (iso) => {
    if (!iso) return iso;
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    } catch {
        return iso;
    }
};

/* Keys that should always be treated as timestamps */
const TIMESTAMP_KEYS = new Set([
    'at', 'createdAt', 'updatedAt', 'deletedAt', 'deactivatedAt',
    'runAt', 'actedAt', 'completedAt', 'nextDueAt', 'lastDoneAt',
    'requestedAt', 'lastActive', 'acquiredAt', 'expiresAt',
]);

/* True if a key name looks like a timestamp */
const isTimestampKey = (key) => {
    if (TIMESTAMP_KEYS.has(key)) return true;
    if (typeof key !== 'string') return false;
    if (!key.endsWith('At') && !key.endsWith('Date') && !key.endsWith('Time')) return false;
    return true;
};

/* True if the value looks like an ISO-8601 timestamp */
const looksLikeIso = (value) =>
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);

/*
  Recursively walk an object and reformat timestamp values
  to a readable date/time string. Handles nested objects and
  arrays. Returns a new value; does not mutate the input.
*/
const prettifyTimestamps = (value, keyHint = null) => {
    if (value == null) return value;

    /* Arrays — walk each element */
    if (Array.isArray(value)) {
        return value.map((v) => prettifyTimestamps(v, keyHint));
    }

    /* Objects — walk each key */
    if (typeof value === 'object') {
        const next = {};
        for (const [k, v] of Object.entries(value)) {
            if (isTimestampKey(k) && typeof v === 'string') {
                next[k] = fmtIso(v);
            } else if (looksLikeIso(v)) {
                next[k] = fmtIso(v);
            } else {
                next[k] = prettifyTimestamps(v, k);
            }
        }
        return next;
    }

    /* Primitive — if it's a timestamp under a known key, format it */
    if (keyHint && isTimestampKey(keyHint) && typeof value === 'string') {
        return fmtIso(value);
    }

    return value;
};

/*
  Pretty-print a JSON value with timestamps reformatted.
*/
const JsonBlock = ({ label, value, accent, accentBg }) => {
    if (value === null || value === undefined) return null;

    const pretty = prettifyTimestamps(value);

    return (
        <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentBg}`} />
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                    {label}
                </p>
            </div>
            <pre
                className={`text-sm p-4 bg-[#1c1c1c] overflow-x-auto whitespace-pre-wrap wrap-break-words leading-relaxed font-mono ${accent}`}
            >
                {JSON.stringify(pretty, null, 2)}
            </pre>
        </div>
    );
};

const AuditDetailDrawer = ({ entryId, onClose }) => {
    const { getEntry } = useAudit();

    const entry = getEntry(entryId);
    if (!entry) return null;

    const entityMeta = getEntityMeta(entry.entityType);
    const actionMeta = getActionMeta(entry.action);

    const hasBefore = entry.before !== null && entry.before !== undefined;
    const hasAfter = entry.after !== null && entry.after !== undefined;
    const hasDiff = hasBefore || hasAfter;

    return (
        <div
            className="fixed inset-0 z-9999 flex justify-end bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#161616] border-l border-white/10 w-full sm:max-w-2xl h-full flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ==================== HEADER ==================== */}
                <header className="shrink-0 border-b border-white/10">
                    <div className="px-6 sm:px-8 py-5 flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1 space-y-3">
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-none">
                                {entry.id}
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight wrap-break-words">
                                {entry.summary || 'Audit entry'}
                            </h2>

                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium">
                                    <span className={entityMeta.color}>
                                        {entityMeta.label}
                                    </span>
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium text-white/70">
                                    {actionMeta.label}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 text-sm text-white">
                                    {fmtIso(entry.at)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 text-red-400 bg-[#161616] border border-[#161616] hover:border-red-400 transition-colors text-sm font-medium"
                            aria-label="Close"
                        >
                            <FaTimes className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Close</span>
                        </button>
                    </div>
                </header>

                {/* ==================== BODY ==================== */}
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <div className="px-6 sm:px-8 py-6">
                        {/* Details */}
                        <section>
                            <SectionHeading>Details</SectionHeading>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <DetailItem label="Entity Type" value={entityMeta.label} />
                                <DetailItem label="Action" value={actionMeta.label} />
                                <DetailItem
                                    label="Entity ID"
                                    value={entry.entityId || '—'}
                                    mono
                                />
                                <DetailItem label="Actor" value={entry.actor} />
                                <DetailItem
                                    label="Timestamp"
                                    value={fmtIso(entry.at)}
                                />
                                <DetailItem label="Entry ID" value={entry.id} mono />
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="h-px bg-white/10 my-8" />

                        {/* Changes */}
                        <section>
                            <SectionHeading>Changes</SectionHeading>

                            {hasDiff ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {hasBefore && (
                                        <JsonBlock
                                            label="Before"
                                            value={entry.before}
                                            accent="text-red-300"
                                            accentBg="bg-red-400"
                                        />
                                    )}
                                    {hasAfter && (
                                        <JsonBlock
                                            label="After"
                                            value={entry.after}
                                            accent="text-emerald-300"
                                            accentBg="bg-emerald-400"
                                        />
                                    )}
                                </div>
                            ) : (
                                <p className="text-base text-white/30 italic">
                                    No field-level changes recorded for this entry.
                                </p>
                            )}
                        </section>
                    </div>
                </div>

            </div>
        </div>
    );
};

/* Section heading — accent bar + uppercase label */
const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mb-4">
        <span className="w-0.5 h-4 bg-[#173ef0] rounded-full" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            {children}
        </h3>
    </div>
);

/* Detail item — label above, value below */
const DetailItem = ({ label, value, mono = false }) => (
    <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1.5 leading-none">
            {label}
        </p>
        <p
            className={`text-base text-white leading-snug break-all ${
                mono ? 'font-mono text-sm' : 'font-medium'
            }`}
        >
            {value}
        </p>
    </div>
);

export default AuditDetailDrawer;