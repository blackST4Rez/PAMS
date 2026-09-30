// src/components/Context/notifications.js
//
// Standalone notification writer/reader. Any context can import
// from this module — no React dependency, no provider required.
// Same pattern as logAuditEvent in AuditContext.jsx.

const LS = {
    notifications: (u) => `mock_notifications_${u}`,
};

const MAX_PER_USER = 100;

const readJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

/*
  Resolve a username to a known user record.
  Returns { username, fullName, email } or null.

  We check:
    • The universal admin (hardcoded)
    • The mock_extra_users list

  Unknown usernames are silently ignored — we never write
  notifications for users that don't exist.
*/
const resolveUser = (identifier) => {
    if (!identifier) return null;

    const UNIVERSAL_ADMIN_USERNAME = 'admin.gaurishankar';
    if (identifier === UNIVERSAL_ADMIN_USERNAME) {
        return { username: UNIVERSAL_ADMIN_USERNAME };
    }

    const users = readJSON('mock_extra_users', []);
    if (Array.isArray(users)) {
        for (const entry of users) {
            if (entry?.user?.username === identifier) {
                return { username: entry.user.username };
            }
        }
    }

    return null;
};

/*
  Read all notifications for a user. Returns an array
  (possibly empty). Never throws.
*/
export const readNotifications = (username) => {
    if (!username) return [];
    const stored = readJSON(LS.notifications(username), []);
    return Array.isArray(stored) ? stored : [];
};

/*
  Push a notification for a target user.

  payload:
    {
      title: string,       // required
      body?: string,       // optional
      type?: string,       // 'info' | 'success' | 'warning' | 'error' — default 'info'
    }

  Returns the new entry, or null if the write was skipped.

  Behavior:
    • Always writes to localStorage under the target's key.
    • Silently ignores unknown usernames.
    • Silently ignores payloads without a title.
    • Caps at MAX_PER_USER (100) most recent per user.
    • Dispatches a window event so listeners (e.g. AuthContext)
      can refresh their in-memory copy immediately.
    • Never throws — notifications are best-effort.
*/
export const pushNotification = (username, payload = {}) => {
    try {
        const target = resolveUser(username);
        if (!target) return null;
        if (!payload || !payload.title) return null;

        const entry = {
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: String(payload.title),
            body: payload.body ? String(payload.body) : '',
            type: payload.type ?? 'info',
            read: false,
            createdAt: new Date().toISOString(),
        };

        const key = LS.notifications(target.username);
        const existing = readNotifications(target.username);
        const next = [entry, ...existing].slice(0, MAX_PER_USER);

        writeJSON(key, next);

        /* Fire a custom event so AuthContext can update its state
           without polling. Only fires in the same tab — cross-tab
           is handled by the storage event. */
        try {
            window.dispatchEvent(
                new CustomEvent('notifications:new', {
                    detail: { username: target.username, entry },
                })
            );
        } catch {
            /* ignore — non-browser env */
        }

        return entry;
    } catch {
        /* swallow — notifications must never break the caller */
        return null;
    }
};

/*
  Mark a single notification as read. Writes back to localStorage.
*/
export const markNotificationRead = (username, id) => {
    if (!username || !id) return;
    const existing = readNotifications(username);
    const next = existing.map((n) =>
        n.id === id ? { ...n, read: true } : n
    );
    writeJSON(LS.notifications(username), next);

    try {
        window.dispatchEvent(
            new CustomEvent('notifications:changed', {
                detail: { username },
            })
        );
    } catch {
        /* ignore */
    }
};

/*
  Mark every notification as read for a user.
*/
export const markAllNotificationsRead = (username) => {
    if (!username) return;
    const existing = readNotifications(username);
    const next = existing.map((n) => ({ ...n, read: true }));
    writeJSON(LS.notifications(username), next);

    try {
        window.dispatchEvent(
            new CustomEvent('notifications:changed', {
                detail: { username },
            })
        );
    } catch {
        /* ignore */
    }
};

/*
  Clear all notifications for a user (used for reset / debug).
*/
export const clearNotifications = (username) => {
    if (!username) return;
    writeJSON(LS.notifications(username), []);
};