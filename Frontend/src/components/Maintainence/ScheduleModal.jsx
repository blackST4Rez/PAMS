import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';

const FREQUENCY_PRESETS = [
    { label: 'Weekly', days: 7 },
    { label: 'Monthly', days: 30 },
    { label: 'Quarterly', days: 90 },
    { label: 'Semi-annual', days: 180 },
    { label: 'Annual', days: 365 },
];

const today = () => new Date().toISOString().slice(0, 10);

const ScheduleModal = ({ scheduleId, onClose, onSaved }) => {
    const { user } = useAuth();
    const { allAssets } = useAssets();
    const { getSchedule, createSchedule, updateSchedule } = useMaintenance();

    const isEdit = Boolean(scheduleId);
    const existing = isEdit ? getSchedule(scheduleId) : null;

    const [form, setForm] = useState(() => ({
        assetId: existing?.assetId ?? '',
        title: existing?.title ?? '',
        description: existing?.description ?? '',
        frequencyDays: existing?.frequencyDays ?? 30,
        lastDoneAt: existing?.lastDoneAt ?? '',
    }));
    const [busy, setBusy] = useState(false);

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const setFrequency = (days) =>
        setForm((prev) => ({ ...prev, frequencyDays: days }));

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.assetId) {
            toast.error('Please select an asset');
            return;
        }
        if (!form.title.trim()) {
            toast.error('Title is required');
            return;
        }
        const freq = Number(form.frequencyDays);
        if (!Number.isFinite(freq) || freq <= 0) {
            toast.error('Frequency must be a positive number of days');
            return;
        }

        setBusy(true);
        try {
            const payload = {
                assetId: form.assetId,
                title: form.title,
                description: form.description,
                frequencyDays: freq,
                lastDoneAt: form.lastDoneAt || undefined,
                createdBy: user?.username ?? 'unknown',
            };

            if (isEdit) {
                updateSchedule(scheduleId, payload);
                toast.success('Schedule updated');
            } else {
                createSchedule(payload);
                toast.success('Schedule created');
            }
            onSaved();
        } catch (err) {
            toast.error(err.message || 'Failed to save schedule');
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
                        {isEdit ? 'Edit Schedule' : 'New Maintenance Schedule'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {/* Asset */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            Asset
                        </label>
                        <select
                            name="assetId"
                            value={form.assetId}
                            onChange={onChange}
                            disabled={isEdit}
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer disabled:opacity-60"
                        >
                            <option value="" className="bg-[#242424]">
                                — Select an asset —
                            </option>
                            {allAssets().map((a) => (
                                <option key={a.id} value={a.id} className="bg-[#242424]">
                                    {a.assetCode} — {a.title}
                                </option>
                            ))}
                        </select>
                        {isEdit && (
                            <p className="text-xs text-white/40 mt-1">
                                The asset cannot be changed after a schedule is created.
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <Field
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="e.g. Annual engine service"
                        required
                    />

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={3}
                            placeholder="What this maintenance covers…"
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                        />
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                            Frequency (days)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {FREQUENCY_PRESETS.map((p) => (
                                <button
                                    key={p.days}
                                    type="button"
                                    onClick={() => setFrequency(p.days)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                        Number(form.frequencyDays) === p.days
                                            ? 'text-[#7c8cff]'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {p.label} ({p.days})
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            name="frequencyDays"
                            value={form.frequencyDays}
                            onChange={onChange}
                            min={1}
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                        />
                    </div>

                    {/* Last done at */}
                    <Field
                        label="Last Completed (optional)"
                        name="lastDoneAt"
                        type="date"
                        value={form.lastDoneAt}
                        onChange={onChange}
                    />
                    <p className="text-xs text-white/40 -mt-2">
                        Leave blank if this has never been done. The next due date will
                        be calculated from today.
                    </p>

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
                            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Schedule'}
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

export default ScheduleModal;