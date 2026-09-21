import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import DepreciationRunPanel from './DepreciationRunPanel';
import AssetsValuationTable from './AssetsValuationTable';
import RevalueModal from './RevalueModal';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { useValuation } from '../Context/ValuationContext';
import { formatNprShort } from '../mock/mockValuation';

const ValuationPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const { allAssets, loading: assetsLoading } = useAssets();
    const { latestRun, loading: valuationLoading } = useValuation();

    const [revalueAssetId, setRevalueAssetId] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        method: '',
    });

    const filteredAssets = useMemo(() => {
        const rows = allAssets();
        const q = filters.search.trim().toLowerCase();

        return rows.filter((a) => {
            if (filters.categoryId && a.categoryId !== filters.categoryId) return false;
            if (filters.method && a.depreciationMethod !== filters.method) return false;

            if (q) {
                const haystack = [a.assetCode, a.title, a.categoryName]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [allAssets, filters]);

    const totals = useMemo(() => {
        const rows = allAssets();
        let cost = 0;
        let book = 0;
        for (const a of rows) {
            cost += Number(a.acquisitionCost) || 0;
            book += Number(a.currentBookValue) || 0;
        }
        return {
            count: rows.length,
            cost,
            book,
            depreciation: cost - book,
        };
    }, [allAssets]);

    if (authLoading || assetsLoading || valuationLoading) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a] flex items-center justify-center">
                        <p className="text-white/50 text-sm">Loading…</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!hasPermission('valuation.view')) {
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
                                You do not have permission to view valuation data.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const canRun = hasPermission('valuation.edit');

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6 px-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold text-white">Valuation</h1>
                            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold rounded-full bg-[#173ef0] text-white">
                                {filteredAssets.length}
                            </span>
                        </div>
                        <p className="text-white/60 text-lg mt-1">
                            Run depreciation and revalue individual assets
                        </p>
                    </div>

                    {/* Totals — 2×2 grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 px-4">
                        <Stat
                            label="Assets"
                            value={totals.count}
                            accent="text-white"
                            bg="bg-[#1c1c1c]"
                        />
                        <Stat
                            label="Total Acquisition Cost"
                            value={formatNprShort(totals.cost)}
                            accent="text-white"
                            bg="bg-[#1c1c1c]"
                        />
                        <Stat
                            label="Current Book Value"
                            value={formatNprShort(totals.book)}
                            accent="text-emerald-400"
                            bg="bg-[#1c1c1c]"
                        />
                        <Stat
                            label="Cumulative Depreciation"
                            value={formatNprShort(totals.depreciation)}
                            accent="text-red-400"
                            bg="bg-[#1c1c1c]"
                        />
                    </div>

                    <DepreciationRunPanel
                        canRun={canRun}
                        latestRun={latestRun()}
                    />

                    <AssetsValuationTable
                        assets={filteredAssets}
                        filters={filters}
                        onFiltersChange={setFilters}
                        canRevalue={canRun}
                        onRevalue={(id) => setRevalueAssetId(id)}
                    />
                </div>
            </div>

            {revalueAssetId && (
                <RevalueModal
                    assetId={revalueAssetId}
                    onClose={() => setRevalueAssetId(null)}
                    onSaved={() => setRevalueAssetId(null)}
                />
            )}

            <Footer />
        </div>
    );
};

const Stat = ({ label, value, accent = 'text-white', bg = 'bg-[#1c1c1c]' }) => (
    <div className={`${bg} border-l-5 border-l-[#173ef0] p-4 sm:p-5`}>
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
            {label}
        </p>
        <p className={`text-lg sm:text-xl font-bold ${accent}`}>
            {value}
        </p>
    </div>
);

export default ValuationPage;