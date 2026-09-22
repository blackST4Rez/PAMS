import { Link } from 'react-router-dom';
import { BiArrowFromLeft } from 'react-icons/bi';

const CTASection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center">
                <div className="bg-linear-to-br from-indigo-50 to-blue-50 p-8 sm:p-12 lg:p-16 xl:p-20 border border-indigo-100">
                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                        Ready to Start Managing{' '}
                        <span className="block sm:inline">Your Assets?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
                        Join Gaurishankar Rural Municipality and streamline your
                        asset management process today.
                    </p>

                    {/* CTA button */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/register">
                            <button className="inline-flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg hover:bg-[#0020ad] transition-colors duration-300 cursor-pointer">
                                <span>Get Started</span>
                                <BiArrowFromLeft className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;