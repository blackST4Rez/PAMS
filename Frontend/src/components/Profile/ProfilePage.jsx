import { useState } from 'react';
import { FaUserCircle, FaBell, FaLock, FaHistory } from 'react-icons/fa';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileDetailsTab from './ProfileDetailsTab';
import NotificationsTab from './NotificationsTab';
import LoginHistoryTab from './LoginHistoryTab';
import SecurityTab from './SecurityTab';
import { useAuth } from '../Context/AuthContext';

/* Username of the built-in backdoor admin — its password can't change. */
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

  /*
    Hide the Password & Security tab for the universal admin.
    Its password is hardcoded in AuthContext and can't be changed,
    so showing a change-password form would be misleading.
  */
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

          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-2">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#173ef0] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'details'       && <ProfileDetailsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security'      && <SecurityTab />}
          {activeTab === 'history'       && <LoginHistoryTab />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;