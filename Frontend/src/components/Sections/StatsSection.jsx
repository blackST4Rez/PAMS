import StatsCounter from '../Common/StatsCounter';

const StatsSection = ({ data }) => {
    // Safety check: If data is undefined, return null
    if (!data) {
        return null;
    }

    const { items } = data;

    // If no items, return null or show fallback
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-32 px-8 lg:px-12 bg-linear-to-r from-indigo-600 to-indigo-700">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {items.map((item, index) => (
                        <div key={index} className="text-center text-white">
                            <div className="text-6xl lg:text-7xl font-bold">
                                <StatsCounter value={item.value} />
                                {item.suffix || ''}
                            </div>
                            <p className="text-indigo-200 mt-4 text-xl font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;