import { useState } from 'react';
import { FaChartBar, FaBuilding, FaChartLine, FaWrench } from 'react-icons/fa';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import AssetRegisterReport from './AssetRegisterReport';
import WardBreakdownReport from './WardBreakdownReport';
import DepreciationSummaryReport from './DepreciationSummaryReport';
import MaintenanceCostReport from './MaintenanceCostReport';
import { useAuth } from '../Context/AuthContext';

const TABS = [
    { id: 'register',     label: 'Asset Register',       Icon: FaChartBar },
    { id: 'ward',         label: 'Ward Breakdown',       Icon: FaBuilding },
    { id: 'depreciation', label: 'Depreciation Summary', Icon: FaChartLine },
    { id: 'maintenance',  label: 'Maintenance Cost',     Icon: FaWrench },
];

const ReportsPage = () => {
    const { hasPermission } = useAuth();
    const [activeTab, setActiveTab] = useState('register');

    if (!hasPermission('report.view')) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] rounded-xl p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Access Denied
                            </h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view reports.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    {/* Page header */}
                    <div className="mb-6 px-4">
                        <h1 className="text-3xl font-bold text-white">Reports</h1>
                        <p className="text-white/60 text-lg mt-1">
                            Generate and export summary reports across the register
                        </p>
                    </div>

                    {/*
                      Tabs wrapper — outer px matches the report card's
                      inner padding (p-4 sm:p-6), so the grid and the
                      divider line align with the search bar inside the
                      report card below.
                    */}
                    <div className="mb-6 px-4 sm:px-6">
                        <div className="grid grid-cols-2 gap-2 pb-4 border-b border-white/10">
                            {TABS.map(({ id, label, Icon }) => {
                                const isActive = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-[#173ef0] text-white'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Report content — uniform card wrapper */}
                    <div className="rounded-xl p-4 sm:p-6 w-full">
                        {activeTab === 'register'     && <AssetRegisterReport />}
                        {activeTab === 'ward'         && <WardBreakdownReport />}
                        {activeTab === 'depreciation' && <DepreciationSummaryReport />}
                        {activeTab === 'maintenance'  && <MaintenanceCostReport />}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ReportsPage;