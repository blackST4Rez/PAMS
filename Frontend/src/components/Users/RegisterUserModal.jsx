import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

/*
  Field schema — the modal's input fields.
  Add a field here and it renders + submits automatically.
*/
const USER_FIELDS = [
    { name: 'fullName', label: 'Full Name', type: 'text', fallback: '', required: true },
    { name: 'username', label: 'Username', type: 'text', fallback: '', required: true },
    { name: 'email', label: 'Email', type: 'email', fallback: '', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', fallback: '' },
    { name: 'password', label: 'Password', type: 'password', fallback: 'ChangeMe123!', required: true },
    { name: 'municipality', label: 'Municipality', type: 'text', fallback: 'Gaurishankar Rural Municipality' },
    { name: 'ward', label: 'Ward', type: 'text', fallback: '' },
];

/*
  Role options for the dropdown — matches ROLE_PERMISSIONS in AuthContext.
*/
const ROLE_OPTIONS = [
    { code: 'SYS_ADMIN', label: 'System Admin' },
    { code: 'ASSET_MANAGER', label: 'Asset Manager' },
    { code: 'FINANCE_OFFICER', label: 'Finance Officer' },
    { code: 'FIELD_OFFICER', label: 'Field Officer' },
    { code: 'AUDITOR', label: 'Auditor' },
    { code: 'PUBLIC_USER', label: 'Public User' },
];

const buildInitialForm = () =>
    Object.fromEntries(USER_FIELDS.map((f) => [f.name, f.fallback]));

const RegisterUserModal = ({ onClose }) => {
    const { addUser } = useAuth();
    const [form, setForm] = useState(buildInitialForm);
    const [role, setRole] = useState('PUBLIC_USER');
    const [busy, setBusy] = useState(false);

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();

        /* Validate required fields */
        for (const field of USER_FIELDS) {
            if (field.required && !form[field.name]?.trim()) {
                toast.error(`${field.label} is required`);
                return;
            }
        }

        setBusy(true);
        try {
            addUser({ ...form, role });
            toast.success('User registered successfully');
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#242424] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Register New User</h2>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {USER_FIELDS.map((field) => (
                            <Field
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={form[field.name]}
                                onChange={onChange}
                                required={field.required}
                            />
                        ))}

                        {/* Role selector */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] appearance-none cursor-pointer"
                            >
                                {ROLE_OPTIONS.map((opt) => (
                                    <option key={opt.code} value={opt.code} className="bg-[#242424]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            {busy ? 'Creating…' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* Reusable field — same pattern as the profile form */
const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
        />
    </div>
);

export default RegisterUserModal;