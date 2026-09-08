import { BiArrowFromLeft } from 'react-icons/bi';
import HeroImage from '../../assets/HeroImage.svg';

const HeroSection = () => {

    return (
        <section className="bg-gray-50 pt-28 pb-40 lg:pt-50 lg:pb-20 px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-10">
                        {/* Title */}
                        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight">
                            <p>Manage</p>
                            <p>Public Assets</p>
                            <span className="text-[#173ef0]">Efficently</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                            A comprehensive digital asset register for rural municipalities. Track, maintain, and optimize every public asset from acquisition to disposal.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-6 pt-2">
                            <button
                                className="flex w-60 h-5 my-auto gap-2 items-center bg-[#173ef0] text-white px-12 py-8 font-semibold text-xl hover:bg-[#0020ad] transition-colors ease-in-out duration-300 cursor-pointer">
                                <span>Get Started</span>
                                <BiArrowFromLeft className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap items-center gap-8 pt-2">

                        </div>
                    </div>

                    {/* Right Side - Bigger Image */}
                    <div className="relative">
                        <img
                            src={HeroImage}
                            alt="Asset Management Illustration"
                            className="w-full h-auto max-h-300 object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;