import { BiRightArrowAlt } from 'react-icons/bi';
import SectionHeading from '../Common/SectionHeading';

const HowItWorksSection = ({ data }) => {
    // Safety check: If data is undefined, return null
    if (!data) {
        return null;
    }

    const { badge, title, description, steps } = data;

    return (
        <section className="py-20 px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    badge={badge}
                    title={title}
                    description={description}
                    className="mb-16"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative flex">
                                <div className="bg-white hover:bg-[#f5f5f5] rounded p-8 border border-gray-200 transition-all ease-in-out duration-300 flex-1 flex flex-col cursor-pointer">
                                    <div className="text-6xl font-bold text-indigo-100 mb-6">
                                        {step.step}
                                    </div>
                                    <div className="p-4 rounded-2xl w-fit mb-6">
                                        <Icon className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed flex-1">
                                        {step.description}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 items-center justify-center bg-white rounded-full shadow-md w-10 h-10 border border-gray-200">
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