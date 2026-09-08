import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import { useNotifications } from './Context/NotificationContext';
import { 
  BiGridAlt, BiPackage, BiWrench, BiDollar, BiCheckCircle, 
  BiBell, BiFile, BiHistory, BiUser, BiCog,
  BiLogOut, BiMenu, BiChevronDown, BiLockAlt,
  BiCalendar, BiTrendingUp, BiBarChartAlt,
  BiBuilding, BiRefresh, BiDownload, BiPlus
} from 'react-icons/bi';
import toast from 'react-hot-toast';

const Layout = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50/80">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        currentPath={location.pathname}
        navigate={navigate}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user}
          unreadCount={unreadCount}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
          navigate={navigate}
          currentPath={location.pathname}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  expandedMenus,
  setExpandedMenus,
  currentPath,
  navigate,
  user 
}) => {
  const { hasPermission } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: BiGridAlt,
      permission: null,
    },
    {
      label: 'Assets',
      path: '/assets',
      icon: BiPackage,
      permission: 'asset.view',
      children: [
        { label: 'All Assets', path: '/assets' },
        { label: 'Create New', path: '/assets/create', permission: 'asset.create' },
        { label: 'Categories', path: '/categories', permission: 'admin.config' },
      ],
    },
    {
      label: 'Maintenance',
      path: '/maintenance',
      icon: BiWrench,
      permission: 'maintenance.view',
    },
    {
      label: 'Valuation',
      path: '/valuation',
      icon: BiDollar,
      permission: 'valuation.view',
    },
    {
      label: 'Approvals',
      path: '/approvals',
      icon: BiCheckCircle,
      permission: null,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: BiBarChartAlt,
      permission: 'report.view',
      children: [
        { label: 'Asset Register', path: '/reports/asset-register' },
        { label: 'Ward Wise', path: '/reports/ward-wise' },
        { label: 'Depreciation', path: '/reports/depreciation' },
        { label: 'Maintenance Cost', path: '/reports/maintenance-cost' },
      ],
    },
    {
      label: 'Audit Trails',
      path: '/audit-trails',
      icon: BiHistory,
      permission: 'audit.view',
    },
    {
      label: 'Administration',
      path: '/admin',
      icon: BiCog,
      permission: 'admin.users',
      children: [
        { label: 'Users', path: '/users', permission: 'admin.users' },
        { label: 'Roles', path: '/roles', permission: 'admin.roles' },
      ],
    },
  ];

  const hasMenuPermission = (item) => {
    if (!item.permission) return true;
    if (user?.roles?.some(r => r.code === 'SYS_ADMIN')) return true;
    return hasPermission(item.permission);
  };

  const toggleMenu = (path) => {
    setExpandedMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const isActive = (path) => {
    if (path === '/assets' && currentPath.startsWith('/assets')) return true;
    if (path === '/reports' && currentPath.startsWith('/reports')) return true;
    if (path === '/admin' && currentPath.startsWith('/admin')) return true;
    return currentPath === path;
  };

  const filteredItems = menuItems.filter(item => hasMenuPermission(item));

  const sidebarContent = (
    <nav className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            P
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">PMS</h1>
              <p className="text-xs text-gray-500">Asset Management</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <BiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.some(c => hasMenuPermission(c));
            const isExpanded = expandedMenus[item.path];
            const isActiveRoute = isActive(item.path);
            
            return (
              <div key={item.path}>
                {!hasChildren ? (
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActiveRoute 
                        ? 'bg-indigo-50 text-indigo-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActiveRoute ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    {isActiveRoute && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-6 rounded-full bg-indigo-600"></div>
                    )}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        isActiveRoute 
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActiveRoute ? 'text-indigo-600' : 'text-gray-400'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm flex-1 text-left">{item.label}</span>
                          <BiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    
                    {!isCollapsed && isExpanded && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.children.filter(c => hasMenuPermission(c)).map((child) => (
                          <button
                            key={child.path}
                            onClick={() => {
                              navigate(child.path);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              currentPath === child.path
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Info at Bottom */}
      {!isCollapsed && user && (
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
              {user.fullName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.roles?.[0]?.code || 'User'}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  if (isMobileMenuOpen) {
    return (
      <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden animate-slide-in">
        {sidebarContent}
      </div>
    );
  }

  return (
    <div className={`hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 shrink-0`}>
      {sidebarContent}
    </div>
  );
};

// Header Component
const Header = ({ 
  user, 
  unreadCount, 
  isUserMenuOpen, 
  setIsUserMenuOpen,
  setIsMobileMenuOpen,
  handleLogout,
  navigate,
  currentPath 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = currentPath.split('/')[1] || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <BiMenu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <button 
              onClick={() => navigate('/assets/create')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-500/30"
            >
              <BiPlus className="w-4 h-4" />
              New Asset
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <BiRefresh className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <BiDownload className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <BiBell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-indigo-500/30">
                {user?.fullName?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.fullName?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.roles?.[0]?.code || 'User'}</p>
              </div>
              <BiChevronDown className="hidden sm:block w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email || user?.username}</p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                >
                  <BiUser className="w-4 h-4 text-gray-500" />
                  <span>My Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    navigate('/profile/change-password');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                >
                  <BiLockAlt className="w-4 h-4 text-gray-500" />
                  <span>Change Password</span>
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-600"
                >
                  <BiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Layout;