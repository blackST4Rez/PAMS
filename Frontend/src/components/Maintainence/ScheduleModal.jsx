import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck } from 'react-icons/fa';
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

    return createPortal(
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
                                {isEdit ? 'Edit Schedule' : 'New Schedule'}
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight wrap-break-words">
                                {isEdit
                                    ? (existing?.title ?? 'Maintenance Schedule')
                                    : 'Create Maintenance Schedule'}
                            </h2>
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
                <form
                    onSubmit={onSubmit}
                    className="flex-1 min-h-0 flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <div className="px-6 sm:px-8 py-6">
                            {/* Asset */}
                            <section>
                                <SectionHeading>Asset</SectionHeading>

                                <select
                                    name="assetId"
                                    value={form.assetId}
                                    onChange={onChange}
                                    disabled={isEdit}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer disabled:opacity-60"
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
                                    <p className="text-sm text-white/50 mt-2">
                                        The asset cannot be changed after a schedule is created.
                                    </p>
                                )}
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Details */}
                            <section>
                                <SectionHeading>Schedule Details</SectionHeading>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={onChange}
                                            placeholder="e.g. Annual engine service"
                                            required
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={onChange}
                                            rows={3}
                                            placeholder="What this maintenance covers…"
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Frequency */}
                            <section>
                                <SectionHeading>Frequency</SectionHeading>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {FREQUENCY_PRESETS.map((p) => (
                                        <button
                                            key={p.days}
                                            type="button"
                                            onClick={() => setFrequency(p.days)}
                                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                                Number(form.frequencyDays) === p.days
                                                    ? 'text-[#7c8cff]'
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {p.label} ({p.days})
                                        </button>
                                    ))}
                                </div>

                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                    Days between maintenance
                                </label>
                                <input
                                    type="number"
                                    name="frequencyDays"
                                    value={form.frequencyDays}
                                    onChange={onChange}
                                    min={1}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                />
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Last done */}
                            <section>
                                <SectionHeading>Last Completed</SectionHeading>

                                <input
                                    type="date"
                                    name="lastDoneAt"
                                    value={form.lastDoneAt}
                                    onChange={onChange}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                />
                                <p className="text-sm text-white/50 mt-2">
                                    Leave blank if this has never been done. The next due date
                                    will be calculated from today.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* ==================== FOOTER ==================== */}
                    <div className="shrink-0 bg-[#161616] border-t border-white/10 px-6 sm:px-8 py-4 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-base font-medium text-white/70 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium bg-[#173ef0] text-white hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
                        >
                            <FaCheck className="w-4 h-4" />
                            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

/* ---------------- sub-components ---------------- */

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mb-4">
        <span className="w-0.5 h-4 bg-[#173ef0]" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            {children}
        </h3>
    </div>
);

export default ScheduleModal;