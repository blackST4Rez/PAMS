import { useState } from 'react';
import { GrDescend, GrCube } from "react-icons/gr";
import { FaBuilding, FaWrench } from 'react-icons/fa';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import AssetRegisterReport from './AssetRegisterReport';
import WardBreakdownReport from './WardBreakdownReport';
import DepreciationSummaryReport from './DepreciationSummaryReport';
import MaintenanceCostReport from './MaintenanceCostReport';
import { useAuth } from '../Context/AuthContext';

const TABS = [
    { id: 'register',     label: 'Asset Register',       Icon: GrCube },
    { id: 'ward',         label: 'Ward Breakdown',       Icon: FaBuilding },
    { id: 'depreciation', label: 'Depreciation Summary', Icon: GrDescend },
    { id: 'maintenance',  label: 'Maintenance Cost',     Icon: FaWrench },
];

const ReportsPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('register');

    if (authLoading) {
        return (
            <div className="h-screen bg-gray-700 flex overflow-hidden">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0 h-screen">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <Loader />
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (!hasPermission('report.view')) {
        return (
            <div className="h-screen bg-gray-700 flex overflow-hidden">
                <UnifiedSidebar />
                <div className="flex-1 flex flex-col min-w-0 h-screen">
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] overflow-y-auto content-scroll min-h-0">
                        <div className="bg-[#242424] p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view reports.
                            </p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-700 flex overflow-hidden">
            <UnifiedSidebar />

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <div className="flex-1 p-4 sm:p-6 lg:px-8 lg:pt-4 lg:pb-8 overflow-y-auto content-scroll bg-[#1a1a1a] min-h-0">
                    <PageToolbar />

                    <div className="mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">Reports</h1>
                        <p className="text-white/60 text-lg mt-1">
                            Generate and export summary reports across the register
                        </p>
                    </div>

                    <div className="mb-6 px-4">
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className="flex gap-2 border-b border-white/10 min-w-max">
                                {TABS.map(({ id, label, Icon }) => {
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
                        {activeTab === 'register'     && <AssetRegisterReport />}
                        {activeTab === 'ward'         && <WardBreakdownReport />}
                        {activeTab === 'depreciation' && <DepreciationSummaryReport />}
                        {activeTab === 'maintenance'  && <MaintenanceCostReport />}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default ReportsPage;