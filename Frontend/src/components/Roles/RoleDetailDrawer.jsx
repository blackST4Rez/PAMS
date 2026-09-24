import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck, FaLock, FaUsers } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useRoles } from '../Context/RolesContext';
import {
    getPermissionsByGroup,
    ALL_PERMISSION_CODES,
} from '../mock/mockRoles';

const RoleDetailDrawer = ({ roleCode, users, onClose }) => {
    const { user } = useAuth();
    const { getRole, updateRolePermissions, isRoleInUse } = useRoles();

    const role = getRole(roleCode);

    const [selected, setSelected] = useState(() =>
        role ? new Set(role.permissions ?? []) : new Set()
    );
    const [busy, setBusy] = useState(false);

    /* Sync selection if the role changes underneath us (e.g. another tab) */
    useEffect(() => {
        if (role) setSelected(new Set(role.permissions ?? []));
    }, [role]);

    const grouped = useMemo(() => getPermissionsByGroup(), []);

    const usersWithRole = useMemo(
        () => users.filter((u) => (u.roles ?? []).includes(roleCode)),
        [users, roleCode]
    );

    if (!role) return null;

    const isInUse = isRoleInUse(roleCode, users);
    const isDirty = useMemo(() => {
        const current = new Set(role.permissions ?? []);
        if (current.size !== selected.size) return true;
        for (const p of selected) if (!current.has(p)) return true;
        return false;
    }, [role, selected]);

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
            if (allSelected) {
                for (const c of codes) next.delete(c);
            } else {
                for (const c of codes) next.add(c);
            }
            return next;
        });
    };

    const handleSave = () => {
        const perms = [...selected].filter((c) => ALL_PERMISSION_CODES.includes(c));
        setBusy(true);
        try {
            updateRolePermissions(roleCode, perms, user?.username ?? 'unknown');
            toast.success('Role permissions updated');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-9999 flex justify-end bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-[#161616] border-l border-white/10 w-full max-w-2xl h-full flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#161616] border-b border-white/10 px-6 py-5 flex items-start justify-between gap-4 shrink-0">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white/50 uppercase tracking-wider truncate">
                                {role.code}
                            </p>
                            {role.isSystem && (
                                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
                                    <FaLock className="w-3 h-3" />
                                    System
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-semibold text-white truncate mt-1">
                            {role.label}
                        </h2>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                <FaCheck className="w-3.5 h-3.5" />
                                {selected.size} of {ALL_PERMISSION_CODES.length} permissions
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                <FaUsers className="w-3.5 h-3.5" />
                                {usersWithRole.length}{' '}
                                {usersWithRole.length === 1 ? 'user' : 'users'}
                            </span>
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

                {/* Body — permissions list */}
                <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6">
                    {role.description && (
                        <p className="text-sm text-white/60 leading-relaxed mb-6 italic">
                            {role.description}
                        </p>
                    )}

                    {isInUse && (
                        <div className="mb-6 px-4 py-3 bg-yellow-500/5 border border-yellow-500/30">
                            <p className="text-xs text-yellow-200 leading-relaxed">
                                <span className="font-semibold">
                                    {usersWithRole.length}{' '}
                                    {usersWithRole.length === 1 ? 'user holds' : 'users hold'}{' '}
                                    this role.
                                </span>{' '}
                                Any permission changes take effect immediately for them.
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {grouped.map((group) => {
                            const codes = group.items.map((i) => i.code);
                            const allSelected = codes.every((c) => selected.has(c));
                            const someSelected =
                                !allSelected && codes.some((c) => selected.has(c));

                            return (
                                <div key={group.group}>
                                    {/* Group header with select-all */}
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                                        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                                            {group.group}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(group.items)}
                                            className="text-[10px] font-medium uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                                        >
                                            {allSelected
                                                ? 'Clear all'
                                                : someSelected
                                                    ? 'Select all'
                                                    : 'Select all'}
                                        </button>
                                    </div>

                                    {/* Permission checkboxes */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {group.items.map((item) => {
                                            const checked = selected.has(item.code);
                                            return (
                                                <label
                                                    key={item.code}
                                                    className={`flex items-start gap-3 p-3 cursor-pointer border transition-colors ${
                                                        checked
                                                            ? 'border-[#173ef0]/40 bg-[#173ef0]/5'
                                                            : 'border-white/5 bg-white/2 hover:bg-white/5'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggle(item.code)}
                                                        className="mt-0.5 h-4 w-4 shrink-0 border-white/20 bg-white/5 text-[#173ef0] focus:ring-[#173ef0] focus:ring-offset-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-white leading-snug">
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

                {/* Footer */}
                <div className="bg-[#161616] border-t border-white/10 px-6 py-4 flex flex-wrap justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-base font-medium text-white/70 hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={busy || !isDirty}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium bg-[#173ef0] text-white hover:bg-[#0020ad] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FaCheck className="w-4 h-4" />
                        {busy ? 'Saving…' : isDirty ? 'Save Changes' : 'No Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleDetailDrawer;