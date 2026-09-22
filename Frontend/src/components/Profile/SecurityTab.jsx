import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';

const SecurityTab = () => {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (next.length < 8) {
      return toast.error('New password must be at least 8 characters.');
    }
    if (next !== confirm) {
      return toast.error('New passwords do not match.');
    }

    setBusy(true);
    try {
      await changePassword(current, next);
      toast.success('Password changed successfully');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl p-6 max-w-xl">
      <h2 className="text-lg font-semibold text-white mb-4 border-l-5 border-l-[#173ef0] px-6">Change Password</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField label="Current Password"     value={current} onChange={(e) => setCurrent(e.target.value)} />
        <PasswordField label="New Password"         value={next}    onChange={(e) => setNext(e.target.value)} />
        <PasswordField label="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 bg-[#173ef0] text-white font-medium hover:bg-[#0020ad] disabled:opacity-50 transition-colors"
        >
          {busy ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-white mb-2">Two-Factor Authentication</h3>
        <p className="text-xs text-white/50 mb-3">
          Email OTP 2FA is available on your account. You can enable it here.
        </p>
        <button className="px-4 py-2 border border-white/20 text-white text-sm hover:bg-white/5">
          Enable 2FA
        </button>
      </div>
    </div>
  );
};

const PasswordField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    <input
      {...props}
      type="password"
      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173ef0]"
    />
  </div>
);

export default SecurityTab;