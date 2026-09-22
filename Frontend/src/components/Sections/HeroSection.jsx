import { Link } from 'react-router-dom';
import { BiArrowFromLeft } from 'react-icons/bi';
import HeroImage from '../../assets/HeroImage.svg';

const HeroSection = () => {
    return (
        <section className="bg-gray-50 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left — Text content */}
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                            Manage{' '}
                            <span className="block sm:inline">Public Assets</span>{' '}
                            <span className="text-[#173ef0] block sm:inline">
                                Efficiently
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                            A comprehensive digital asset register for rural
                            municipalities. Track, maintain, and optimize every
                            public asset from acquisition to disposal.
                        </p>

                        {/* CTA Button */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/register">
                                <button className="inline-flex items-center justify-center gap-2 bg-[#173ef0] text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg hover:bg-[#0020ad] transition-colors duration-300 cursor-pointer">
                                    <span>Get Started</span>
                                    <BiArrowFromLeft className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right — Hero image */}
                    <div className="relative order-first lg:order-last">
                        <img
                            src={HeroImage}
                            alt="Asset Management Illustration"
                            className="w-full h-auto max-h-64 sm:max-h-96 lg:max-h-125 object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;