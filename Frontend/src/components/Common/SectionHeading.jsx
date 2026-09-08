
const SectionHeading = ({ badge, title, description, className = '' }) => {
    return (
        <div className={`text-center max-w-4xl mx-auto ${className}`}>
            {badge && (
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#002cf2] rounded-full text-lg font-semibold text-white mb-8">
                    <span>{badge}</span>
                </div>
            )}
            <h2 className="text-6xl lg:text-7xl font-bold text-gray-900">{title}</h2>
            {description && (
                <p className="text-2xl text-gray-600 mt-8 leading-relaxed">{description}</p>
            )}
        </div>
    );
};

export default SectionHeading;