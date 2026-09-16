import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { computeNextDue, addDays } from '../mock/mockMaintenance';

const today = () => new Date().toISOString().slice(0, 10);

/* Format a YYYY-MM-DD as "20 Mar 2081" */
const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    } catch {
        return iso;
    }
};

const LogMaintenanceModal = ({ scheduleId, onClose, onSaved }) => {
    const { user } = useAuth();
    const { getAsset } = useAssets();
    const { getSchedule, logMaintenance } = useMaintenance();

    const schedule = getSchedule(scheduleId);
    const asset = schedule ? getAsset(schedule.assetId) : null;

    const [form, setForm] = useState(() => ({
        completedAt: today(),
        cost: '',
        vendor: '',
        description: '',
    }));
    const [busy, setBusy] = useState(false);

    if (!schedule) return null;

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    /* Live preview of the next due date based on the chosen completed date */
    const previewNextDue = computeNextDue(
        form.completedAt || today(),
        schedule.frequencyDays
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.completedAt) {
            toast.error('Completed date is required');
            return;
        }
        const cost = form.cost === '' ? 0 : Number(form.cost);
        if (!Number.isFinite(cost) || cost < 0) {
            toast.error('Cost must be zero or positive');
            return;
        }

        setBusy(true);
        try {
            logMaintenance(schedule.id, {
                title: schedule.title,
                description: form.description,
                cost,
                vendor: form.vendor,
                completedAt: new Date(form.completedAt).toISOString(),
                loggedBy: user?.username ?? 'unknown',
            });
            toast.success('Maintenance logged');
            onSaved();
        } catch (err) {
            toast.error(err.message || 'Failed to log maintenance');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#242424] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Log Maintenance
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Summary of what's being logged */}
                <div className="px-6 py-4 border-b border-white/10">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        Logging against
                    </p>
                    <p className="text-sm font-medium text-white">
                        {schedule.title}
                    </p>
                    {asset && (
                        <p className="text-xs text-white/50 mt-0.5">
                            {asset.assetCode} — {asset.title}
                        </p>
                    )}
                    <p className="text-xs text-white/40 mt-1">
                        Every {schedule.frequencyDays} days · Currently due{' '}
                        {fmtDate(schedule.nextDueAt)}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="Completed On"
                            name="completedAt"
                            type="date"
                            value={form.completedAt}
                            onChange={onChange}
                            required
                        />
                        <Field
                            label="Cost (NPR)"
                            name="cost"
                            type="number"
                            min={0}
                            value={form.cost}
                            onChange={onChange}
                            placeholder="0"
                        />
                    </div>

                    <Field
                        label="Vendor"
                        name="vendor"
                        type="text"
                        value={form.vendor}
                        onChange={onChange}
                        placeholder="e.g. Kathmandu Motors"
                    />

                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            Notes
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={3}
                            placeholder="What was done, any issues noted…"
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                        />
                    </div>

                    {/* Preview of the resulting next-due date */}
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                        <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">
                            After logging, next due becomes
                        </p>
                        <p className="text-sm text-white">
                            {fmtDate(previewNextDue)}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                            Advanced {schedule.frequencyDays} days from the completed date.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-white/70 font-medium rounded-lg hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={busy}
                            className="px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
                        >
                            {busy ? 'Logging…' : 'Log Maintenance'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
        />
    </div>
);

export default LogMaintenanceModal;