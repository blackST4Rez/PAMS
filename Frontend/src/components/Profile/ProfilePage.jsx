import { useState } from 'react';
import { FaUserCircle, FaBell, FaLock, FaHistory } from 'react-icons/fa';
import Header from '../Common/Header';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileDetailsTab from './ProfileDetailsTab';
import NotificationsTab from './NotificationsTab';
import LoginHistoryTab from './LoginHistoryTab';
import SecurityTab from './SecurityTab';
import { useAuth } from '../Context/AuthContext';

const UNIVERSAL_ADMIN_USERNAME = 'admin.gaurishankar';

const ALL_TABS = [
    { id: 'details',       label: 'Profile Details',     Icon: FaUserCircle },
    { id: 'notifications', label: 'Notifications',       Icon: FaBell },
    { id: 'security',      label: 'Password & Security', Icon: FaLock },
    { id: 'history',       label: 'Login History',       Icon: FaHistory },
];

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('details');

    const isUniversalAdmin = user?.username === UNIVERSAL_ADMIN_USERNAME;
    const TABS = isUniversalAdmin
        ? ALL_TABS.filter((t) => t.id !== 'security')
        : ALL_TABS;

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <ProfileHeader />

                    <div className="mb-6 overflow-x-auto hide-scrollbar">
                        <div className="flex gap-2 border-b border-white/10 min-w-max">
                            {TABS.map(({ id, label, Icon }) => {
                                const isActive = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                            isActive
                                                ? 'bg-[#173ef0] text-white'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {activeTab === 'details'       && <ProfileDetailsTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                    {activeTab === 'security'      && <SecurityTab />}
                    {activeTab === 'history'       && <LoginHistoryTab />}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;