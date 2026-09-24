import { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_MENUS } from '../mock/mockData';
import { logAuditEvent } from './AuditContext';
import { useRoles } from './RolesContext';
import { DEFAULT_ROLE_CODE } from '../mock/mockRoles';

/* Create the auth context */
const AuthContext = createContext(null);

/* localStorage key builders — one namespace per user */
const LS = {
  avatar: (u) => `mock_avatar_${u}`,
  profile: (u) => `mock_profile_${u}`,
  password: (u) => `mock_password_${u}`,
  notifications: (u) => `mock_notifications_${u}`,
  loginHistory: (u) => `mock_loginHistory_${u}`,
  extraUsers: () => `mock_extra_users`,
  pendingRegistrations: () => `mock_pending_registrations`,
  logoutBroadcast: () => `mock_logout_broadcast`,
};

const UNIVERSAL_ADMIN = {
  username: 'admin.gaurishankar',
  password: 'Admin@1234',
  user: {
    id: 'u-universal-admin',
    fullName: 'System Administrator',
    designation: 'System Administrator',
    email: 'admin@gaurishankar.gov.np',
    phone: '',
    avatar: null,
    roles: ['SYS_ADMIN'],
    permissions: [], // ← filled dynamically from RolesContext on login
    status: 'Active',
    municipality: 'Gaurishankar Rural Municipality',
    ward: '',
  },
};

const TOKEN_KEY = 'token';

const readToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};

const writeToken = (value) => {
  try { sessionStorage.setItem(TOKEN_KEY, value); } catch { /* ignore */ }
};

const clearToken = () => {
  try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

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
  } catch (err) {
    console.error('[AuthContext] localStorage write failed:', key, err);
    return false;
  }
};

const appendLoginEvent = (username, event) => {
  const key = LS.loginHistory(username);
  const existing = readJSON(key, []);

  const entry = {
    id: `lh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...event,
  };

  const next = [entry, ...existing];
  writeJSON(key, next);
  return next;
};

const mergeWithOverrides = (baseUser, username) => {
  const storedAvatar = localStorage.getItem(LS.avatar(username));
  const storedProfile = readJSON(LS.profile(username), null);

  const cleanedProfile = {};
  if (storedProfile && typeof storedProfile === 'object') {
    for (const [k, v] of Object.entries(storedProfile)) {
      if (v !== '' && v !== null && v !== undefined) {
        cleanedProfile[k] = v;
      }
    }
  }

  return {
    ...baseUser,
    ...cleanedProfile,
    ...(storedAvatar ? { avatar: storedAvatar } : {}),
  };
};

/* ============================================================
   PERMISSION LOOKUP HELPER
   Reads from mock_roles localStorage directly so it works
   inside AuthContext without depending on RolesContext hooks.
   RolesContext writes to the same key, so they stay in sync.
   ============================================================ */
const readRolesFromStorage = () => {
  const stored = readJSON('mock_roles', null);
  return Array.isArray(stored) ? stored : [];
};

const permissionsForRoleCode = (roleCode) => {
  const roles = readRolesFromStorage();
  const role = roles.find((r) => r.code === roleCode);
  return role?.permissions ?? [];
};

/* Given an array of role codes, union their permissions */
const permissionsForRoles = (roleCodes) => {
  if (!Array.isArray(roleCodes)) return [];
  const set = new Set();
  for (const code of roleCodes) {
    for (const p of permissionsForRoleCode(code)) set.add(p);
  }
  return [...set];
};

/* ============================================================
   PROVIDER
   ============================================================ */
export const AuthProvider = ({ children }) => {
  const rolesCtx = useRoles(); // for version-bumping on role edits

  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [menu, setMenu] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [extraUsers, setExtraUsers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0);

  /* ============ BOOT ============ */

  useEffect(() => {
    const storedUsers = readJSON(LS.extraUsers(), []);
    const storedPending = readJSON(LS.pendingRegistrations(), []);
    const safeUsers = Array.isArray(storedUsers) ? storedUsers : [];
    const safePending = Array.isArray(storedPending) ? storedPending : [];

    setExtraUsers(safeUsers);
    setPendingRegistrations(safePending);

    const token = readToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const username = token.replace('mock:', '');

    if (username === UNIVERSAL_ADMIN.username) {
      const base = { ...UNIVERSAL_ADMIN.user, username };
      const merged = mergeWithOverrides(base, username);
      const perms = permissionsForRoles(merged.roles);

      setUser({ ...merged, permissions: perms });
      setPermissions(perms);
      setMenu(MOCK_MENUS[merged.roles?.[0]] ?? []);
      setNotifications(readJSON(LS.notifications(username), []));
      setLoginHistory(readJSON(LS.loginHistory(username), []));
      setLoading(false);
      return;
    }

    const map = {};
    for (const entry of safeUsers) {
      if (entry?.user?.username) map[entry.user.username] = entry;
    }

    const found = map[username];

    if (found && found.user.status !== 'Inactive') {
      const base = { ...found.user, username };
      const merged = mergeWithOverrides(base, username);
      const perms = permissionsForRoles(merged.roles);

      const storedNotifs = readJSON(LS.notifications(username), []);
      const storedHistory = readJSON(LS.loginHistory(username), []);

      setUser({ ...merged, permissions: perms });
      setPermissions(perms);
      setMenu(MOCK_MENUS[merged.roles?.[0]] ?? []);
      setNotifications(storedNotifs);
      setLoginHistory(storedHistory);
    } else {
      clearToken();
    }

    setLoading(false);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* ============ RE-COMPUTE PERMISSIONS WHEN ROLES CHANGE ============ */
  /*
    When an admin edits a role's permissions on the Roles page,
    every user holding that role should pick up the change
    immediately — without a reload. We watch the RolesContext
    version and re-derive the current user's permissions.
  */
  useEffect(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const perms = permissionsForRoles(prev.roles);
      return { ...prev, permissions: perms };
    });
    setPermissions((prev) => {
      // Recompute from current user's roles (below) — but we need
      // the fresh role codes. Use the user object directly.
      // Simpler: recompute is handled by the setUser above;
      // we just also refresh `permissions` from the current user.
      return prev;
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [rolesCtx.version]);

  /* ============ CROSS-TAB SYNC ============ */

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;

      if (e.key === LS.extraUsers()) {
        const next = readJSON(LS.extraUsers(), []);
        setExtraUsers(Array.isArray(next) ? next : []);
      } else if (e.key === LS.pendingRegistrations()) {
        const next = readJSON(LS.pendingRegistrations(), []);
        setPendingRegistrations(Array.isArray(next) ? next : []);
      } else if (e.key === LS.logoutBroadcast()) {
        clearToken();
        setUser(null);
        setPermissions([]);
        setMenu([]);
        setNotifications([]);
        setLoginHistory([]);
      } else if (
        e.key.startsWith('mock_avatar_') ||
        e.key.startsWith('mock_profile_')
      ) {
        setProfileVersion((v) => v + 1);
        refreshCurrentUser();
      } else if (e.key === 'mock_roles') {
        // Roles edited in another tab — recompute permissions
        setUser((prev) => {
          if (!prev) return prev;
          const perms = permissionsForRoles(prev.roles);
          return { ...prev, permissions: perms };
        });
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* ============ HELPERS ============ */

  const refreshCurrentUser = () => {
    setUser((prev) => {
      if (!prev) return prev;
      const username = prev.username;

      if (username === UNIVERSAL_ADMIN.username) {
        const base = { ...UNIVERSAL_ADMIN.user, username };
        const merged = mergeWithOverrides(base, username);
        const perms = permissionsForRoles(merged.roles);
        return { ...merged, permissions: perms };
      }

      const users = readJSON(LS.extraUsers(), []);
      const entry = users.find((u) => u.user.username === username);
      if (!entry) return prev;

      const base = { ...entry.user, username };
      const merged = mergeWithOverrides(base, username);
      const perms = permissionsForRoles(merged.roles);
      return { ...merged, permissions: perms };
    });
  };

  const getAllUsersMap = () => {
    const map = {};
    const storedExtra = readJSON(LS.extraUsers(), []);
    const source = Array.isArray(storedExtra) ? storedExtra : extraUsers;

    for (const entry of source) {
      if (entry?.user?.username) {
        map[entry.user.username] = entry;
      }
    }
    return map;
  };

  const hydrateUser = (baseUser) => {
    const username = baseUser.username;

    const storedNotifs = readJSON(LS.notifications(username), []);
    const storedHistory = readJSON(LS.loginHistory(username), []);

    const mergedUser = mergeWithOverrides(baseUser, username);
    const perms = permissionsForRoles(mergedUser.roles);

    setUser({ ...mergedUser, permissions: perms });
    setPermissions(perms);
    setMenu(MOCK_MENUS[mergedUser.roles?.[0]] ?? []);
    setNotifications(storedNotifs);
    setLoginHistory(storedHistory);
  };

  /* ============ AUTH ACTIONS ============ */

  const login = async (typedUsername, password) => {
    if (
      typedUsername === UNIVERSAL_ADMIN.username &&
      password === UNIVERSAL_ADMIN.password
    ) {
      const updated = appendLoginEvent(typedUsername, {
        action: 'Login',
        status: 'success',
        at: new Date().toISOString(),
      });

      await new Promise((r) => setTimeout(r, 400));

      const userWithUsername = {
        ...UNIVERSAL_ADMIN.user,
        username: typedUsername,
      };

      writeToken(`mock:${typedUsername}`);
      hydrateUser(userWithUsername);
      setLoginHistory(updated);

      return userWithUsername;
    }

    const allUsersMap = getAllUsersMap();
    const found = allUsersMap[typedUsername];

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

    if (found.user.status === 'Inactive') {
      appendLoginEvent(typedUsername, {
        action: 'Login',
        status: 'blocked',
        at: new Date().toISOString(),
      });
      throw new Error(
        'Your account has been deactivated. Please contact the administrator.'
      );
    }

    const updated = appendLoginEvent(typedUsername, {
      action: 'Login',
      status: 'success',
      at: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 400));

    const userWithUsername = { ...found.user, username: typedUsername };

    writeToken(`mock:${typedUsername}`);
    hydrateUser(userWithUsername);
    setLoginHistory(updated);

    return userWithUsername;
  };

  const logout = () => {
    if (user?.username) {
      appendLoginEvent(user.username, {
        action: 'Logout',
        status: 'success',
        at: new Date().toISOString(),
      });
    }

    clearToken();
    setUser(null);
    setPermissions([]);
    setMenu([]);
    setNotifications([]);
    setLoginHistory([]);
  };

  const logoutEverywhere = () => {
    if (user?.username) {
      appendLoginEvent(user.username, {
        action: 'Logout',
        status: 'success',
        at: new Date().toISOString(),
      });
    }

    try {
      localStorage.setItem(LS.logoutBroadcast(), String(Date.now()));
    } catch { /* ignore */ }

    clearToken();
    setUser(null);
    setPermissions([]);
    setMenu([]);
    setNotifications([]);
    setLoginHistory([]);
  };

  const hasPermission = (code) => !code || permissions.includes(code);

  /* ============ NOTIFICATIONS ============ */

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

  /* ============ PROFILE ============ */

  const updateProfile = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const ok = writeJSON(LS.profile(prev.username), patch);
      if (!ok) {
        console.error('[AuthContext] Profile save failed — storage may be full.');
      }
      return next;
    });
    setProfileVersion((v) => v + 1);
  };

  const updateAvatar = (avatarDataUrl) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, avatar: avatarDataUrl };
      try {
        localStorage.setItem(LS.avatar(prev.username), avatarDataUrl);
      } catch (err) {
        console.error('[AuthContext] Avatar save failed — storage may be full.', err);
      }
      return next;
    });
    setProfileVersion((v) => v + 1);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (user?.username === UNIVERSAL_ADMIN.username) {
      throw new Error('The universal admin password cannot be changed.');
    }

    const allUsersMap = getAllUsersMap();
    const found = allUsersMap[user?.username];
    if (!found || found.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    const stored = readJSON(LS.extraUsers(), []);
    const next = stored.map((e) =>
      e.user.username === user.username ? { ...e, password: newPassword } : e
    );
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);
    return true;
  };

  /* ============ USER MANAGEMENT ============ */

  const allUsers = () => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = profileVersion;

    const map = getAllUsersMap();

    return Object.values(map).map((entry) => {
      const username = entry.user.username;
      const merged = mergeWithOverrides({ ...entry.user, username }, username);
      const perms = permissionsForRoles(merged.roles);
      return {
        id: merged.id,
        username,
        fullName: merged.fullName,
        email: merged.email,
        phone: merged.phone,
        avatar: merged.avatar ?? null,
        designation: merged.designation,
        roles: merged.roles,
        permissions: perms,
        status: merged.status ?? 'Active',
        source: 'extra',
      };
    });
  };

  const addUser = (payload) => {
    const { username, password, role, ...rest } = payload;

    const stored = readJSON(LS.extraUsers(), []);
    const takenByUser =
      username === UNIVERSAL_ADMIN.username ||
      stored.some((e) => e.user.username === username);
    if (takenByUser) throw new Error('Username already exists');

    const roleCode = role || DEFAULT_ROLE_CODE;
    const perms = permissionsForRoleCode(roleCode);

    const newUser = {
      password,
      user: {
        id: `u-${Date.now()}`,
        username,
        fullName: rest.fullName,
        designation: roleCode.replace(/_/g, ' '),
        email: rest.email,
        phone: rest.phone,
        avatar: null,
        roles: [roleCode],
        permissions: perms,
        status: 'Active',
        municipality: rest.municipality,
        ward: rest.ward,
      },
    };

    const next = [...stored, newUser];
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'CREATE',
      actor: user?.username ?? 'unknown',
      summary: `Created user @${username} (${rest.fullName}) with role ${roleCode}`,
      before: null,
      after: {
        username,
        fullName: rest.fullName,
        roles: [roleCode],
        status: 'Active',
      },
    });

    return newUser.user;
  };

  const submitRegistration = (payload) => {
    const stored = readJSON(LS.extraUsers(), []);
    const pending = readJSON(LS.pendingRegistrations(), []);

    const takenByUser =
      payload.username === UNIVERSAL_ADMIN.username ||
      stored.some((e) => e.user.username === payload.username);
    if (takenByUser) throw new Error('Username already exists');

    const alreadyPending = pending.some(
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

    const next = [record, ...pending];
    setPendingRegistrations(next);
    writeJSON(LS.pendingRegistrations(), next);

    logAuditEvent({
      entityType: 'user',
      entityId: payload.username,
      action: 'CREATE',
      actor: payload.username,
      summary: `Self-registration submitted by @${payload.username} (pending approval)`,
      before: null,
      after: {
        username: payload.username,
        fullName: payload.fullName,
        status: 'Pending',
      },
    });

    return record;
  };

  const approveRegistration = (username, role) => {
    const pending = pendingRegistrations.find((p) => p.username === username);
    if (!pending) throw new Error('Pending registration not found');

    const roleCode = role || DEFAULT_ROLE_CODE;
    const perms = permissionsForRoleCode(roleCode);

    const newUser = {
      password: pending.password,
      user: {
        id: `u-${Date.now()}`,
        username: pending.username,
        fullName: pending.fullName,
        designation: roleCode.replace(/_/g, ' '),
        email: pending.email,
        phone: pending.phone,
        avatar: null,
        roles: [roleCode],
        permissions: perms,
        status: 'Active',
        municipality: pending.municipality,
        ward: pending.ward,
      },
    };

    const stored = readJSON(LS.extraUsers(), []);
    const nextUsers = [...stored, newUser];
    setExtraUsers(nextUsers);
    writeJSON(LS.extraUsers(), nextUsers);

    const nextPending = pendingRegistrations.filter((p) => p.username !== username);
    setPendingRegistrations(nextPending);
    writeJSON(LS.pendingRegistrations(), nextPending);

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'APPROVE',
      actor: user?.username ?? 'unknown',
      summary: `Approved registration of @${username} as ${roleCode}`,
      before: { status: 'Pending' },
      after: { status: 'Active', roles: [roleCode] },
    });

    return newUser.user;
  };

  const rejectRegistration = (username) => {
    const next = pendingRegistrations.filter((p) => p.username !== username);
    setPendingRegistrations(next);
    writeJSON(LS.pendingRegistrations(), next);

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'REJECT',
      actor: user?.username ?? 'unknown',
      summary: `Rejected registration of @${username}`,
      before: { status: 'Pending' },
      after: { status: 'Rejected' },
    });
  };

  const updateUserRole = (username, newRole) => {
    const stored = readJSON(LS.extraUsers(), []);
    const existing = stored.find((e) => e.user.username === username);
    const previousRoles = existing?.user?.roles ?? [];

    const perms = permissionsForRoleCode(newRole);

    const next = stored.map((e) =>
      e.user.username === username
        ? {
          ...e,
          user: {
            ...e.user,
            roles: [newRole],
            permissions: perms,
          },
        }
        : e
    );
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);

    /* If the current user is editing their own role, refresh permissions */
    if (user?.username === username) {
      const newPerms = permissionsForRoles([newRole]);
      setUser((prev) => ({ ...prev, roles: [newRole], permissions: newPerms }));
      setPermissions(newPerms);
      setMenu(MOCK_MENUS[newRole] ?? []);
    }

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'ASSIGN',
      actor: user?.username ?? 'unknown',
      summary: `Changed role of @${username} to ${newRole}`,
      before: { roles: previousRoles },
      after: { roles: [newRole] },
    });
  };

  const updateUserStatus = (username, newStatus) => {
    const stored = readJSON(LS.extraUsers(), []);
    const existing = stored.find((e) => e.user.username === username);
    const previousStatus = existing?.user?.status ?? 'Active';

    const next = stored.map((e) =>
      e.user.username === username
        ? { ...e, user: { ...e.user, status: newStatus } }
        : e
    );
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);

    if (user?.username === username && newStatus === 'Inactive') {
      clearToken();
      setUser(null);
      setPermissions([]);
      setMenu([]);
      setNotifications([]);
      setLoginHistory([]);
    }

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'UPDATE',
      actor: user?.username ?? 'unknown',
      summary: `${newStatus === 'Inactive' ? 'Deactivated' : 'Activated'} user @${username}`,
      before: { status: previousStatus },
      after: { status: newStatus },
    });
  };

  const deleteUser = (username) => {
    const stored = readJSON(LS.extraUsers(), []);
    const existing = stored.find((e) => e.user.username === username);

    const next = stored.filter((e) => e.user.username !== username);
    setExtraUsers(next);
    writeJSON(LS.extraUsers(), next);

    if (user?.username === username) {
      clearToken();
      setUser(null);
      setPermissions([]);
      setMenu([]);
      setNotifications([]);
      setLoginHistory([]);
    }

    logAuditEvent({
      entityType: 'user',
      entityId: username,
      action: 'DELETE',
      actor: user?.username ?? 'unknown',
      summary: `Deleted user @${username}`,
      before: existing
        ? { username, fullName: existing.user.fullName, roles: existing.user.roles }
        : { username },
      after: null,
    });
  };

  const resetLocalData = (username) => {
    if (!username) return;
    localStorage.removeItem(LS.avatar(username));
    localStorage.removeItem(LS.profile(username));
    localStorage.removeItem(LS.password(username));
    localStorage.removeItem(LS.notifications(username));
    localStorage.removeItem(LS.loginHistory(username));
  };

  /* ============ PROVIDER ============ */

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        menu,
        notifications,
        loginHistory,
        loading,
        profileVersion,
        login,
        logout,
        logoutEverywhere,
        hasPermission,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        updateAvatar,
        changePassword,
        resetLocalData,
        unreadCount: notifications.filter((n) => !n.read).length,
        allUsers,
        addUser,
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