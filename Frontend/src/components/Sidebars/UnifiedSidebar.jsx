import { NavLink, useNavigate } from 'react-router-dom';
import * as Fa from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const UnifiedSidebar = () => {
    const { user, menu, logout } = useAuth();
    const navigate = useNavigate();
    const roleLabel = user?.roles?.[0]?.replace(/_/g, ' ') || 'Dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)] flex flex-col">
            <div className="sticky top-4 p-4 flex flex-col flex-1">
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Fa.FaTachometerAlt className="text-[#173ef0]" />
                        {roleLabel} Menu
                    </h3>
                </div>

                <nav className="space-y-1 px-2 flex-1">
                    {menu.map((item) => {
                        const Icon = Fa[item.icon] || Fa.FaCircle;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-[#173ef0] text-white'
                                        : 'text-white/70 hover:bg-[#173ef0] hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-4 px-2 pt-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-3 px-4 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-300 cursor-pointer"
                    >
                        <Fa.FaSignOutAlt className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnifiedSidebar;