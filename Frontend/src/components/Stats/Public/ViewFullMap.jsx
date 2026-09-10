import { FaMapMarkedAlt } from 'react-icons/fa';

const ViewFullMap = () => {
    return (
        <div>
            <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#173ef0] text-white font-medium rounded-lg hover:bg-[#0020ad] transition-colors duration-200">
                    <FaMapMarkedAlt className="w-4 h-4" />
                    View Full Map
                </button>
            </div>
        </div>
    );
};

export default ViewFullMap;