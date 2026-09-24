import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaBan,
    FaPlay,
    FaCheck,
    FaTimes,
    FaTags,
} from 'react-icons/fa';
import { useCategories } from '../Context/CategoriesContext';
import { useAssets } from '../Context/AssetsContext';
import { useAuth } from '../Context/AuthContext';
import { DEPRECIATION_METHODS } from '../mock/mockAssets';

/* ---------------- helpers ---------------- */

const methodLabel = (code) =>
    DEPRECIATION_METHODS.find((m) => m.code === code)?.label ?? code;

/*
  Count how many non-deleted assets reference a given category.
*/
const countAssetsForCategory = (assets, categoryId) =>
    assets.filter((a) => a.categoryId === categoryId && !a.deletedAt).length;

/* ---------------- main section ---------------- */

const CategoriesSection = () => {
    const { user } = useAuth();
    const {
        allCategories,
        addCategory,
        updateCategory,
        deactivateCategory,
        reactivateCategory,
        deleteCategory,
    } = useCategories();
    const { allAssets } = useAssets();

    const categories = allCategories();
    const assets = allAssets();

    const [editing, setEditing] = useState(null);       // category being edited, or null for new
    const [showCreate, setShowCreate] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const actor = user?.username ?? 'unknown';

    const openCreate = () => {
        setEditing(null);
        setShowCreate(true);
    };

    const openEdit = (category) => {
        setEditing(category);
        setShowCreate(true);
    };

    const closeDrawer = () => {
        setShowCreate(false);
        setEditing(null);
    };

    const askDeactivate = (category) =>
        setConfirmAction({ type: 'deactivate', category });
    const askReactivate = (category) =>
        setConfirmAction({ type: 'reactivate', category });
    const askDelete = (category) =>
        setConfirmAction({ type: 'delete', category });

    const runConfirm = () => {
        if (!confirmAction) return;
        const { type, category } = confirmAction;
        try {
            if (type === 'deactivate') {
                deactivateCategory(category.id, actor);
                toast.success(`"${category.name}" deactivated`);
            } else if (type === 'reactivate') {
                reactivateCategory(category.id, actor);
                toast.success(`"${category.name}" reactivated`);
            } else if (type === 'delete') {
                deleteCategory(category.id, actor, assets);
                toast.success(`"${category.name}" deleted`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setConfirmAction(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Explainer */}
            <div className="bg-[#1a1a1a] border border-white/10 p-5">
                <div className="flex items-start gap-3">
                    <FaTags className="w-4 h-4 text-[#7c8cff] mt-0.5 shrink-0" />
                    <div className="text-sm text-white/70 leading-relaxed">
                        Categories drive the asset register. Each category has a
                        default depreciation method and useful life that prefill
                        the asset form. Categories in use by existing assets cannot
                        be deleted — deactivate them instead.
                    </div>
                </div>
            </div>

            {/* Header + New button */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h3 className="text-base font-semibold text-white">
                        Asset Categories
                        <span className="ml-2 text-xs font-normal text-white/40">
                            {categories.filter((c) => !c.deactivatedAt).length} active
                            {categories.some((c) => c.deactivatedAt) && (
                                <> · {categories.filter((c) => c.deactivatedAt).length} inactive</>
                            )}
                        </span>
                    </h3>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173ef0] text-white text-sm font-medium hover:bg-[#0020ad] transition-colors whitespace-nowrap"
                >
                    <FaPlus className="w-3 h-3" />
                    New Category
                </button>
            </div>

            {/* Table */}
            {categories.length === 0 ? (
                <p className="text-white/50 text-sm py-8 text-center bg-[#1a1a1a] border border-white/10">
                    No categories defined yet.
                </p>
            ) : (
                <div className="bg-[#1a1a1a] border border-white/10 overflow-hidden">
                    {/* Mobile cards */}
                    <div className="lg:hidden divide-y divide-white/5">
                        {categories.map((c) => (
                            <CategoryCard
                                key={c.id}
                                category={c}
                                assetCount={countAssetsForCategory(assets, c.id)}
                                onEdit={() => openEdit(c)}
                                onDeactivate={() => askDeactivate(c)}
                                onReactivate={() => askReactivate(c)}
                                onDelete={() => askDelete(c)}
                            />
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full border-collapse table-fixed">
                            <colgroup>
                                <col className="w-[10%]" />
                                <col className="w-[22%]" />
                                <col className="w-[20%]" />
                                <col className="w-[12%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                                <col className="w-[16%]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Code
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Name
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Depreciation
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Useful Life
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Assets
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider pb-3 px-3 whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((c) => {
                                    const isInactive = Boolean(c.deactivatedAt);
                                    const assetCount = countAssetsForCategory(assets, c.id);
                                    const deletable = assetCount === 0;
                                    return (
                                        <tr
                                            key={c.id}
                                            className="border-b border-b-[#3a3a3a] align-top"
                                        >
                                            <td className="py-3 px-3 text-xs font-mono text-white whitespace-nowrap">
                                                {c.code}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-white">
                                                {c.name}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-white/80 whitespace-nowrap">
                                                {methodLabel(c.defaultDepreciationMethod)}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-white/80 whitespace-nowrap">
                                                {c.usefulLifeYears != null
                                                    ? `${c.usefulLifeYears} yr`
                                                    : '—'}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-white/80">
                                                {assetCount}
                                            </td>
                                            <td className="py-3 px-3">
                                                {isInactive ? (
                                                    <span className="text-xs font-medium text-red-300 whitespace-nowrap">
                                                        Inactive
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-medium text-green-300 whitespace-nowrap">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-1 flex-wrap whitespace-nowrap">
                                                    <button
                                                        onClick={() => openEdit(c)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    {isInactive ? (
                                                        <button
                                                            onClick={() => askReactivate(c)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                                        >
                                                            <FaPlay className="w-3 h-3" />
                                                            Activate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => askDeactivate(c)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 transition-colors"
                                                        >
                                                            <FaBan className="w-3 h-3" />
                                                            Deactivate
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => askDelete(c)}
                                                        disabled={!deletable}
                                                        title={
                                                            deletable
                                                                ? 'Delete category'
                                                                : 'In use by assets — deactivate instead'
                                                        }
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create / Edit drawer */}
            {showCreate && (
                <CategoryDrawer
                    category={editing}
                    onClose={closeDrawer}
                    onSave={(payload) => {
                        try {
                            if (editing) {
                                updateCategory(editing.id, payload, actor);
                                toast.success('Category updated');
                            } else {
                                addCategory(payload, actor);
                                toast.success('Category created');
                            }
                            closeDrawer();
                        } catch (err) {
                            toast.error(err.message);
                        }
                    }}
                />
            )}

            {/* Confirm dialog */}
            {confirmAction && (
                <ConfirmDialog
                    action={confirmAction}
                    assetCount={countAssetsForCategory(
                        assets,
                        confirmAction.category.id
                    )}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runConfirm}
                />
            )}
        </div>
    );
};

/* ==================================================================
   Mobile card
   ================================================================== */

const CategoryCard = ({
    category,
    assetCount,
    onEdit,
    onDeactivate,
    onReactivate,
    onDelete,
}) => {
    const isInactive = Boolean(category.deactivatedAt);
    const deletable = assetCount === 0;

    return (
        <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                        {category.name}
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mt-0.5">
                        {category.code}
                    </p>
                </div>
                {isInactive ? (
                    <span className="text-xs font-medium text-red-300 shrink-0">
                        Inactive
                    </span>
                ) : (
                    <span className="text-xs font-medium text-green-300 shrink-0">
                        Active
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                        Depreciation
                    </p>
                    <p className="text-xs text-white/80">
                        {methodLabel(category.defaultDepreciationMethod)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                        Useful Life
                    </p>
                    <p className="text-xs text-white/80">
                        {category.usefulLifeYears != null
                            ? `${category.usefulLifeYears} yr`
                            : '—'}
                    </p>
                </div>
                <div className="col-span-2 text-left">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                        Assets
                    </p>
                    <p className="text-xs text-white/80">{assetCount}</p>
                </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-wrap justify-end gap-2">
                <button
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <FaEdit className="w-3 h-3" />
                    Edit
                </button>
                {isInactive ? (
                    <button
                        onClick={onReactivate}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                    >
                        <FaPlay className="w-3 h-3" />
                        Activate
                    </button>
                ) : (
                    <button
                        onClick={onDeactivate}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                    >
                        <FaBan className="w-3 h-3" />
                        Deactivate
                    </button>
                )}
                <button
                    onClick={onDelete}
                    disabled={!deletable}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <FaTrash className="w-3 h-3" />
                    Delete
                </button>
            </div>
        </div>
    );
};

/* ==================================================================
   Create / Edit drawer — audit drawer theme
   ================================================================== */

const CategoryDrawer = ({ category, onClose, onSave }) => {
    const isEdit = Boolean(category);

    const [form, setForm] = useState(() => ({
        name: category?.name ?? '',
        code: category?.code ?? '',
        defaultDepreciationMethod:
            category?.defaultDepreciationMethod ?? 'STRAIGHT_LINE',
        usefulLifeYears:
            category?.usefulLifeYears != null
                ? String(category.usefulLifeYears)
                : '',
    }));

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        onSave({
            name: form.name,
            code: form.code || undefined,
            defaultDepreciationMethod: form.defaultDepreciationMethod,
            usefulLifeYears:
                form.usefulLifeYears === ''
                    ? null
                    : Number(form.usefulLifeYears),
        });
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
                {/* Header */}
                <header className="shrink-0 border-b border-white/10">
                    <div className="px-6 sm:px-8 py-5 flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1 space-y-3">
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-none">
                                {isEdit ? 'Edit Category' : 'New Category'}
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight wrap-break-words">
                                {isEdit
                                    ? category.name
                                    : 'Create an asset category'}
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

                {/* Body */}
                <form
                    onSubmit={onSubmit}
                    className="flex-1 min-h-0 flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <div className="px-6 sm:px-8 py-6 space-y-6">
                            {/* Identity */}
                            <section>
                                <SectionHeading>Identity</SectionHeading>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={onChange}
                                            placeholder="e.g. Solar Panel"
                                            autoFocus
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Code (optional — auto-derived from name)
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={form.code}
                                            onChange={onChange}
                                            placeholder="e.g. SOL"
                                            maxLength={6}
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                        <p className="text-sm text-white/50 mt-2">
                                            Used as the asset-code prefix, e.g.{' '}
                                            <span className="font-mono text-white/70">
                                                GAU-{form.code || 'XXX'}-0001
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-white/10 my-8" />

                            {/* Depreciation */}
                            <section>
                                <SectionHeading>Depreciation Defaults</SectionHeading>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Default Method
                                        </label>
                                        <select
                                            name="defaultDepreciationMethod"
                                            value={form.defaultDepreciationMethod}
                                            onChange={onChange}
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                                        >
                                            {DEPRECIATION_METHODS.map((m) => (
                                                <option key={m.code} value={m.code} className="bg-[#242424]">
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">
                                            Useful Life (years)
                                        </label>
                                        <input
                                            type="number"
                                            name="usefulLifeYears"
                                            value={form.usefulLifeYears}
                                            onChange={onChange}
                                            min={1}
                                            placeholder="e.g. 20"
                                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
                                        />
                                        <p className="text-sm text-white/50 mt-2">
                                            Leave blank for non-depreciable categories (e.g. land).
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium bg-[#173ef0] text-white hover:bg-[#0020ad] transition-colors"
                        >
                            <FaCheck className="w-4 h-4" />
                            {isEdit ? 'Save Changes' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

/* ==================================================================
   Confirm dialog — audit drawer theme
   ================================================================== */

const ConfirmDialog = ({ action, assetCount, onCancel, onConfirm }) => {
    const { type, category } = action;

    const config = {
        deactivate: {
            eyebrow: 'Deactivate Category',
            title: category.name,
            subtitle:
                'The category will be hidden from new asset registrations. Existing assets using it are unaffected.',
            confirmLabel: 'Yes, deactivate',
            confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            accentColor: 'text-yellow-400',
            accentBar: 'bg-yellow-500',
            icon: <FaBan className="w-5 h-5" />,
        },
        reactivate: {
            eyebrow: 'Reactivate Category',
            title: category.name,
            subtitle:
                'The category will become selectable again in new asset registrations.',
            confirmLabel: 'Yes, reactivate',
            confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
            accentColor: 'text-green-400',
            accentBar: 'bg-green-500',
            icon: <FaPlay className="w-5 h-5" />,
        },
        delete: {
            eyebrow: 'Delete Category',
            title: category.name,
            subtitle:
                'This permanently removes the category. It cannot be undone.',
            confirmLabel: 'Yes, delete',
            confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
            accentColor: 'text-red-400',
            accentBar: 'bg-red-500',
            icon: <FaTrash className="w-5 h-5" />,
        },
    }[type];

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-[#161616] border border-white/10 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`h-0.5 w-full ${config.accentBar}`} />

                <div className="px-6 sm:px-8 pt-8 pb-6">
                    <div className="flex justify-center mb-5">
                        <div
                            className={`w-12 h-12 flex items-center justify-center border ${
                                type === 'deactivate'
                                    ? 'border-yellow-500/30 text-yellow-400'
                                    : type === 'reactivate'
                                        ? 'border-green-500/30 text-green-400'
                                        : 'border-red-500/30 text-red-400'
                            }`}
                        >
                            {config.icon}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                            {config.eyebrow}
                        </p>
                        <h2 className="text-xl font-semibold text-white leading-snug tracking-tight">
                            {config.title}
                        </h2>
                        <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs mx-auto">
                            {config.subtitle}
                        </p>
                    </div>

                    <div className="border border-white/5 bg-white/2 divide-y divide-white/5">
                        <MetadataRow label="Code" value={category.code} mono />
                        <MetadataRow
                            label="Assets Using"
                            value={String(assetCount)}
                        />
                    </div>
                </div>

                <div className="border-t border-white/10 px-6 sm:px-8 py-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-5 py-2.5 text-sm font-medium text-white/70 border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 px-5 py-2.5 text-sm font-medium transition-colors ${config.confirmClass}`}
                    >
                        {config.confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ---------------- small sub-components ---------------- */

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mb-4">
        <span className="w-0.5 h-4 bg-[#173ef0]" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            {children}
        </h3>
    </div>
);

const MetadataRow = ({ label, value, mono = false }) => (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
            {label}
        </span>
        <span
            className={`text-sm text-white font-medium truncate ${
                mono ? 'font-mono' : ''
            }`}
        >
            {value}
        </span>
    </div>
);

export default CategoriesSection;