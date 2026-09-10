import { FaSearchPlus, FaSearchMinus, FaExpand, FaLayerGroup, FaMapPin } from 'react-icons/fa';

const MapControls = () => {
    const controls = [
        { icon: FaSearchPlus,  label: 'Zoom In' },
        { icon: FaSearchMinus, label: 'Zoom Out' },
        { icon: FaExpand,      label: 'Full Screen' },
        { icon: FaLayerGroup,  label: 'Ward Filter' },
        { icon: FaMapPin,      label: 'Location Search' },
    ];

    return (
        <div className="p-4 flex flex-col items-start">
            <h3 className="text-l font-semibold text-white mb-3 text-left">Map Controls</h3>
            <div className="w-full space-y-2">
                {controls.map((control) => {
                    const Icon = control.icon;
                    return (
                        <button
                            key={control.label}
                            className="w-full flex items-center justify-start gap-2 text-left text-white"
                        >
                            <Icon className="w-3 h-3" />
                            <span className="text-l">{control.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MapControls;