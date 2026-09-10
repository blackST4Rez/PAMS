import { FaMap } from 'react-icons/fa';

const GISMapView = () => {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <FaMap className="w-16 h-16 text-[#173ef0] mx-auto" />
                    <p className="text-l text-white mt-2">Interactive GIS Map Placeholder</p>
                    <p className="text-sm text-white/40 mt-1">Map with colored pins for each category</p>
                </div>
            </div>
        </div>
    );
};

export default GISMapView;