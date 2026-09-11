import { NavLink } from 'react-router-dom';
import * as Fa from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const UnifiedSidebar = () => {
    const { user, menu } = useAuth();
    const roleLabel = user?.roles?.[0]?.replace('_', ' ') || 'Dashboard';

    return (
        <div className="lg:w-72 shrink-0 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-100px)]">
            <div className="sticky top-4 p-4">
                <div className="mb-4 px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Fa.FaTachometerAlt className="text-[#173ef0]" />
                        {roleLabel} Menu
                    </h3>
                </div>
                <nav className="space-y-1 px-2">
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
            </div>
        </div>
    );
};

export default UnifiedSidebar;