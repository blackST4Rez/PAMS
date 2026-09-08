import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setPermissions(userData.permissions || []);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Mock login - in production, this would call the API
            const mockUsers = {
                'prem.thapa': {
                    id: '1',
                    username: 'prem.thapa',
                    fullName: 'Prem Thapa',
                    email: 'prem.thapa@municipality.gov.np',
                    roles: [{ id: '1', code: 'SYS_ADMIN', name: 'System Admin' }],
                    permissions: ['*'],
                },
                'sita.devkota': {
                    id: '2',
                    username: 'sita.devkota',
                    fullName: 'Sita Devkota',
                    email: 'sita.devkota@municipality.gov.np',
                    roles: [{ id: '2', code: 'ASSET_MANAGER', name: 'Asset Manager' }],
                    permissions: [
                        'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
                        'asset.approve', 'asset.transfer', 'gis.view', 'maintenance.view',
                        'maintenance.create', 'valuation.view', 'verification.verify',
                        'disposal.create', 'report.view', 'report.export'
                    ],
                },
                'narayan.kafle': {
                    id: '3',
                    username: 'narayan.kafle',
                    fullName: 'Narayan Kafle',
                    email: 'narayan.kafle@municipality.gov.np',
                    roles: [{ id: '3', code: 'FINANCE_OFFICER', name: 'Finance Officer' }],
                    permissions: [
                        'asset.view', 'valuation.view', 'valuation.edit',
                        'report.view', 'report.export'
                    ],
                },
                'ram.basnet': {
                    id: '4',
                    username: 'ram.basnet',
                    fullName: 'Ram Basnet',
                    email: 'ram.basnet@municipality.gov.np',
                    roles: [{ id: '4', code: 'FIELD_OFFICER', name: 'Field Officer' }],
                    permissions: [
                        'asset.view', 'asset.create', 'asset.edit', 'gis.view',
                        'maintenance.view', 'maintenance.create', 'verification.verify'
                    ],
                },
                'saraswoti.l': {
                    id: '5',
                    username: 'saraswoti.l',
                    fullName: 'Saraswoti L',
                    email: 'saraswoti.l@municipality.gov.np',
                    roles: [{ id: '5', code: 'AUDITOR', name: 'Auditor' }],
                    permissions: [
                        'asset.view', 'gis.view', 'maintenance.view', 'valuation.view',
                        'report.view', 'report.export', 'audit.view'
                    ],
                },
            };

            const userData = mockUsers[username];
            if (!userData || password !== 'ChangeMe123!') {
                throw new Error('Invalid credentials');
            }

            // Store user data
            localStorage.setItem('accessToken', 'mock-token-' + Date.now());
            localStorage.setItem('refreshToken', 'mock-refresh-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setPermissions(userData.permissions || []);
            setIsAuthenticated(true);

            toast.success(`Welcome back, ${userData.fullName}!`);
            return userData;
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            // In production, call logout API
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setPermissions([]);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const hasPermission = (permission) => {
        if (!permission) return true;
        if (user?.roles?.some(r => r.code === 'SYS_ADMIN')) return true;
        if (permissions.includes('*')) return true;
        return permissions.includes(permission);
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        loading,
        permissions,
        login,
        logout,
        hasPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};