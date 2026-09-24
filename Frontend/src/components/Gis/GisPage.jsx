import { useMemo, useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import GisMap from './GisMap';
import GisFilters from './GisFilters';
import GisLegend from './GisLegend';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { coordsForAsset } from '../mock/mockGis';

const GisPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const { allAssets, loading: assetsLoading } = useAssets();

    const [filters, setFilters] = useState({
        categoryId: '',
        wardId: '',
        status: '',
    });

    const allWithCoords = useMemo(() => {
        return allAssets()
            .map((a) => {
                const coords = coordsForAsset(a.id);
                if (!coords) return null;
                return { ...a, coords };
            })
            .filter(Boolean);
    }, [allAssets]);

    const filteredAssets = useMemo(() => {
        return allWithCoords.filter((a) => {
            if (filters.categoryId && a.categoryId !== filters.categoryId) return false;
            if (filters.wardId && a.wardId !== filters.wardId) return false;
            if (filters.status && a.status !== filters.status) return false;
            return true;
        });
    }, [allWithCoords, filters]);

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

    if (!hasPermission('gis.view')) {
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
                                You do not have permission to view the GIS map.
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
                    <div className="mb-6 px-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold text-white">
                                GIS Map
                            </h1>
                            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold rounded-full bg-[#173ef0] text-white">
                                {filteredAssets.length}
                            </span>
                        </div>
                        <p className="text-white/60 text-lg mt-1">
                            Registered assets plotted by location
                        </p>
                    </div>

                    <GisFilters
                        filters={filters}
                        onChange={setFilters}
                        resultCount={filteredAssets.length}
                        totalCount={allWithCoords.length}
                    />

                    <div className="relative w-full px-4">
                        <GisMap assets={filteredAssets} />
                        <GisLegend />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GisPage;