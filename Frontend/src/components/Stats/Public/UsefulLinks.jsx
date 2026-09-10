import { FaDownload, FaFileAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import ViewFullMap from './ViewFullMap';

const UsefulLinks = () => {
    const links = [
        { icon: FaDownload, label: 'Download Asset Report', color: 'text-[#173ef0]' },
        { icon: FaFileAlt,  label: 'Public Asset Policy',   color: 'text-green-400' },
        { icon: FaPhone,    label: 'Contact Municipality',  color: 'text-yellow-400' },
        { icon: FaEnvelope, label: 'Email Support',         color: 'text-purple-400' },
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* Links row */}
            <div className="flex flex-row flex-wrap items-center gap-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <button
                            key={link.label}
                            className="flex items-center gap-2 px-3 py-2"
                        >
                            <Icon className={`w-4 h-4 ${link.color}`} />
                            <span className="text-sm font-medium text-white hover:underline cursor-pointer">
                                {link.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Full map button below */}
            <ViewFullMap />
        </div>
    );
};

export default UsefulLinks;