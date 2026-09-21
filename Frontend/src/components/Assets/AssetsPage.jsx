import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import AssetsTable from './AssetsTable';
import AssetFilters from './AssetFilters';
import RegisterAssetModal from './RegisterAssetModal';
import AssetDetailDrawer from './AssetDetailDrawer';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';

const AssetsPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const { allAssets, loading: assetsLoading } = useAssets();

    const [showRegister, setShowRegister] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        wardId: '',
        status: '',
    });

    const filteredAssets = useMemo(() => {
        const rows = allAssets();
        const q = filters.search.trim().toLowerCase();

        return rows.filter((a) => {
            if (filters.categoryId && a.categoryId !== filters.categoryId) return false;
            if (filters.wardId && a.wardId !== filters.wardId) return false;
            if (filters.status && a.status !== filters.status) return false;

            if (q) {
                const haystack = [
                    a.assetCode,
                    a.title,
                    a.description,
                    a.categoryName,
                    a.wardName,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [allAssets, filters]);

    if (authLoading || assetsLoading) {
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

    if (!hasPermission('asset.view')) {
        return (
            <div className="min-h-screen bg-gray-700 flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <UnifiedSidebar />
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1a1a1a]">
                        <div className="bg-[#242424] rounded-xl p-8 max-w-xl">
                            <h2 className="text-lg font-semibold text-white mb-2">Access Denied</h2>
                            <p className="text-white/60 text-sm">
                                You do not have permission to view assets.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const canCreate = hasPermission('asset.create');

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row w-full">
                <UnifiedSidebar />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
                    <div className="mb-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Asset Registry</h1>
                            <p className="text-white/60 text-lg mt-1">
                                Register, review, and manage municipal assets
                            </p>
                        </div>
                        {canCreate && (
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-5 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors whitespace-nowrap"
                            >
                                + Register Asset
                            </button>
                        )}
                    </div>

                    <AssetFilters
                        filters={filters}
                        onChange={setFilters}
                        resultCount={filteredAssets.length}
                    />

                    <AssetsTable
                        assets={filteredAssets}
                        onRowClick={(id) => setSelectedAssetId(id)}
                    />
                </div>
            </div>

            {showRegister && (
                <RegisterAssetModal onClose={() => setShowRegister(false)} />
            )}

            {selectedAssetId && (
                <AssetDetailDrawer
                    assetId={selectedAssetId}
                    onClose={() => setSelectedAssetId(null)}
                />
            )}

            <Footer />
        </div>
    );
};

export default AssetsPage;