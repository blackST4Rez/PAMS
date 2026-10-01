import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUserCircle, FaLock, FaHistory } from 'react-icons/fa';
import { GrNotification } from "react-icons/gr";
import Footer from '../Common/Footer';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileDetailsTab from './ProfileDetailsTab';
import LoginHistoryTab from './LoginHistoryTab';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import { useAuth } from '../Context/AuthContext';
import { GrCaretPrevious } from 'react-icons/gr';

const UNIVERSAL_ADMIN_USERNAME = 'admin.gaurishankar';

const ALL_TABS = [
    { id: 'details',       label: 'Profile Details',     Icon: FaUserCircle },
    { id: 'security',      label: 'Password & Security', Icon: FaLock },
    { id: 'notifications', label: 'Notifications',       Icon: GrNotification},
    { id: 'history',       label: 'Login History',       Icon: FaHistory },
];

const VALID_TAB_IDS = new Set(ALL_TABS.map((t) => t.id));

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialTab = (() => {
        const t = searchParams.get('tab');
        return t && VALID_TAB_IDS.has(t) ? t : 'details';
    })();

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const t = searchParams.get('tab');
        if (t && VALID_TAB_IDS.has(t)) {
            setActiveTab(t);
        }
    }, [searchParams]);

    const isUniversalAdmin = user?.username === UNIVERSAL_ADMIN_USERNAME;
    const TABS = isUniversalAdmin
        ? ALL_TABS.filter((t) => t.id !== 'security')
        : ALL_TABS;

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-700 flex">
            <UnifiedSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-6 lg:px-8 lg:pt-4 lg:pb-8 overflow-y-auto bg-[#1a1a1a]">
                    <PageToolbar />

                    <button
                        type="button"
                        onClick={handleBack}
                        className="group mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-white hover:underline transition-colors ease-in-out duration-300"
                    >
                        <GrCaretPrevious className="w-3.5 h-3.5 text-white" />
                        Back
                    </button>

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
                    {activeTab === 'security'      && <SecurityTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                    {activeTab === 'history'       && <LoginHistoryTab />}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default ProfilePage;