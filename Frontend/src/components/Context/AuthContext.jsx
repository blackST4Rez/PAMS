import { createContext, useContext, useEffect, useState } from 'react';
import {
  MOCK_USERS,
  MOCK_MENUS,
  MOCK_USER_NOTIFICATIONS,
  MOCK_LOGIN_HISTORY,
} from '../mock/mockData';

/* Create the auth context */
const AuthContext = createContext(null);

/* localStorage key builders — one namespace per user */
const LS = {
  avatar: (u) => `mock_avatar_${u}`,
  profile: (u) => `mock_profile_${u}`,
  notifications: (u) => `mock_notifications_${u}`,
  loginHistory: (u) => `mock_loginHistory_${u}`,
  extraUsers: () => `mock_extra_users`,
  pendingRegistrations: () => `mock_pending_registrations`,
};

/* Safely read JSON from localStorage; return fallback on error */
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/* Safely write JSON to localStorage; ignore quota/privacy errors */
const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or private mode — ignore */
  }
};

/* Append one login-history event for a user + persist to localStorage */
const appendLoginEvent = (username, event) => {
  const key = LS.loginHistory(username);
  const existing = readJSON(key, null) ?? MOCK_LOGIN_HISTORY[username] ?? [];

  const entry = {
    id: `lh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...event,
  };

  const next = [entry, ...existing];
  writeJSON(key, next);
  return next;
};

/* Permissions per role — used when approving registrations */
const ROLE_PERMISSIONS = {
  SYS_ADMIN: [
    'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
    'asset.approve', 'asset.transfer', 'gis.view',
    'maintenance.view', 'maintenance.create',
    'valuation.view', 'valuation.edit',
    'verification.verify',
    'disposal.create', 'disposal.approve',
    'report.view', 'report.export',
    'audit.view',
    'admin.users', 'admin.roles', 'admin.config',
  ],
  ASSET_MANAGER: [
    'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
    'asset.approve', 'asset.transfer', 'gis.view',
    'maintenance.view', 'maintenance.create',
    'verification.verify',
    'disposal.create',
    'report.view', 'report.export',
  ],
  FINANCE_OFFICER: [
    'asset.view',
    'valuation.view', 'valuation.edit',
    'report.view', 'report.export',
  ],
  FIELD_OFFICER: [
    'asset.view', 'asset.create', 'asset.edit',
    'gis.view',
    'maintenance.view', 'maintenance.create',
    'verification.verify',
  ],
  AUDITOR: [
    'asset.view', 'gis.view',
    'maintenance.view',
    'valuation.view',
    'report.view', 'report.export',
    'audit.view',
  ],
  PUBLIC_USER: ['asset.view', 'gis.view'],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [menu, setMenu] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [extraUsers, setExtraUsers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load admin-created users + pending registrations once on mount */
  useEffect(() => {
    const storedUsers = readJSON(LS.extraUsers(), []);
    const storedPending = readJSON(LS.pendingRegistrations(), []);
    setExtraUsers(Array.isArray(storedUsers) ? storedUsers : []);
    setPendingRegistrations(Array.isArray(storedPending) ? storedPending : []);
  }, []);

  /* Merge seed + admin-created + (later) approved users into one map */
  const getAllUsersMap = () => {
    const map = { ...MOCK_USERS };

    for (const entry of extraUsers) {
      if (entry?.user?.username) {
        map[entry.user.username] = entry;
      }
    }
    return map;
  };

  /* On mount — restore session if a token exists */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const username = token.replace('mock:', '');
    const allUsers = getAllUsersMap();
    const found = allUsers[username];
    if (found) {
      hydrateUser({ ...found.user, username });
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [extraUsers]);

  /*
    Hydrate a user by merging base + localStorage overrides.
  */
  const hydrateUser = (baseUser) => {
    const username = baseUser.username;

    const storedAvatar = localStorage.getItem(LS.avatar(username));
    const storedProfile = readJSON(LS.profile(username), null);
    const storedNotifs = readJSON(LS.notifications(username), null);
    const storedHistory = readJSON(LS.loginHistory(username), null);

    const mergedUser = {
      ...baseUser,
      ...(storedProfile || {}),
      ...(storedAvatar ? { avatar: storedAvatar } : {}),
    };

    setUser(mergedUser);
    setPermissions(mergedUser.permissions ?? []);
    setMenu(MOCK_MENUS[mergedUser.roles?.[0]] ?? []);
    setNotifications(storedNotifs ?? MOCK_USER_NOTIFICATIONS[username] ?? []);
    setLoginHistory(storedHistory ?? MOCK_LOGIN_HISTORY[username] ?? []);
  };

  /*
    Login — validates credentials, blocks pending/inactive accounts.
  */
  const login = async (typedUsername, password) => {
    const allUsers = getAllUsersMap();
    const found = allUsers[typedUsername];

    /* Failure — only record for real accounts */
    if (!found || found.password !== password) {
      if (found) {
        appendLoginEvent(typedUsername, {
          action: 'Login',
          status: 'failed',
          at: new Date().toISOString(),
        });
      }
      throw new Error('Invalid username or password');
    }

    /* Block inactive accounts */
    if (found.user.status === 'Inactive') {
      throw new Error('Account is deactivated. Contact an administrator.');
    }

    /* Success */
    const updated = appendLoginEvent(typedUsername, {
      action: 'Login',
      status: 'success',
      at: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 400));

    const userWithUsername = { ...found.user, username: typedUsername };

    localStorage.setItem('token', `mock:${typedUsername}`);
    hydrateUser(userWithUsername);
    setLoginHistory(updated);

    return userWithUsername;
  };

  /* Logout */
  const logout = () => {
    if (user?.username) {
      appendLoginEvent(user.username, {
        action: 'Logout',
        status: 'success',
        at: new Date().toISOString(),
      });
    }

    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
    setMenu([]);
    setNotifications([]);
    setLoginHistory([]);
  };

  const hasPermission = (code) => !code || permissions.includes(code);

  /* Notifications */
  const markNotificationRead = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (user) writeJSON(LS.notifications(user.username), next);
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      if (user) writeJSON(LS.notifications(user.username), next);
      return next;
    });
  };

  /* Profile */
  const updateProfile = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(LS.profile(prev.username), patch);
      return next;
    });
  };

  /* Avatar */
  const updateAvatar = (avatarDataUrl) => {
    setUser((prev) => {
      const next = { ...prev, avatar: avatarDataUrl };
      try {
        localStorage.setItem(LS.avatar(prev.username), avatarDataUrl);
      } catch {
        /* quota exceeded */
      }
      return next;
    });
  };

  /* Password change (in-memory for seed users; persisted for extras) */
  const changePassword = async (currentPassword, newPassword) => {
    const allUsers = getAllUsersMap();
    const found = allUsers[user?.username];
    if (!found || found.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (MOCK_USERS[user.username]) {
      MOCK_USERS[user.username].password = newPassword;
    } else {
      const next = extraUsers.map((e) =>
        e.user.username === user.username ? { ...e, password: newPassword } : e
      );
      setExtraUsers(next);
      writeJSON(LS.extraUsers(), next);
    }
    return true;
  };

  /* ===== USER MANAGEMENT (admin) ===== */

  /* List all active users (seed + approved registrations) */
  const allUsers = () => {
    const seedRows = Object.entries(MOCK_USERS).map(([username, entry]) => ({
      id: entry.user.id,
      username,
      fullName: entry.user.fullName,
      email: entry.user.email,
      phone: entry.user.phone,
      avatar: entry.user.avatar,
      designation: entry.user.designation,
      roles: entry.user.roles,
      status: entry.user.status ?? 'Active',
      source: 'seed',
    }));

    const extraRows = extraUsers.map((entry) => ({
      id: entry.user.id,
      username: entry.user.username,
      fullName: entry.user.fullName,
      email: entry.user.email,
      phone: entry.user.phone,
      avatar: entry.user.avatar ?? null,
      designation: entry.user.designation,
      roles: entry.user.roles,
      status: entry.user.status ?? 'Active',
      source: 'extra',
    }));

    return [...seedRows, ...extraRows];
  };

  /*
    Submit a public self-registration — stored as "Pending",
    not yet a real user, cannot log in until approved.
  */
  const submitRegistration = (payload) => {
    /* Reject duplicate usernames against existing users + other pending requests */
    const takenByUser =
      MOCK_USERS[payload.username] ||
      extraUsers.some((e) => e.user.username === payload.username);
    if (takenByUser) throw new Error('Username already exists');

    const alreadyPending = pendingRegistrations.some(
      (p) => p.username === payload.username
    );
    if (alreadyPending) throw new Error('You already have a pending registration');

    const record = {
      id: `p-${Date.now()}`,
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      municipality: payload.municipality,
      ward: payload.ward,
      password: payload.password,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
    };

    const next = [record, ...pendingRegistrations];
    setPendingRegistrations(next);
    writeJSON(LS.pendingRegistrations(), next);
    return record;
  };

  /*
    Admin approves a pending registration — moves it into active users
    with the assigned role, and removes it from the pending list.
  */
  const approveRegistration = (username, role) => {
    const pending = pendingRegistrations.find((p) => p.username === username);
    if (!pending) throw new Error('Pending registration not found');

    const newUser = {
      password: pending.password,
      user: {
        id: `u-${Date.now()}`,
        username: pending.username,
        fullName: pending.fullName,
        designation: role.replace(/_/g, ' '),
        email: pending.email,
        phone: pending.phone,
        avatar: null,
        roles: [role],
        permissions: ROLE_PERMISSIONS[role] ?? [],
        status: 'Active',
        municipality: pending.municipality,
        ward: pending.ward,
      },
    };

    const nextUsers = [...extraUsers, newUser];
    setExtraUsers(nextUsers);
    writeJSON(LS.extraUsers(), nextUsers);

    const nextPending = pendingRegistrations.filter((p) => p.username !== username);
    setPendingRegistrations(nextPending);
    writeJSON(LS.pendingRegistrations(), nextPending);

    return newUser.user;
  };

  /* Admin rejects a pending registration */
  const rejectRegistration = (username) => {
    const next = pendingRegistrations.filter((p) => p.username !== username);
    setPendingRegistrations(next);
    writeJSON(LS.pendingRegistrations(), next);
  };

  /* Admin updates a user's role */
  const updateUserRole = (username, newRole) => {
    if (MOCK_USERS[username]) {
      MOCK_USERS[username].user.roles = [newRole];
      MOCK_USERS[username].user.permissions = ROLE_PERMISSIONS[newRole] ?? [];
      if (user?.username === username) {
        setUser((prev) => ({ ...prev, roles: [newRole] }));
        setPermissions(ROLE_PERMISSIONS[newRole] ?? []);
        setMenu(MOCK_MENUS[newRole] ?? []);
      }
      return;
    }

    const next = extraUsers.map((e) =>
      e.user.username === username
        ? {
            ...e,
            user: {
              ...e.user,
              roles: [newRole],
              permissions: ROLE_PERMISSIONS[newRole] ?? [],
            },
          }
        : e
    );
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);
  };

  /* Admin toggles Active / Inactive */
  const updateUserStatus = (username, newStatus) => {
    if (MOCK_USERS[username]) {
      MOCK_USERS[username].user.status = newStatus;
      return;
    }
    const next = extraUsers.map((e) =>
      e.user.username === username
        ? { ...e, user: { ...e.user, status: newStatus } }
        : e
    );
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);
  };

  /* Admin deletes an admin-created user (seed users are protected) */
  const deleteUser = (username) => {
    if (MOCK_USERS[username]) throw new Error('Cannot delete seed users');
    const next = extraUsers.filter((e) => e.user.username !== username);
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);
  };

  /* Dev utility — wipe all local data for a user */
  const resetLocalData = (username) => {
    if (!username) return;
    localStorage.removeItem(LS.avatar(username));
    localStorage.removeItem(LS.profile(username));
    localStorage.removeItem(LS.notifications(username));
    localStorage.removeItem(LS.loginHistory(username));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        menu,
        notifications,
        loginHistory,
        loading,
        login,
        logout,
        hasPermission,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        updateAvatar,
        changePassword,
        resetLocalData,
        unreadCount: notifications.filter((n) => !n.read).length,

        /* User management */
        allUsers,
        pendingRegistrations,
        submitRegistration,
        approveRegistration,
        rejectRegistration,
        updateUserRole,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};