import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { computeNextDue } from '../mock/mockMaintenance';

const today = () => new Date().toISOString().slice(0, 10);

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
                                Log Maintenance
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight wrap-break-words">
                                {schedule.title}
                            </h2>

                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                {asset && (
                                    <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium text-white/80">
                                        {asset.assetCode} — {asset.title}
                                    </span>
                                )}
                                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-sm font-medium text-white/60">
                                    Every {schedule.frequencyDays} days
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
                <form
                    onSubmit={onSubmit}
                    className="flex-1 min-h-0 flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <div className="px-6 sm:px-8 py-6">
                            {/* Current schedule status */}
                            <section>
                                <SectionHeading>Current Schedule</SectionHeading>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <DetailItem
                                        label="Frequency"
                                        value={`Every ${schedule.frequencyDays} days`}
                                    />
                                    <DetailItem
                                        label="Currently Due"
                                        value={fmtDate(schedule.nextDueAt)}
                                    />
                                </div>
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Log entry */}
                            <section>
                                <SectionHeading>Log Entry</SectionHeading>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Completed On
                                        </label>
                                        <input
                                            type="date"
                                            name="completedAt"
                                            value={form.completedAt}
                                            onChange={onChange}
                                            required
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Cost (NPR)
                                        </label>
                                        <input
                                            type="number"
                                            name="cost"
                                            min={0}
                                            value={form.cost}
                                            onChange={onChange}
                                            placeholder="0"
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                        Vendor
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor"
                                        value={form.vendor}
                                        onChange={onChange}
                                        placeholder="e.g. Kathmandu Motors"
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                        Notes
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={onChange}
                                        rows={3}
                                        placeholder="What was done, any issues noted…"
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                                    />
                                </div>
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Preview */}
                            <section>
                                <SectionHeading>After Logging</SectionHeading>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <DetailItem
                                        label="Next Due Becomes"
                                        value={fmtDate(previewNextDue)}
                                    />
                                    <DetailItem
                                        label="Advanced By"
                                        value={`${schedule.frequencyDays} days`}
                                    />
                                </div>
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
                            {busy ? 'Logging…' : 'Log Maintenance'}
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

const DetailItem = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1.5 leading-none">
            {label}
        </p>
        <p className="text-base text-white leading-snug break-all font-medium">
            {value}
        </p>
    </div>
);

export default LogMaintenanceModal;