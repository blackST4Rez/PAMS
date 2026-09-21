import {
    BiCheckCircle,
    BiDollar,
    BiPlus,
    BiRightArrowAlt,
    BiWrench,
} from 'react-icons/bi';

const STEPS = [
    {
        number: '01',
        icon: BiPlus,
        title: 'Register Assets',
        description:
            'Add new assets with details like title, category, acquisition cost, and location.',
    },
    {
        number: '02',
        icon: BiWrench,
        title: 'Track & Maintain',
        description:
            'Schedule maintenance, log activities, and monitor asset health in real-time.',
    },
    {
        number: '03',
        icon: BiDollar,
        title: 'Value & Depreciate',
        description:
            'Run depreciation calculations and get accurate current asset values.',
    },
    {
        number: '04',
        icon: BiCheckCircle,
        title: 'Approve & Transfer',
        description:
            'Manage asset transfers and disposals through multi-level approval workflows.',
    },
];

const HowItWorksSection = () => {
    return (
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 sm:space-y-5 mb-12 sm:mb-16">
                    <div className="inline-flex items-center px-5 sm:px-6 py-2 sm:py-2.5 bg-[#002cf2] rounded-full text-sm sm:text-base font-semibold text-white">
                        How It Works
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                        Simple Steps to Get{' '}
                        <span className="block sm:inline">Started</span>
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-2">
                        Start managing your public assets effectively in just a
                        few steps.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === STEPS.length - 1;

                        return (
                            <div
                                key={step.number}
                                className="relative bg-white hover:bg-gray-50 rounded-lg p-6 sm:p-8 border border-gray-200 transition-colors duration-300 flex flex-col"
                            >
                                {/* Big number */}
                                <div className="text-5xl sm:text-6xl font-bold text-indigo-100 mb-5 sm:mb-6">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="p-3 sm:p-4 rounded-2xl w-fit mb-5 sm:mb-6">
                                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-base text-gray-600 leading-relaxed flex-1">
                                    {step.description}
                                </p>

                                {/*
                                  Arrow between cards — only on large screens
                                  where the 4 cards sit in a single row.
                                */}
                                {!isLast && (
                                    <div className="hidden lg:flex absolute -right-5 top-[40%] items-center justify-center bg-white rounded-full w-10 h-10 border border-gray-300 z-10">
                                        <BiRightArrowAlt className="w-6 h-6 text-[#002cf2]" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;