import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
    FaTimes,
    FaCheck,
    FaTimesCircle,
    FaBan,
    FaUserShield,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useApprovals } from '../Context/ApprovalsContext';
import {
    REQUEST_STATUSES,
    STEP_STATUSES,
    getEntityType,
} from '../mock/mockApprovals';

const ROLE_LABELS = {
    SYS_ADMIN: 'System Admin',
    ASSET_MANAGER: 'Asset Manager',
    FINANCE_OFFICER: 'Finance Officer',
    FIELD_OFFICER: 'Field Officer',
    AUDITOR: 'Auditor',
    PUBLIC_USER: 'Public User',
};

const roleLabel = (code) => ROLE_LABELS[code] ?? code;

/* ISO timestamp → "DD MMM YYYY, HH:mm" */
const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

const ApprovalDetailDrawer = ({ requestId, onClose }) => {
    const { user } = useAuth();
    const { getRequest, actOnCurrentLevel, cancelRequest } = useApprovals();

    const request = getRequest(requestId);

    const [mode, setMode] = useState('view'); // 'view' | 'reject' | 'cancel'
    const [remarks, setRemarks] = useState('');
    const [busy, setBusy] = useState(false);

    if (!request) {
        return null;
    }

    const userRoles = user?.roles ?? [];
    const isTerminal =
        request.status === 'Approved' ||
        request.status === 'Rejected' ||
        request.status === 'Cancelled';

    const currentStep = request.steps.find(
        (s) => s.level === request.currentLevel
    );
    const currentRole = currentStep?.approverRoleCode;

    const canAct =
        !isTerminal && currentRole && userRoles.includes(currentRole);

    const canCancel =
        !isTerminal &&
        (request.requestedBy === user?.username ||
            userRoles.includes('SYS_ADMIN'));

    const requestStatusMeta =
        REQUEST_STATUSES[request.status] ?? REQUEST_STATUSES.Pending;
    const entity = getEntityType(request.entityName);

    /* -------- actions -------- */

    const handleApprove = () => {
        setBusy(true);
        try {
            actOnCurrentLevel(
                request.id,
                'approve',
                user?.username ?? 'unknown',
                remarks.trim() || 'Approved'
            );
            toast.success('Approval recorded');
            setRemarks('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleReject = () => {
        if (!remarks.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        setBusy(true);
        try {
            actOnCurrentLevel(
                request.id,
                'reject',
                user?.username ?? 'unknown',
                remarks.trim()
            );
            toast.success('Request rejected');
            setRemarks('');
            setMode('view');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleCancel = () => {
        setBusy(true);
        try {
            cancelRequest(
                request.id,
                user?.username ?? 'unknown',
                userRoles
            );
            toast.success('Request cancelled');
            setMode('view');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    /* -------- render -------- */

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex justify-end bg-black/70 overflow-hidden"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1a] border-l border-white/10 w-full max-w-2xl h-full flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto hide-scrollbar min-w-0">
                    {/* Sticky header */}
                    <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-5 flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white/50 uppercase tracking-wider">
                                {request.id}
                            </p>
                            <h2 className="text-2xl font-semibold text-white truncate mt-1">
                                {request.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <span
                                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${requestStatusMeta.color}`}
                                >
                                    {requestStatusMeta.label}
                                </span>
                                {!isTerminal && (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 text-[#7c8cff]">
                                        <FaUserShield className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">
                                            Waiting on {roleLabel(currentRole)}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 text-red-400 bg-[#1a1a1a] border border-[#1a1a1a] hover:border-red-400 transition-colors text-sm font-medium"
                            aria-label="Close"
                        >
                            <FaTimes className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-7">
                        {/* Summary */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                                Request Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <Row label="Workflow" value={entity?.label ?? request.entityName} />
                                <Row label="Entity ID" value={request.entityId} />
                                <Row label="Requested By" value={request.requestedBy} />
                                <Row label="Requested At" value={fmtDate(request.createdAt)} />
                                <Row
                                    label="Progress"
                                    value={`Level ${request.currentLevel} of ${request.totalLevels}`}
                                />
                            </div>
                        </div>

                        {/* Steps timeline */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                                Approval Chain
                            </h3>
                            <div className="space-y-3">
                                {request.steps.map((step) => {
                                    const stepMeta =
                                        STEP_STATUSES[step.status] ??
                                        STEP_STATUSES.Pending;
                                    const isCurrent =
                                        !isTerminal &&
                                        step.level === request.currentLevel;

                                    return (
                                        <div
                                            key={step.level}
                                            className={`flex items-start gap-4 p-4 border ${
                                                isCurrent
                                                    ? 'border-[#173ef0]/40 bg-[#173ef0]/5'
                                                    : 'border-white/10 bg-white/2'
                                            }`}
                                        >
                                            {/* Level badge */}
                                            <div
                                                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isCurrent
                                                        ? 'bg-[#173ef0] text-white'
                                                        : 'bg-white/10 text-white/70'
                                                }`}
                                            >
                                                {step.level}
                                            </div>

                                            {/* Body */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                                    <p className="text-base font-semibold text-white">
                                                        {roleLabel(step.approverRoleCode)}
                                                    </p>
                                                    <span
                                                        className={`inline-block text-sm font-medium px-2.5 py-1 rounded-full ${stepMeta.color}`}
                                                    >
                                                        {stepMeta.label}
                                                    </span>
                                                </div>
                                                {step.actedBy && (
                                                    <p className="text-sm text-white/50 mt-1.5">
                                                        Acted by{' '}
                                                        <span className="text-white/70">
                                                            {step.actedBy}
                                                        </span>{' '}
                                                        · {fmtDate(step.actedAt)}
                                                    </p>
                                                )}
                                                {step.remarks && (
                                                    <p className="text-sm text-white/70 mt-2 italic">
                                                        "{step.remarks}"
                                                    </p>
                                                )}
                                                {!step.actedBy &&
                                                    step.status === 'Pending' &&
                                                    !isCurrent && (
                                                        <p className="text-sm text-white/40 mt-1.5">
                                                            Waiting for earlier levels
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action forms */}
                        {mode === 'reject' && (
                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Reject this request
                                </h3>
                                <p className="text-base text-white/60 mb-4">
                                    The request will be terminated and any remaining
                                    levels will be cancelled. The reason is recorded.
                                </p>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={4}
                                    placeholder="Reason for rejection…"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                                />
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('view');
                                            setRemarks('');
                                        }}
                                        className="px-5 py-2.5 text-base font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReject}
                                        disabled={busy}
                                        className="px-5 py-2.5 text-base font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {busy ? 'Rejecting…' : 'Confirm Rejection'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'cancel' && (
                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Cancel this request
                                </h3>
                                <p className="text-base text-white/60 mb-4">
                                    The request will be withdrawn. All remaining
                                    levels will be marked Cancelled. This is
                                    different from a rejection — nothing is
                                    finalized, and the underlying record is left
                                    untouched.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMode('view')}
                                        className="px-5 py-2.5 text-base font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        Keep It
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={busy}
                                        className="px-5 py-2.5 text-base font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                    >
                                        {busy ? 'Cancelling…' : 'Confirm Cancel'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky footer with action buttons (only in view mode) */}
                {mode === 'view' && !isTerminal && (
                    <div className="bg-[#1a1a1a] border-t border-white/10 px-6 py-4 flex flex-wrap justify-end gap-3 shrink-0">
                        {canCancel && (
                            <button
                                onClick={() => setMode('cancel')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium text-white/70 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
                            >
                                <FaBan className="w-4 h-4" />
                                Cancel Request
                            </button>
                        )}

                        {canAct && (
                            <>
                                <button
                                    onClick={() => setMode('reject')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <FaTimesCircle className="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={busy}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    <FaCheck className="w-4 h-4" />
                                    {busy ? 'Approving…' : 'Approve'}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Terminal banner */}
                {isTerminal && (
                    <div className="bg-[#1a1a1a] border-t border-white/10 px-6 py-4 shrink-0">
                        <p className="text-sm text-white/50 text-center">
                            This request is {request.status.toLowerCase()} and
                            cannot be acted on.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

/* Small reusable row for the summary grid */
const Row = ({ label, value }) => (
    <div>
        <p className="text-sm text-white/50 mb-1">{label}</p>
        <p className="text-base text-white break-all">{value}</p>
    </div>
);

export default ApprovalDetailDrawer;