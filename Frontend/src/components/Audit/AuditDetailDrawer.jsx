import { FaTimes } from 'react-icons/fa';
import { useAudit } from '../Context/AuditContext';
import {
    getEntityMeta,
    getActionMeta,
    fmtAuditTime,
} from '../mock/mockAudit';

/* Pretty-print a JSON value with syntax highlighting via <pre> */
const JsonBlock = ({ label, value, accent }) => {
    if (value === null || value === undefined) return null;

    return (
        <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                {label}
            </p>
            <pre
                className={`text-xs p-3 rounded-lg bg-black/30 border border-white/5 overflow-x-auto whitespace-pre-wrap wrap-break-words ${accent ?? 'text-white/80'}`}
            >
                {JSON.stringify(value, null, 2)}
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
            className="fixed inset-0 z-50 flex justify-end bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1a] border-l border-white/10 w-full max-w-2xl h-full overflow-y-auto hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            {entry.id}
                        </p>
                        <h2 className="text-xl font-semibold text-white truncate mt-0.5">
                            {entry.summary || 'Audit entry'}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`text-sm font-medium ${entityMeta.color}`}>
                                {entityMeta.label}
                            </span>
                            <span className="text-white/30">·</span>
                            <span className="text-sm font-medium text-white/80">
                                {actionMeta.label}
                            </span>
                            <span className="text-white/30">·</span>
                            <span className="text-xs text-white/50">
                                {fmtAuditTime(entry.at)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none shrink-0"
                        aria-label="Close"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Metadata grid */}
                    <div>
                        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                            Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <Row label="Entity Type" value={entityMeta.label} />
                            <Row label="Action" value={actionMeta.label} />
                            <Row label="Entity ID" value={entry.entityId || '—'} />
                            <Row label="Actor" value={entry.actor} />
                            <Row label="Timestamp" value={fmtAuditTime(entry.at)} />
                            <Row label="Entry ID" value={entry.id} />
                        </div>
                    </div>

                    {/* Full summary */}
                    {entry.summary && (
                        <div>
                            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                                Summary
                            </h3>
                            <p className="text-sm text-white/80 leading-relaxed">
                                {entry.summary}
                            </p>
                        </div>
                    )}

                    {/* Change diff */}
                    {hasDiff ? (
                        <div>
                            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                                Changes
                            </h3>

                            {/* Side-by-side on wide screens, stacked on narrow */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {hasBefore && (
                                    <JsonBlock
                                        label="Before"
                                        value={entry.before}
                                        accent="text-red-300"
                                    />
                                )}
                                {hasAfter && (
                                    <JsonBlock
                                        label="After"
                                        value={entry.after}
                                        accent="text-green-300"
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                                Changes
                            </h3>
                            <p className="text-sm text-white/40 italic">
                                No field-level change recorded for this entry.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-white/10 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* Small label/value row for the metadata grid */
const Row = ({ label, value }) => (
    <div>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm text-white break-all">{value}</p>
    </div>
);

export default AuditDetailDrawer;