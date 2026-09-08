import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNotifications } from '../Context/NotificationContext';
import { Link } from 'react-router-dom';
import {
    BiPackage, BiWrench, BiDollar, BiCheckCircle,
    BiBell, BiHistory, BiTrendingUp, BiTrendingDown,
    BiCalendar, BiBuilding, BiClipboard, BiTime, BiRefresh,
    BiRightArrowAlt, BiPlus, BiDownload, BiFilterAlt,
    BiGridAlt, BiUser
} from 'react-icons/bi';

const Dashboard = () => {
    const { user } = useAuth();
    const { unreadCount } = useNotifications();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssets: 0,
        activeAssets: 0,
        pendingApprovals: 0,
        totalValue: 0,
        maintenanceDue: 0,
        verifiedAssets: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setStats({
                totalAssets: 1256,
                activeAssets: 1142,
                pendingApprovals: 12,
                totalValue: 48500000,
                maintenanceDue: 23,
                verifiedAssets: 892,
            });

            setRecentActivity([
                {
                    id: 1,
                    action: 'New Asset Registered',
                    asset: 'Municipal Office Building',
                    user: 'Ram Basnet',
                    time: '2 hours ago',
                    status: 'approved',
                    icon: BiPackage,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                },
                {
                    id: 2,
                    action: 'Maintenance Completed',
                    asset: 'School Bus #5',
                    user: 'Sita Devkota',
                    time: '5 hours ago',
                    status: 'completed',
                    icon: BiWrench,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                },
                {
                    id: 3,
                    action: 'Depreciation Run',
                    asset: 'All Assets',
                    user: 'Narayan Kafle',
                    time: '1 day ago',
                    status: 'completed',
                    icon: BiDollar,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                },
                {
                    id: 4,
                    action: 'Disposal Requested',
                    asset: 'Old Generator Set',
                    user: 'Sita Devkota',
                    time: '2 days ago',
                    status: 'pending',
                    icon: BiHistory,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                },
                {
                    id: 5,
                    action: 'Asset Transfer',
                    asset: 'Computer Lab - Ward 5 to 7',
                    user: 'Ram Basnet',
                    time: '3 days ago',
                    status: 'approved',
                    icon: BiBuilding,
                    color: 'text-indigo-600',
                    bgColor: 'bg-indigo-100',
                },
            ]);

            setUpcomingMaintenance([
                { id: 1, asset: 'School Bus #3', dueDate: '2026-09-15', type: 'Oil Change', priority: 'high' },
                { id: 2, asset: 'Generator Set', dueDate: '2026-09-18', type: 'Annual Service', priority: 'medium' },
                { id: 3, asset: 'Office Building', dueDate: '2026-09-20', type: 'HVAC Maintenance', priority: 'low' },
                { id: 4, asset: 'Fire Extinguishers', dueDate: '2026-09-22', type: 'Inspection', priority: 'medium' },
            ]);

            setLoading(false);
        }, 800);
    }, []);

    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `Rs. ${(amount / 10000000).toFixed(1)} Cr`;
        }
        if (amount >= 100000) {
            return `Rs. ${(amount / 100000).toFixed(1)} Lakh`;
        }
        return `Rs. ${amount.toLocaleString()}`;
    };

    const getPriorityBadge = (priority) => {
        const configs = {
            high: { color: 'bg-red-100 text-red-700', label: 'High' },
            medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
            low: { color: 'bg-green-100 text-green-700', label: 'Low' },
        };
        const config = configs[priority] || configs.medium;
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
    };

    const getStatusBadge = (status) => {
        const configs = {
            approved: { color: 'bg-green-100 text-green-700', label: 'Approved' },
            completed: { color: 'bg-blue-100 text-blue-700', label: 'Completed' },
            pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
            rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
        };
        const config = configs[status] || configs.pending;
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header - Larger */}
            <div className="bg-linear-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</h1>
                        <p className="text-indigo-100 mt-2 text-lg">Here's what's happening with your assets today</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-xl">
                            <BiBell className="w-5 h-5" />
                            <span className="text-sm font-medium">{unreadCount} notifications</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-xl">
                            <BiCalendar className="w-5 h-5" />
                            <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                            <BiRefresh className="w-5 h-5" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Larger cards with more spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Assets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAssets.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">+12%</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <BiPackage className="w-7 h-7 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Assets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeAssets.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">+8%</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-2xl">
                            <BiCheckCircle className="w-7 h-7 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-yellow-600">+3</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-2xl">
                            <BiTime className="w-7 h-7 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Maintenance Due</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.maintenanceDue}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-orange-600">+5</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-2xl">
                            <BiWrench className="w-7 h-7 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Value</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalValue)}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">+5.2%</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <BiDollar className="w-7 h-7 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Verified Assets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.verifiedAssets.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <BiTrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600">+15%</span>
                                <span className="text-xs text-gray-400 ml-1">vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <BiClipboard className="w-7 h-7 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - More spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity - Takes 2/3 of the space */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                            <p className="text-sm text-gray-500 mt-1">Latest actions across the system</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
                                <BiFilterAlt className="w-5 h-5" />
                            </button>
                            <Link to="/audit-trails" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
                                View All
                                <BiRightArrowAlt className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <div className={`p-3 rounded-xl ${activity.bgColor} shrink-0`}>
                                        <Icon className={`w-6 h-6 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-base font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">{activity.asset}</p>
                                            </div>
                                            {getStatusBadge(activity.status)}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                            <span>{activity.user}</span>
                                            <span>•</span>
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar - More spacing */}
                <div className="space-y-8">
                    {/* Upcoming Maintenance */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Maintenance</h2>
                                <p className="text-sm text-gray-500 mt-1">Due in next 7 days</p>
                            </div>
                            <Link to="/maintenance" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {upcomingMaintenance.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.asset}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">{item.type}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">{new Date(item.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {getPriorityBadge(item.priority)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-linear-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-100 p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/assets/create"
                                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200 hover:border-indigo-200"
                            >
                                <BiPlus className="w-5 h-5 text-indigo-500" />
                                New Asset
                            </Link>
                            <Link
                                to="/maintenance"
                                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200 hover:border-indigo-200"
                            >
                                <BiWrench className="w-5 h-5 text-indigo-500" />
                                Maintenance
                            </Link>
                            <Link
                                to="/valuation"
                                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200 hover:border-indigo-200"
                            >
                                <BiDollar className="w-5 h-5 text-indigo-500" />
                                Depreciation
                            </Link>
                            <Link
                                to="/reports"
                                className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200 hover:border-indigo-200"
                            >
                                <BiDownload className="w-5 h-5 text-indigo-500" />
                                Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;