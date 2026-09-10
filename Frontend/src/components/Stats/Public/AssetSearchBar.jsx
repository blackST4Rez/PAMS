import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import QuickCategoryFilter from './QuickCategoryFilter';

const AssetSearchBar = () => {
    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Search Public Assets</h3>
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-4 w-4 text-white/40" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, code, location, category..."
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition"
                    />
                </div>

                {/* Category dropdown */}
                <QuickCategoryFilter />

                {/* Location dropdown — fixed width, matches category */}
                <div className="relative w-full sm:w-52">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-white/40" />
                    </div>
                    <select className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition appearance-none cursor-pointer">
                        <option className="bg-[#242424] text-white">All Locations</option>
                        <option className="bg-[#242424] text-white">Ward 1</option>
                        <option className="bg-[#242424] text-white">Ward 2</option>
                        <option className="bg-[#242424] text-white">Ward 3</option>
                        <option className="bg-[#242424] text-white">Ward 4</option>
                        <option className="bg-[#242424] text-white">Ward 5</option>
                        <option className="bg-[#242424] text-white">Ward 6</option>
                        <option className="bg-[#242424] text-white">Ward 7</option>
                        <option className="bg-[#242424] text-white">Ward 8</option>
                        <option className="bg-[#242424] text-white">Ward 9</option>
                    </select>
                </div>

                {/* Search button */}
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors duration-200">
                    <FaSearch className="w-4 h-4" />
                    Search
                </button>
            </div>
        </div>
    );
};

export default AssetSearchBar;