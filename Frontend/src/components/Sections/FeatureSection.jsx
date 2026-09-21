import {
    BiBarChartAlt,
    BiCheckCircle,
    BiShield,
    BiSolidCube,
    BiTrendingUp,
    BiWrench,
} from 'react-icons/bi';

const FEATURES = [
    {
        icon: BiSolidCube,
        title: 'Asset Registry',
        description:
            'Track every public asset from acquisition to disposal with complete lifecycle management.',
    },
    {
        icon: BiWrench,
        title: 'Maintenance Management',
        description:
            'Schedule and log maintenance activities with automated reminders and cost tracking.',
    },
    {
        icon: BiTrendingUp,
        title: 'Valuation & Depreciation',
        description:
            'Calculate asset depreciation and current valuation with multiple depreciation methods.',
    },
    {
        icon: BiCheckCircle,
        title: 'Approval Workflow',
        description:
            'Multi-level approval engine for asset disposal, transfers, and major changes.',
    },
    {
        icon: BiBarChartAlt,
        title: 'Reports & Analytics',
        description:
            'Generate comprehensive reports on asset register, real-time breakdown, and maintenance costs.',
    },
    {
        icon: BiShield,
        title: 'Audit Trails',
        description:
            'Complete accountability with detailed audit logs of every action in the system.',
    },
];

const FeatureSection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 sm:space-y-5 mb-12 sm:mb-16">
                    <div className="inline-flex items-center px-5 sm:px-6 py-2 sm:py-2.5 bg-[#002cf2] rounded-full text-sm sm:text-base font-semibold text-white">
                        Features
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                        Everything You Need to{' '}
                        <span className="block sm:inline">Manage Assets</span>
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-2">
                        Comprehensive features designed specifically for rural
                        municipality asset management.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="bg-white hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 lg:p-10 border border-gray-100 lg:border-x-2 lg:border-y-0 rounded-lg lg:rounded-none"
                            >
                                <div className="text-blue-600 mb-4">
                                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;