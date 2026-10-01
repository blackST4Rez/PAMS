import { useMemo, useState } from 'react';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import PageToolbar from '../Common/PageToolbar';
import UnifiedSidebar from '../Sidebars/UnifiedSidebar';
import GisMap from './GisMap';
import GisFilters from './GisFilters';
import GisLegend from './GisLegend';
import { useAuth } from '../Context/AuthContext';
import { useAssets } from '../Context/AssetsContext';
import { coordsForAsset, polygonForAsset } from '../mock/mockGis';

const GisPage = () => {
    const { hasPermission, loading: authLoading } = useAuth();
    const { allAssets, loading: assetsLoading } = useAssets();

    const [filters, setFilters] = useState({
        categoryId: '',
        wardId: '',
        status: '',
    });

    const allOnMap = useMemo(() => {
        return allAssets()
            .map((a) => {
                const coords = coordsForAsset(a.id);
                const polygon = polygonForAsset(a.id);
                if (!coords && !polygon) return null;
                return { ...a, coords, polygon };
            })
            .filter(Boolean);
    }, [allAssets]);

    const filteredAssets = useMemo(() => {
        return allOnMap.filter((a) => {
            if (filters.categoryId && a.categoryId !== filters.categoryId) return false;
            if (filters.wardId && a.wardId !== filters.wardId) return false;
            if (filters.status && a.status !== filters.status) return false;
            return true;
        });
    }, [allOnMap, filters]);

    if (authLoading || assetsLoading) {
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

    if (!hasPermission('gis.view')) {
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
                                You do not have permission to view the GIS map.
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
                        totalCount={allOnMap.length}
                    />

                    <div className="relative w-full">
                        <GisMap assets={filteredAssets} />
                        <GisLegend />
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default GisPage;