import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UiContext = createContext(null);

export const UiProvider = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    /* Close the drawer whenever the route changes */
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    /* Lock body scroll while the drawer is open */
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

    return (
        <UiContext.Provider
            value={{ mobileMenuOpen, openMenu, closeMenu, toggleMenu }}
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