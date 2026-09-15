import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

/*
  Field schema — single source of truth for the form structure.
  To add/remove/reorder a field, edit this array only.
  - name     → key used in form state + sent to updateProfile()
  - label    → visible label above the input
  - type     → input type (text, email, tel, etc.)
  - fallback → default when user has no value yet
  - disabled → optional, locks the field (e.g. Username, Municipality)
*/
const PROFILE_FIELDS = [
  { name: 'fullName',     label: 'Full Name',    type: 'text',  fallback: '', disabled: true },
  { name: 'username',     label: 'Username',     type: 'text',  fallback: '', disabled: true },
  { name: 'email',        label: 'Email',        type: 'email', fallback: '', disabled: true },
  { name: 'phone',        label: 'Phone',        type: 'tel',   fallback: '+977-98XXXXXXXX' },
  { name: 'municipality', label: 'Municipality', type: 'text',  fallback: 'Gaurishankar Rural Municipality', disabled: true },
  { name: 'ward',         label: 'Ward',         type: 'text',  fallback: 'Ward 3' },
];

/*
  Build initial form state from the schema + current user.
  For each field: prefer user value, else use the schema fallback.
*/
const buildFormFromSchema = (fields, user) => {
  const form = {};
  for (const f of fields) {
    form[f.name] = user?.[f.name] ?? f.fallback;
  }
  return form;
};

const ProfileDetailsTab = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(() => buildFormFromSchema(PROFILE_FIELDS, user));

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4 border-l-5 border-l-[#173ef0] px-6">
        Personal Information
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILE_FIELDS.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={form[field.name] ?? ''}
              onChange={onChange}
              disabled={field.disabled}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

/*
  Presentational field component.
  Pure — receives everything via props, no internal state.
*/
const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0] disabled:opacity-60"
    />
  </div>
);

export default ProfileDetailsTab;