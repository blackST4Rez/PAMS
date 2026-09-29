import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UiContext = createContext(null);

const LS_KEY = 'ui_sidebar_collapsed';

const readCollapsed = () => {
    try {
        return localStorage.getItem(LS_KEY) === 'true';
    } catch {
        return false;
    }
};

const writeCollapsed = (value) => {
    try {
        localStorage.setItem(LS_KEY, String(value));
    } catch {
        /* ignore quota / private mode */
    }
};

export const UiProvider = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsedState] = useState(readCollapsed);
    const location = useLocation();

    /* Close the mobile drawer whenever the route changes */
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    /* Lock body scroll while the mobile drawer is open */
    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const openMenu = () => setMobileMenuOpen(true);
    const closeMenu = () => setMobileMenuOpen(false);
    const toggleMenu = () => setMobileMenuOpen((v) => !v);

    const setSidebarCollapsed = (value) => {
        setSidebarCollapsedState(value);
        writeCollapsed(value);
    };
    const toggleSidebar = () =>
        setSidebarCollapsedState((v) => {
            const next = !v;
            writeCollapsed(next);
            return next;
        });

    return (
        <UiContext.Provider
            value={{
                mobileMenuOpen,
                openMenu,
                closeMenu,
                toggleMenu,
                sidebarCollapsed,
                setSidebarCollapsed,
                toggleSidebar,
            }}
        >
            {children}
        </UiContext.Provider>
    );
};

export const useUi = () => {
    const ctx = useContext(UiContext);
    if (!ctx) throw new Error('useUi must be used inside <UiProvider>');
    return ctx;
};