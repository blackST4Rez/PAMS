import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

/*
  Status schema — maps a status key to its icon, color, and label.
  Edit here to add/remove statuses.
*/
const STATUS_SCHEMA = {
  success: { label: 'Success', Icon: FaCheckCircle, color: 'text-green-400' },
  failed: { label: 'Failed', Icon: FaTimesCircle, color: 'text-red-400' },
};

/*
  Action schema — maps an action key to its label.
  Edit here to add/remove actions (e.g. "Password Change").
*/
const ACTION_SCHEMA = {
  Login: { label: 'Login' },
  Logout: { label: 'Logout' },
};

/*
  Date format options — single place to change how timestamps render.
  Includes seconds for precise login/logout timestamps.
*/
const DATE_FORMAT = {
  locale: 'en-GB',
  options: {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
};

/* Normalize an entry from either the new schema or the legacy seed shape */
const normalizeEntry = (entry) => ({
  id: entry.id,
  action: entry.action ?? 'Login',
  status: entry.status ?? (entry.successful ? 'success' : 'failed'),
  at: entry.at ?? entry.loginAt,
});

/* Format an ISO date string per DATE_FORMAT config */
const formatTime = (iso) =>
  new Date(iso)
    .toLocaleString(DATE_FORMAT.locale, DATE_FORMAT.options)
    .replace(/\s?(am|pm)$/i, (m) => m.toUpperCase());

const LoginHistoryTab = () => {
  const { loginHistory } = useAuth();

  /* Normalize + sort newest-first */
  const rows = [...loginHistory]
    .map(normalizeEntry)
    .sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <div className="rounded-xl p-6 max-w-6xl">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-l-5 border-l-[#173ef0] px-6">
        Log In History
        <span className='italic text-sm font-light text-gray-500'>* Scrollable *</span>
      </h2>

      {rows.length === 0 ? (
        <p className="text-white/50 text-sm py-12 text-center">No login history yet.</p>
      ) : (
        <div className="overflow-y-auto max-h-96 hide-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-2 px-4">
                  Action
                </th>
                <th className="text-left text-xs font-semibold text-white/60 uppercase tracking-wider pb-2 px-4 w-32">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-white/60 uppercase tracking-wider pb-2 px-4">
                  Date &amp; Time
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ id, action, status, at }) => {
                const {
                  label: statusLabel,
                  Icon: StatusIcon,
                  color,
                } = STATUS_SCHEMA[status] ?? STATUS_SCHEMA.failed;

                const { label: actionLabel } = ACTION_SCHEMA[action] ?? ACTION_SCHEMA.Login;

                return (
                  <tr key={id} className="border-b border-b-[#434343]">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-white">
                        {actionLabel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-2 text-sm font-medium ${color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusLabel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sm text-white text-right">
                      {formatTime(at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoginHistoryTab;