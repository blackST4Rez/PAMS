import { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_USERS, MOCK_MENUS } from '../mock/mockData';

const AuthContext = createContext(null);

// 🔧 Flip this to false when your real backend is up
const USE_MOCK = true;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        if (USE_MOCK) {
            // Token format when mock: "mock:<username>"
            const username = token.replace('mock:', '');
            const found = MOCK_USERS[username];
            if (found) {
                setUser(found.user);
                setPermissions(found.user.permissions);
                setMenu(MOCK_MENUS[found.user.roles[0]] ?? []);
            } else {
                localStorage.removeItem('token');
            }
            setLoading(false);
        } else {
            fetchMe(token);
        }
    }, []);

    const fetchMe = async (token) => {
        try {
            const [meRes, menuRes] = await Promise.all([
                fetch(`${API_BASE}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE}/menus/me`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const meJson = await meRes.json();
            const menuJson = await menuRes.json();
            const me = meJson.data ?? meJson;
            setUser(me);
            setPermissions(me.permissions ?? []);
            setMenu(menuJson.data ?? []);
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
            setPermissions([]);
            setMenu([]);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        if (USE_MOCK) {
            const found = MOCK_USERS[username];
            if (!found || found.password !== password) {
                throw new Error('Invalid username or password');
            }
            await new Promise((r) => setTimeout(r, 400)); // simulate network
            localStorage.setItem('token', `mock:${username}`);
            setUser(found.user);
            setPermissions(found.user.permissions);
            setMenu(MOCK_MENUS[found.user.roles[0]] ?? []);
            return found.user;
        }

        // Real backend path
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Invalid credentials');
        const json = await res.json();
        const data = json.data ?? json;
        const token = data.accessToken ?? data.token;
        localStorage.setItem('token', token);
        await fetchMe(token);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setPermissions([]);
        setMenu([]);
    };

    const hasPermission = (code) => {
        if (!code) return true;
        return permissions.includes(code);
    };

    return (
        <AuthContext.Provider
            value={{ user, permissions, menu, loading, login, logout, hasPermission, USE_MOCK }}
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