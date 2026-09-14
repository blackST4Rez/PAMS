import { FaEnvelopeOpen, FaCheck } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const NotificationsTab = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useAuth();

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-4 border-l-5 border-l-[#173ef0] px-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <FaCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-white/50 text-sm py-8 text-center">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3 p-3.5 rounded-lg cursor-pointer transition-colors ${
                n.read ? 'bg-white/5' : 'bg-[#173ef0]/10 border border-[#173ef0]/30'
              } hover:bg-white/10`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-white/30' : 'bg-[#173ef0]'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="text-xs text-white/60 mt-0.5">{n.body}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(n.createdAt).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                  }}
                  className="text-white/40 hover:text-[#173ef0] shrink-0 p-1.5 rounded-md hover:bg-white/5 transition-colors"
                  title="Mark as read"
                  aria-label="Mark as read"
                >
                  <FaEnvelopeOpen className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;