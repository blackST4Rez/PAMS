import { FaFilter } from 'react-icons/fa';

const QuickCategoryFilter = () => {
    const categories = [
        { label: 'All', count: 1247 },
        { label: 'Land', count: 245 },
        { label: 'Building', count: 187 },
        { label: 'Vehicle', count: 92 },
        { label: 'Road', count: 523 },
        { label: 'Infrastructure', count: 112 },
        { label: 'Office Equipment', count: 88 },
    ];

    return (
        <div className="relative w-full sm:w-52">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-white/40" />
            </div>

            <select
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#173ef0] focus:border-transparent transition appearance-none cursor-pointer"
            >
                {categories.map((cat) => (
                    <option
                        key={cat.label}
                        value={cat.label}
                        className="bg-[#242424] text-white"
                    >
                        {cat.label} ({cat.count})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default QuickCategoryFilter;