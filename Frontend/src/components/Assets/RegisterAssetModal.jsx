import { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useCategories } from '../Context/CategoriesContext';
import {
    MOCK_WARDS,
    DEPRECIATION_METHODS,
} from '../mock/mockAssets';

/*
  Field schema for text inputs.
  Selects are rendered explicitly below (category, ward, depreciation method)
  because they depend on the reference data.
*/
const TEXT_FIELDS = [
    { name: 'title',           label: 'Asset Title',           type: 'text',   fallback: '', required: true,  colSpan: 2 },
    { name: 'description',     label: 'Description',           type: 'text',   fallback: '', required: false, colSpan: 2 },
    { name: 'acquisitionDate', label: 'Acquisition Date',      type: 'date',   fallback: '', required: true  },
    { name: 'acquisitionCost', label: 'Acquisition Cost (NPR)', type: 'number', fallback: '', required: true },
    { name: 'usefulLifeYears', label: 'Useful Life (years)',   type: 'number', fallback: '' },
];

const buildInitialForm = () => {
    const form = {};
    for (const f of TEXT_FIELDS) form[f.name] = f.fallback;
    return form;
};

const RegisterAssetModal = ({ onClose }) => {
    const { user } = useAuth();
    const { addAsset } = useAssets();
    const { allCategories } = useCategories();

    const categories = allCategories().filter((c) => !c.deactivatedAt);

    const [form, setForm] = useState(buildInitialForm);
    const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
    const [wardId, setWardId] = useState(MOCK_WARDS[0]?.id ?? '');
    const [depreciationMethod, setDepreciationMethod] = useState('STRAIGHT_LINE');
    const [busy, setBusy] = useState(false);

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    /*
      When the user picks a category, prefill the depreciation method
      and useful life from that category's defaults. They can still
      override them afterward.
    */
    const onCategoryChange = (e) => {
        const id = e.target.value;
        setCategoryId(id);

        const cat = categories.find((c) => c.id === id);
        if (cat) {
            setDepreciationMethod(cat.defaultDepreciationMethod ?? 'STRAIGHT_LINE');
            setForm((prev) => ({
                ...prev,
                usefulLifeYears: cat.usefulLifeYears ?? '',
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        for (const field of TEXT_FIELDS) {
            if (field.required && !String(form[field.name] ?? '').trim()) {
                toast.error(`${field.label} is required`);
                return;
            }
        }

        const cost = Number(form.acquisitionCost);
        if (!Number.isFinite(cost) || cost <= 0) {
            toast.error('Acquisition cost must be a positive number');
            return;
        }

        setBusy(true);
        try {
            addAsset({
                title: form.title.trim(),
                description: form.description.trim(),
                categoryId,
                wardId,
                acquisitionDate: form.acquisitionDate,
                acquisitionCost: cost,
                depreciationMethod,
                usefulLifeYears: form.usefulLifeYears
                    ? Number(form.usefulLifeYears)
                    : null,
                createdBy: user?.username ?? 'unknown',
            });

            toast.success('Asset registered — awaiting review');
            onClose();
        } catch (err) {
            toast.error(err.message || 'Failed to register asset');
        } finally {
            setBusy(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
                className="bg-[#161616] border border-white/10 w-full max-w-2xl overflow-hidden"
                style={{
                    maxHeight: '90vh',
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                }}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Register New Asset</h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Form — scrollable middle */}
                <div className="overflow-y-auto hide-scrollbar">
                    <form onSubmit={onSubmit} id="register-asset-form" className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Text fields */}
                            {TEXT_FIELDS.map((field) => (
                                <div
                                    key={field.name}
                                    className={field.colSpan === 2 ? 'sm:col-span-2' : ''}
                                >
                                    <Field
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={form[field.name]}
                                        onChange={onChange}
                                        required={field.required}
                                        min={field.type === 'number' ? 0 : undefined}
                                    />
                                </div>
                            ))}

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={onCategoryChange}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-[#242424]">
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ward */}
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                    Ward
                                </label>
                                <select
                                    value={wardId}
                                    onChange={(e) => setWardId(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                                >
                                    {MOCK_WARDS.map((w) => (
                                        <option key={w.id} value={w.id} className="bg-[#242424]">
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Depreciation method */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                    Depreciation Method
                                </label>
                                <select
                                    value={depreciationMethod}
                                    onChange={(e) => setDepreciationMethod(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                                >
                                    {DEPRECIATION_METHODS.map((m) => (
                                        <option key={m.code} value={m.code} className="bg-[#242424]">
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Info line about review status */}
                        <p className="text-xs text-white/50 leading-relaxed">
                            Newly registered assets start as <span className="text-yellow-300 font-medium">Awaiting Review</span> and
                            become <span className="text-green-300 font-medium">Active</span> once approved.
                        </p>
                    </form>
                </div>

                {/* Footer — pinned, outside the form, submits via form="…" */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 bg-[#161616]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-white/70 font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="register-asset-form"
                        disabled={busy}
                        className="px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
                    >
                        {busy ? 'Creating…' : 'Create Asset'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* Reusable field */
const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
        />
    </div>
);

export default RegisterAssetModal;