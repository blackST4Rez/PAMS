import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaTimes,
    FaCheck,
    FaEdit,
    FaTrash,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { formatNPR } from '../Utils/formatCurrency';
import {
    MOCK_ASSET_CATEGORIES,
    MOCK_WARDS,
    DEPRECIATION_METHODS,
} from '../mock/mockAssets';

/* Format an ISO timestamp as "DD MMM YYYY, HH:mm" */
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

/* Human label for a lifecycle event type */
const lifecycleLabel = (type) =>
    ({
        CREATED:  'Created',
        UPDATED:  'Updated',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        DELETED:  'Deleted',
    }[type] ?? type);

/* Color for the lifecycle event icon */
const lifecycleColor = (type) =>
    ({
        CREATED:  'text-blue-400',
        UPDATED:  'text-yellow-400',
        APPROVED: 'text-green-400',
        REJECTED: 'text-red-400',
        DELETED:  'text-red-500',
    }[type] ?? 'text-white/60');

const AssetDetailDrawer = ({ assetId, onClose }) => {
    const { user, hasPermission } = useAuth();
    const {
        getAsset,
        updateAsset,
        softDeleteAsset,
        approveAsset,
        rejectAsset,
    } = useAssets();

    const asset = getAsset(assetId);

    const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'reject'
    const [editForm, setEditForm] = useState(() =>
        asset
            ? {
                title: asset.title,
                description: asset.description,
                categoryId: asset.categoryId,
                wardId: asset.wardId,
                acquisitionDate: asset.acquisitionDate,
                acquisitionCost: asset.acquisitionCost,
                depreciationMethod: asset.depreciationMethod,
                usefulLifeYears: asset.usefulLifeYears ?? '',
            }
            : {}
    );
    const [rejectReason, setRejectReason] = useState('');
    const [busy, setBusy] = useState(false);

    if (!asset) {
        /* If the asset was deleted while the drawer was open, close gracefully */
        return null;
    }

    const canEdit = hasPermission('asset.edit');
    const canDelete = hasPermission('asset.delete');
    const canApprove = hasPermission('asset.approve');
    const isPending = asset.status === 'AWAITING_REVIEW';
    const isDeleted = Boolean(asset.deletedAt);

    const onChange = (e) =>
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    /* ---------- actions ---------- */

    const handleSaveEdit = () => {
        if (!editForm.title.trim()) {
            toast.error('Title is required');
            return;
        }
        const cost = Number(editForm.acquisitionCost);
        if (!Number.isFinite(cost) || cost <= 0) {
            toast.error('Acquisition cost must be a positive number');
            return;
        }

        setBusy(true);
        try {
            updateAsset(asset.id, {
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                categoryId: editForm.categoryId,
                wardId: editForm.wardId,
                acquisitionDate: editForm.acquisitionDate,
                acquisitionCost: cost,
                depreciationMethod: editForm.depreciationMethod,
                usefulLifeYears: editForm.usefulLifeYears
                    ? Number(editForm.usefulLifeYears)
                    : null,
                updatedBy: user?.username ?? 'unknown',
            });
            toast.success('Asset updated');
            setMode('view');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleApprove = () => {
        setBusy(true);
        try {
            approveAsset(asset.id, user?.username ?? 'unknown');
            toast.success('Asset approved');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        setBusy(true);
        try {
            rejectAsset(asset.id, rejectReason.trim(), user?.username ?? 'unknown');
            toast.success('Asset rejected');
            setMode('view');
            setRejectReason('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = () => {
        if (!confirm(`Soft-delete "${asset.title}"? This keeps the record for audit.`)) return;
        setBusy(true);
        try {
            softDeleteAsset(asset.id, user?.username ?? 'unknown');
            toast.success('Asset soft-deleted');
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    /* ---------- render ---------- */

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1a] border-l border-white/10 w-full max-w-2xl h-full overflow-y-auto hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sticky header */}
                <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-6 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            {asset.assetCode}
                        </p>
                        <h2 className="text-xl font-semibold text-white truncate mt-0.5">
                            {asset.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span
                                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${asset.statusMeta.color}`}
                            >
                                {asset.statusMeta.label}
                            </span>
                            {isDeleted && (
                                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/15 text-red-300">
                                    Soft-deleted
                                </span>
                            )}
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
                    {mode === 'view' && (
                        <>
                            <ViewMode asset={asset} />
                            <LifecycleTimeline history={asset.lifecycle} />
                        </>
                    )}

                    {mode === 'edit' && (
                        <EditMode
                            form={editForm}
                            onChange={onChange}
                            onCancel={() => setMode('view')}
                            onSave={handleSaveEdit}
                            busy={busy}
                        />
                    )}

                    {mode === 'reject' && (
                        <RejectMode
                            reason={rejectReason}
                            setReason={setRejectReason}
                            onCancel={() => {
                                setMode('view');
                                setRejectReason('');
                            }}
                            onConfirm={handleReject}
                            busy={busy}
                        />
                    )}
                </div>

                {/* Sticky action footer */}
                {mode === 'view' && (
                    <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-white/10 px-6 py-4 flex flex-wrap justify-end gap-3">
                        {canDelete && !isDeleted && (
                            <button
                                onClick={handleDelete}
                                disabled={busy}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                                <FaTrash className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        )}

                        {canEdit && !isDeleted && !isPending && (
                            <button
                                onClick={() => setMode('edit')}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white/80 hover:bg-white/5 transition-colors"
                            >
                                <FaEdit className="w-3.5 h-3.5" />
                                Edit
                            </button>
                        )}

                        {canApprove && isPending && !isDeleted && (
                            <>
                                <button
                                    onClick={() => setMode('reject')}
                                    disabled={busy}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                    <FaTimes className="w-3.5 h-3.5" />
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={busy}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <FaCheck className="w-3.5 h-3.5" />
                                    Approve
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ---------------- sub-components ---------------- */

const ViewMode = ({ asset }) => {
    const cat = MOCK_ASSET_CATEGORIES.find((c) => c.id === asset.categoryId);
    const ward = MOCK_WARDS.find((w) => w.id === asset.wardId);
    const depr = DEPRECIATION_METHODS.find(
        (m) => m.code === asset.depreciationMethod
    );

    return (
        <div className="space-y-6">
            {/* Description */}
            {asset.description && (
                <div>
                    <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Description
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        {asset.description}
                    </p>
                </div>
            )}

            {/* Detail grid */}
            <div>
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                    Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <Row label="Category" value={cat?.name ?? '—'} />
                    <Row label="Ward" value={ward?.name ?? '—'} />
                    <Row
                        label="Acquisition Date"
                        value={asset.acquisitionDate ?? '—'}
                    />
                    <Row
                        label="Acquisition Cost"
                        value={formatNPR(asset.acquisitionCost)}
                    />
                    <Row
                        label="Current Book Value"
                        value={formatNPR(asset.currentBookValue)}
                    />
                    <Row
                        label="Depreciation Method"
                        value={depr?.label ?? asset.depreciationMethod}
                    />
                    <Row
                        label="Useful Life"
                        value={
                            asset.usefulLifeYears
                                ? `${asset.usefulLifeYears} years`
                                : '—'
                        }
                    />
                    <Row
                        label="Created By"
                        value={asset.createdBy ?? '—'}
                    />
                </div>
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm text-white">{value}</p>
    </div>
);

const LifecycleTimeline = ({ history }) => (
    <div>
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
            Lifecycle
        </h3>
        <div className="space-y-3">
            {history.map((h) => (
                <div key={h.id} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                        <FaExclamationTriangle
                            className={`w-3.5 h-3.5 ${lifecycleColor(h.type)}`}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                            <span className="font-medium">
                                {lifecycleLabel(h.type)}
                            </span>
                            {h.note && (
                                <span className="text-white/60"> — {h.note}</span>
                            )}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                            {fmtDate(h.at)} · {h.by}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const EditMode = ({ form, onChange, onCancel, onSave, busy }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Edit Asset</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
                <Field
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                />
            </div>
            <div className="sm:col-span-2">
                <Field
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                />
            </div>
            <div>
                <Field
                    label="Acquisition Date"
                    name="acquisitionDate"
                    type="date"
                    value={form.acquisitionDate}
                    onChange={onChange}
                />
            </div>
            <div>
                <Field
                    label="Acquisition Cost (NPR)"
                    name="acquisitionCost"
                    type="number"
                    value={form.acquisitionCost}
                    onChange={onChange}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                    Category
                </label>
                <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {MOCK_ASSET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#242424]">
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                    Ward
                </label>
                <select
                    name="wardId"
                    value={form.wardId}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {MOCK_WARDS.map((w) => (
                        <option key={w.id} value={w.id} className="bg-[#242424]">
                            {w.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                    Depreciation Method
                </label>
                <select
                    name="depreciationMethod"
                    value={form.depreciationMethod}
                    onChange={onChange}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                >
                    {DEPRECIATION_METHODS.map((m) => (
                        <option key={m.code} value={m.code} className="bg-[#242424]">
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <Field
                    label="Useful Life (years)"
                    name="usefulLifeYears"
                    type="number"
                    value={form.usefulLifeYears}
                    onChange={onChange}
                />
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onSave}
                disabled={busy}
                className="px-4 py-2 text-sm font-medium bg-[#173ef0] text-white rounded-lg hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
            >
                {busy ? 'Saving…' : 'Save Changes'}
            </button>
        </div>
    </div>
);

const RejectMode = ({ reason, setReason, onCancel, onConfirm, busy }) => (
    <div className="space-y-4">
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
                <h3 className="text-base font-semibold text-white">
                    Reject this asset?
                </h3>
                <p className="text-sm text-white/60 mt-0.5">
                    The asset will move to Cancelled status. The reason you give is recorded.
                </p>
            </div>
        </div>

        <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                Reason for rejection
            </label>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="e.g. Duplicate entry, verification failed, wrong category…"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
            />
        </div>

        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-white/70 rounded-lg hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
                {busy ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
        </div>
    </div>
);

const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
        />
    </div>
);

export default AssetDetailDrawer;