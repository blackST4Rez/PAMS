import { FaEye, FaUserShield } from 'react-icons/fa';
import {
    REQUEST_STATUSES,
    getEntityType,
} from '../mock/mockApprovals';

/* Human label for a role code — matches the ROLE_SCHEMA used elsewhere */
const ROLE_LABELS = {
    SYS_ADMIN: 'System Admin',
    ASSET_MANAGER: 'Asset Manager',
    FINANCE_OFFICER: 'Finance Officer',
    FIELD_OFFICER: 'Field Officer',
    AUDITOR: 'Auditor',
    PUBLIC_USER: 'Public User',
};

const roleLabel = (code) => ROLE_LABELS[code] ?? code;

/* Format an ISO date as "DD MMM YYYY, HH:mm" */
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

const ApprovalsTable = ({ requests, onRowClick, showCurrentOwner = false }) => {
    if (!requests || requests.length === 0) {
        return null; // parent handles empty states
    }

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Request
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Type
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Level
                            </th>
                            {showCurrentOwner && (
                                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                    Current Owner
                                </th>
                            )}
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Status
                            </th>
                            <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Requested
                            </th>
                            <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((r) => {
                            const statusMeta =
                                REQUEST_STATUSES[r.status] ??
                                REQUEST_STATUSES.Pending;
                            const entity = getEntityType(r.entityName);

                            /* Current level's approver role (for oversight column) */
                            const currentStep = r.steps.find(
                                (s) => s.level === r.currentLevel
                            );
                            const ownerRole = currentStep?.approverRoleCode;
                            const isTerminal =
                                r.status === 'Approved' ||
                                r.status === 'Rejected' ||
                                r.status === 'Cancelled';

                            return (
                                <tr
                                    key={r.id}
                                    className="border-b border-b-[#3a3a3a] hover:bg-white/2 transition-colors cursor-pointer"
                                    onClick={() => onRowClick(r.id)}
                                >
                                    {/* Request title + id */}
                                    <td className="py-3 px-4">
                                        <p className="text-sm font-medium text-white truncate max-w-md">
                                            {r.title}
                                        </p>
                                        <p className="text-xs text-white/40 mt-0.5">
                                            {r.id}
                                        </p>
                                    </td>

                                    {/* Workflow type */}
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-white/80">
                                            {entity?.label ?? r.entityName}
                                        </p>
                                    </td>

                                    {/* Level */}
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-white/80">
                                            {isTerminal
                                                ? `${r.currentLevel} of ${r.totalLevels}`
                                                : `Level ${r.currentLevel} of ${r.totalLevels}`}
                                        </p>
                                    </td>

                                    {/* Current owner — only for oversight */}
                                    {showCurrentOwner && (
                                        <td className="py-3 px-4">
                                            {isTerminal ? (
                                                <span className="text-xs text-white/40">
                                                    —
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7c8cff]">
                                                    <FaUserShield className="w-3 h-3" />
                                                    {roleLabel(ownerRole)}
                                                </span>
                                            )}
                                        </td>
                                    )}

                                    {/* Status */}
                                    <td className="py-3 px-4">
                                        <span
                                            className={`text-xs font-medium ${statusMeta.color}`}
                                        >
                                            {statusMeta.label}
                                        </span>
                                    </td>

                                    {/* Requested date */}
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-white/70">
                                            {fmtDate(r.createdAt)}
                                        </p>
                                    </td>

                                    {/* Actions */}
                                    <td
                                        className="py-3 px-4 text-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => onRowClick(r.id)}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <FaEye className="w-3 h-3" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalsTable;