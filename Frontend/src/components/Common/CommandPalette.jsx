import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaTimes,
    FaBox,
    FaUsers,
    FaAnchor,
    FaWrench,
    FaUserTag,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useApprovals } from '../Context/ApprovalsContext';
import { useMaintenance } from '../Context/MaintenanceContext';
import { useRoles } from '../Context/RolesContext';

const MAX_RESULTS_PER_GROUP = 5;

const safeArray = (v) => (Array.isArray(v) ? v : []);

const CommandPalette = ({ open, onClose }) => {
    const {
        user,
        hasPermission,
        allUsers,
    } = useAuth();
    const { allAssets } = useAssets();
    const { allRequests } = useApprovals();
    const { allSchedules, allLogs } = useMaintenance();
    const { allRoles } = useRoles();

    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const index = useMemo(() => {
        if (!open || !user) return [];

        const items = [];

        try {
            if (hasPermission('asset.view')) {
                for (const a of safeArray(allAssets())) {
                    items.push({
                        group: 'assets',
                        groupLabel: 'Assets',
                        groupIcon: FaBox,
                        label: a.title || a.assetCode || 'Untitled',
                        sub: [a.assetCode, a.categoryName, a.wardName]
                            .filter(Boolean)
                            .join(' · '),
                        path: '/assets',
                        haystack: [
                            a.assetCode,
                            a.title,
                            a.description,
                            a.categoryName,
                            a.wardName,
                        ]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }
            }

            if (hasPermission('admin.users')) {
                for (const u of safeArray(allUsers())) {
                    items.push({
                        group: 'users',
                        groupLabel: 'Users',
                        groupIcon: FaUsers,
                        label: u.fullName || u.username || 'Unknown',
                        sub: [u.username ? `@${u.username}` : null, u.email]
                            .filter(Boolean)
                            .join(' · '),
                        path: '/users',
                        haystack: [u.fullName, u.username, u.email, u.phone]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }
            }

            const roles = user.roles ?? [];
            const isOversight =
                roles.includes('SYS_ADMIN') || roles.includes('AUDITOR');

            if (isOversight) {
                for (const r of safeArray(allRequests())) {
                    items.push({
                        group: 'approvals',
                        groupLabel: 'Approvals',
                        groupIcon: FaAnchor,
                        label: r.title || r.id || 'Untitled request',
                        sub: [r.id, r.status].filter(Boolean).join(' · '),
                        path: '/approvals',
                        haystack: [r.title, r.id, r.entityId, r.requestedBy]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }
            }

            if (hasPermission('maintenance.view')) {
                for (const s of safeArray(allSchedules())) {
                    items.push({
                        group: 'maintenance',
                        groupLabel: 'Maintenance',
                        groupIcon: FaWrench,
                        label: s.title || 'Untitled schedule',
                        sub: s.description || '',
                        path: '/maintenance',
                        haystack: [s.title, s.description]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }

                for (const l of safeArray(allLogs())) {
                    items.push({
                        group: 'maintenance',
                        groupLabel: 'Maintenance',
                        groupIcon: FaWrench,
                        label: l.title || 'Log entry',
                        sub: l.vendor ? `Logged · ${l.vendor}` : 'Logged',
                        path: '/maintenance',
                        haystack: [l.title, l.description, l.vendor]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }
            }

            if (hasPermission('admin.roles')) {
                for (const r of safeArray(allRoles())) {
                    items.push({
                        group: 'roles',
                        groupLabel: 'Roles',
                        groupIcon: FaUserTag,
                        label: r.label || r.code || 'Untitled role',
                        sub: r.description || r.code || '',
                        path: '/roles',
                        haystack: [r.code, r.label, r.description]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase(),
                    });
                }
            }
        } catch (err) {
            console.error('[CommandPalette] index build failed:', err);
            return [];
        }

        return items;
    }, [
        open,
        user,
        hasPermission,
        allAssets,
        allUsers,
        allRequests,
        allSchedules,
        allLogs,
        allRoles,
    ]);

    const grouped = useMemo(() => {
        const q = query.trim().toLowerCase();

        const matched = q
            ? index.filter((item) => item.haystack.includes(q))
            : index.slice(0, 20);

        const byGroup = new Map();
        for (const item of matched) {
            if (!byGroup.has(item.group)) {
                byGroup.set(item.group, {
                    key: item.group,
                    label: item.groupLabel,
                    Icon: item.groupIcon,
                    items: [],
                });
            }
            const bucket = byGroup.get(item.group);
            if (bucket.items.length < MAX_RESULTS_PER_GROUP) {
                bucket.items.push(item);
            }
        }

        return [...byGroup.values()];
    }, [index, query]);

    const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

    useEffect(() => {
        if (activeIndex >= flat.length) setActiveIndex(0);
    }, [flat.length, activeIndex]);

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(flat.length - 1, i + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const chosen = flat[activeIndex];
            if (chosen) {
                navigate(chosen.path);
                onClose();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    useEffect(() => {
        if (!listRef.current) return;
        const el = listRef.current.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#161616] border border-white/10 w-full max-w-2xl shadow-2xl fade-slide-in flex flex-col max-h-[70vh]"
                style={{ transformOrigin: 'top center' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-white/10 shrink-0">
                    <FaSearch className="w-4 h-4 text-white shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActiveIndex(0);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="Search assets, users, approvals…"
                        className="flex-1 py-4 bg-transparent text-white placeholder-white/40 text-base focus:outline-none"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setActiveIndex(0);
                                inputRef.current?.focus();
                            }}
                            className="shrink-0 p-1 text-white/40 hover:text-white transition-colors"
                            aria-label="Clear"
                        >
                            <FaTimes className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <kbd className="shrink-0 hidden sm:inline-block text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5">
                        Esc
                    </kbd>
                </div>

                {/* Results */}
                <div
                    ref={listRef}
                    className="flex-1 overflow-y-auto hide-scrollbar"
                >
                    {flat.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-sm text-white/40">
                                {query
                                    ? `No results for "${query}"`
                                    : 'Start typing to search…'}
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {grouped.map((group) => (
                                <div key={group.key} className="mb-1 last:mb-0">
                                    {/*
                                      Group header — bigger, white text and
                                      icon, perfectly vertically centered.
                                    */}
                                    <div className="px-5 pt-4 pb-2 flex items-center gap-2.5">
                                        <group.Icon className="w-4 h-4 text-white shrink-0" />
                                        <p className="text-sm font-semibold text-white tracking-wide leading-none">
                                            {group.label}
                                        </p>
                                    </div>

                                    {group.items.map((item) => {
                                        const globalIndex = flat.indexOf(item);
                                        const isActive = globalIndex === activeIndex;
                                        return (
                                            <button
                                                key={`${item.group}-${globalIndex}`}
                                                type="button"
                                                data-active={isActive}
                                                onMouseEnter={() =>
                                                    setActiveIndex(globalIndex)
                                                }
                                                onClick={() => {
                                                    navigate(item.path);
                                                    onClose();
                                                }}
                                                className={`w-full text-left py-2.5 pl-4.5 pr-5 flex items-center gap-3 transition-colors border-l-2 ${
                                                    isActive
                                                        ? 'bg-[#173ef0]/15 border-[#173ef0]'
                                                        : 'border-transparent'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {item.label}
                                                    </p>
                                                    {item.sub && (
                                                        <p className="text-xs text-white/50 truncate mt-0.5">
                                                            {item.sub}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer — bigger text and icons */}
                <div className="border-t border-white/10 px-5 py-3.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="inline-flex items-center gap-2">
                            <kbd className="text-sm font-mono text-white/70 border border-white/15 px-2 py-0.5 leading-none">
                                ↑↓
                            </kbd>
                            navigate
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <kbd className="text-sm font-mono text-white/70 border border-white/15 px-2 py-0.5 leading-none">
                                ↵
                            </kbd>
                            open
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <kbd className="text-sm font-mono text-white/70 border border-white/15 px-2 py-0.5 leading-none">
                            Esc
                        </kbd>
                        close
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CommandPalette;