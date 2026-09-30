import { useState } from 'react';
import { FaSitemap, FaTags, FaMapMarkedAlt, FaBuilding } from 'react-icons/fa';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import ApprovalChainsSection from './ApprovalChainsSection';
import CategoriesSection from './CategoriesSection';
import { useAuth } from '../Context/AuthContext';

const ALL_TABS = [
    { id: 'chains',       label: 'Approval Chains',  Icon: FaSitemap },
    { id: 'categories',   label: 'Categories',       Icon: FaTags },
    { id: 'wards',        label: 'Wards',            Icon: FaMapMarkedAlt },
    { id: 'organization', label: 'Organization',     Icon: FaBuilding },
];

const ConfigPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('chains');

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <Loader />
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (!hasPermission('admin.config')) {
        return (
            <div className="min-h-screen bg-gray-700 flex">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view system configuration.
                            </p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 flex">
            <UnifiedSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-4 sm:p-6 lg:px-8 lg:pt-4 lg:pb-8 overflow-y-auto bg-[#1a1a1a]">
                    <PageToolbar />

                    <div className="mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">
                            System Configuration
                        </h1>
                        <p className="text-white/60 text-lg mt-1">
                            Reference data and workflow configuration
                        </p>
                    </div>

                    <div className="mb-6 px-4">
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="flex gap-2 border-b border-white/10 min-w-max">
                                {ALL_TABS.map(({ id, label, Icon }) => {
                                    const isActive = activeTab === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
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
                    </div>

                    <div className="w-full px-4">
                        {activeTab === 'chains' && <ApprovalChainsSection />}
                        {activeTab === 'categories' && <CategoriesSection />}

                        {activeTab === 'wards' && (
                            <PlaceholderSection
                                title="Wards"
                                body="Ward reference data will be editable here."
                            />
                        )}
                        {activeTab === 'organization' && (
                            <PlaceholderSection
                                title="Organization"
                                body="Municipality and organizational details will be editable here."
                            />
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

const PlaceholderSection = ({ title, body }) => (
    <div className="bg-[#1a1a1a] border border-white/10 p-8">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-white/50 text-sm">{body}</p>
    </div>
);

export default ConfigPage;