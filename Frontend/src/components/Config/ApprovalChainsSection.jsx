import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FaPlus,
    FaTrash,
    FaArrowUp,
    FaArrowDown,
    FaSave,
    FaUndo,
    FaSitemap,
} from 'react-icons/fa';
import { useApprovals } from '../Context/ApprovalsContext';
import { useRoles } from '../Context/RolesContext';
import { useAuth } from '../Context/AuthContext';
import { APPROVAL_ENTITY_TYPES } from '../mock/mockApprovals';

const roleLabel = (code, roles) =>
    roles.find((r) => r.code === code)?.label ?? code;

const ApprovalChainsSection = () => {
    const { user } = useAuth();
    const { getChain, setChain } = useApprovals();
    const { allRoles } = useRoles();

    const roles = useMemo(() => allRoles(), [allRoles]);
    const workflowTypes = useMemo(
        () => Object.values(APPROVAL_ENTITY_TYPES),
        []
    );

    /*
      Local edit state — keyed by entityName. We seed from the
      current chain on first render, then edits happen in-place.
      On save, we call setChain which persists to localStorage and
      logs an audit entry.
    */
    const [drafts, setDrafts] = useState(() => {
        const seed = {};
        for (const wf of workflowTypes) {
            seed[wf.code] = [...getChain(wf.code)];
        }
        return seed;
    });

    /* Any unsaved changes across any workflow? */
    const isDirtyFor = (entityName) => {
        const current = getChain(entityName);
        const draft = drafts[entityName] ?? [];
        if (current.length !== draft.length) return true;
        return current.some((role, i) => role !== draft[i]);
    };

    const anyDirty = workflowTypes.some((wf) => isDirtyFor(wf.code));

    /* -------- editing ops (per workflow) -------- */

    const updateDraft = (entityName, nextChain) =>
        setDrafts((prev) => ({ ...prev, [entityName]: nextChain }));

    const addLevel = (entityName) => {
        const draft = drafts[entityName] ?? [];
        const fallbackRole = roles[0]?.code ?? '';
        updateDraft(entityName, [...draft, fallbackRole]);
    };

    const removeLevel = (entityName, index) => {
        const draft = drafts[entityName] ?? [];
        if (draft.length <= 1) {
            toast.error('A chain must have at least one level');
            return;
        }
        updateDraft(
            entityName,
            draft.filter((_, i) => i !== index)
        );
    };

    const setLevelRole = (entityName, index, roleCode) => {
        const draft = drafts[entityName] ?? [];
        const next = [...draft];
        next[index] = roleCode;
        updateDraft(entityName, next);
    };

    const moveLevel = (entityName, index, direction) => {
        const draft = drafts[entityName] ?? [];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= draft.length) return;
        const next = [...draft];
        [next[index], next[target]] = [next[target], next[index]];
        updateDraft(entityName, next);
    };

    const revert = (entityName) => {
        updateDraft(entityName, [...getChain(entityName)]);
        toast.success('Reverted unsaved changes');
    };

    const save = (entityName) => {
        const draft = drafts[entityName] ?? [];
        if (draft.length === 0) {
            toast.error('A chain must have at least one level');
            return;
        }
        /* Reject duplicates — a role can only appear once per chain */
        if (new Set(draft).size !== draft.length) {
            toast.error('A role can only appear once in a chain');
            return;
        }
        try {
            setChain(entityName, draft);
            toast.success('Approval chain saved');
        } catch (err) {
            toast.error(err.message);
        }
    };

    /* -------- render -------- */

    if (workflowTypes.length === 0) {
        return (
            <div className="bg-[#1a1a1a] border border-white/10 p-8">
                <p className="text-white/50 text-sm">
                    No approval workflows are configured.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Explainer */}
            <div className="bg-[#1a1a1a] border border-white/10 p-5">
                <div className="flex items-start gap-3">
                    <FaSitemap className="w-4 h-4 text-[#7c8cff] mt-0.5 shrink-0" />
                    <div className="text-sm text-white/70 leading-relaxed">
                        Each workflow has an ordered approval chain — one role per level.
                        When a request enters level 1, it sits in that role's queue. Once
                        approved, it moves to level 2, and so on. Changes take effect for{' '}
                        <span className="text-white">new requests only</span>; anything
                        already in flight keeps the levels it was created with.
                    </div>
                </div>
            </div>

            {workflowTypes.map((wf) => {
                const draft = drafts[wf.code] ?? [];
                const dirty = isDirtyFor(wf.code);

                return (
                    <div
                        key={wf.code}
                        className="bg-[#1a1a1a] border border-white/10"
                    >
                        {/* Card header */}
                        <div className="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-4 flex-wrap">
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-white">
                                    {wf.label}
                                </h3>
                                <p className="text-xs text-white/50 mt-0.5">
                                    {wf.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {dirty && (
                                    <span className="text-[10px] uppercase tracking-wider font-medium text-yellow-300">
                                        Unsaved
                                    </span>
                                )}
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                                    {wf.code}
                                </span>
                            </div>
                        </div>

                        {/* Level list */}
                        <div className="p-5 space-y-3">
                            {draft.length === 0 ? (
                                <p className="text-sm text-white/50 py-4 text-center">
                                    No levels yet — add one to get started.
                                </p>
                            ) : (
                                draft.map((roleCode, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === draft.length - 1;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 flex-wrap sm:flex-nowrap bg-[#1c1c1c] border border-white/10 px-3 py-2.5"
                                        >
                                            {/* Level number */}
                                            <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-[#173ef0]/15 text-[#7c8cff] text-sm font-semibold">
                                                {index + 1}
                                            </div>

                                            {/* Role selector */}
                                            <div className="flex-1 min-w-40">
                                                <select
                                                    value={roleCode}
                                                    onChange={(e) =>
                                                        setLevelRole(wf.code, index, e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                                                >
                                                    {roles.map((r) => (
                                                        <option
                                                            key={r.code}
                                                            value={r.code}
                                                            className="bg-[#242424]"
                                                        >
                                                            {r.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => moveLevel(wf.code, index, 'up')}
                                                    disabled={isFirst}
                                                    title="Move up"
                                                    aria-label="Move up"
                                                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                >
                                                    <FaArrowUp className="w-3 h-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveLevel(wf.code, index, 'down')}
                                                    disabled={isLast}
                                                    title="Move down"
                                                    aria-label="Move down"
                                                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                >
                                                    <FaArrowDown className="w-3 h-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLevel(wf.code, index)}
                                                    disabled={draft.length <= 1}
                                                    title="Remove level"
                                                    aria-label="Remove level"
                                                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Add level */}
                            <button
                                type="button"
                                onClick={() => addLevel(wf.code)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <FaPlus className="w-3 h-3" />
                                Add level
                            </button>
                        </div>

                        {/* Card footer — only when dirty */}
                        {dirty && (
                            <div className="px-5 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-xs text-white/50">
                                    Final approver is the last level.
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => revert(wf.code)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
                                    >
                                        <FaUndo className="w-3 h-3" />
                                        Revert
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => save(wf.code)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#173ef0] text-white hover:bg-[#0020ad] transition-colors"
                                    >
                                        <FaSave className="w-3 h-3" />
                                        Save chain
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {anyDirty && (
                <p className="text-xs text-white/40 px-1">
                    Changes are saved per workflow. Save each card you've edited.
                </p>
            )}
        </div>
    );
};

export default ApprovalChainsSection;