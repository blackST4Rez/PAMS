import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useRoles } from '../Context/RolesContext';
import { getPermissionsByGroup, generateRoleCode } from '../mock/mockRoles';

const CreateRoleModal = ({ onClose }) => {
    const { user } = useAuth();
    const { createRole, allRoles } = useRoles();

    const [form, setForm] = useState({
        label: '',
        description: '',
    });
    const [selected, setSelected] = useState(() => new Set());
    const [busy, setBusy] = useState(false);

    const grouped = useMemo(() => getPermissionsByGroup(), []);
    const existingCodes = useMemo(
        () => new Set(allRoles().map((r) => r.code)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const previewCode = generateRoleCode(form.label);
    const codeConflict = previewCode && existingCodes.has(previewCode);

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const toggle = (code) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
    };

    const toggleGroup = (items) => {
        const codes = items.map((i) => i.code);
        const allSelected = codes.every((c) => selected.has(c));
        setSelected((prev) => {
            const next = new Set(prev);
            if (allSelected) for (const c of codes) next.delete(c);
            else for (const c of codes) next.add(c);
            return next;
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!form.label.trim()) {
            toast.error('Role name is required');
            return;
        }
        if (!previewCode) {
            toast.error('Role name must contain letters or numbers');
            return;
        }
        if (codeConflict) {
            toast.error(`A role with code "${previewCode}" already exists`);
            return;
        }
        if (selected.size === 0) {
            toast.error('Select at least one permission');
            return;
        }

        setBusy(true);
        try {
            createRole(
                {
                    label: form.label.trim(),
                    description: form.description.trim(),
                    permissions: [...selected],
                },
                user?.username ?? 'unknown'
            );
            toast.success(`Role "${form.label.trim()}" created`);
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#242424] border border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white">
                            Create New Role
                        </h2>
                        <p className="text-xs text-white/50 mt-0.5">
                            Custom role with a specific set of permissions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none shrink-0"
                        aria-label="Close"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto hide-scrollbar">
                    <div className="p-6 space-y-5">
                        {/* Role name */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                Role Name
                            </label>
                            <input
                                type="text"
                                name="label"
                                value={form.label}
                                onChange={onChange}
                                placeholder="e.g. Regional Supervisor"
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                autoFocus
                            />
                            {previewCode && (
                                <p
                                    className={`text-xs mt-1.5 font-mono ${
                                        codeConflict
                                            ? 'text-red-400'
                                            : 'text-white/40'
                                    }`}
                                >
                                    Code: {previewCode}
                                    {codeConflict && ' — already in use'}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                rows={2}
                                placeholder="What is this role responsible for?"
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] resize-none"
                            />
                        </div>

                        {/* Permissions */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Permissions
                                </label>
                                <span className="text-xs text-white/50">
                                    {selected.size} selected
                                </span>
                            </div>

                            <div className="space-y-4">
                                {grouped.map((group) => {
                                    const codes = group.items.map((i) => i.code);
                                    const allSelected = codes.every((c) => selected.has(c));

                                    return (
                                        <div key={group.group}>
                                            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                                                <h4 className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">
                                                    {group.group}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(group.items)}
                                                    className="text-[10px] font-medium uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                                                >
                                                    {allSelected ? 'Clear' : 'Select all'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {group.items.map((item) => {
                                                    const checked = selected.has(item.code);
                                                    return (
                                                        <label
                                                            key={item.code}
                                                            className={`flex items-start gap-3 p-2.5 cursor-pointer border transition-colors ${
                                                                checked
                                                                    ? 'border-[#173ef0]/40 bg-[#173ef0]/5'
                                                                    : 'border-white/5 bg-white/2 hover:bg-white/5'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggle(item.code)}
                                                                className="mt-0.5 h-3.5 w-3.5 shrink-0 border-white/20 bg-white/5 text-[#173ef0] focus:ring-[#173ef0] focus:ring-offset-0"
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-medium text-white leading-snug">
                                                                    {item.label}
                                                                </p>
                                                                <p className="text-[10px] text-white/40 font-mono mt-0.5 truncate">
                                                                    {item.code}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-white/70 font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={busy || codeConflict || !form.label.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaCheck className="w-4 h-4" />
                            {busy ? 'Creating…' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;