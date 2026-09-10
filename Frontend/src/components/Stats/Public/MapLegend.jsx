const MapLegend = () => {
    const legends = [
        { label: 'Land', color: 'bg-green-500' },
        { label: 'Building', color: 'bg-blue-500' },
        { label: 'Vehicle', color: 'bg-yellow-500' },
        { label: 'Road', color: 'bg-orange-500' },
        { label: 'Infrastructure', color: 'bg-purple-500' },
        { label: 'Equipment', color: 'bg-red-500' },
    ];

    return (
        <div className="p-4 flex flex-col items-start">
            <h3 className="text-l font-semibold text-white mb-3 text-left">Map Legend</h3>
            <div className="w-full space-y-2">
                {legends.map((item) => (
                    <div key={item.label} className="flex items-center justify-start gap-2">
                        <span className={`w-3 h-3 ${item.color} rounded-full`}></span>
                        <span className="text-l text-white">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapLegend;