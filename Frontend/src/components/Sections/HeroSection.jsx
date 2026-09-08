import Button from '../Common/Button';
import { BiLogIn, BiRightArrowAlt, BiChevronDown } from 'react-icons/bi';
import HeroImage from '../../assets/HeroImage.svg';

const HeroSection = ({ data }) => {
    // Safety check: If data is undefined, return nothing
    if (!data) {
        return null;
    }

    const { title, highlight, description, buttons, features } = data;

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="bg-gray-50 pt-28 pb-40 lg:pt-50 lg:pb-20 px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-10">
                        {/* Title */}
                        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight">
                            {title}{' '}
                            <span className="text-[#002cf2]">{highlight}</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">{description}</p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-6 pt-2">
                            {buttons && buttons.length > 0 ? (
                                buttons.map((btn, index) => {
                                    if (btn.primary) {
                                        return (
                                            <Button
                                                key={index}
                                                to={btn.path}
                                                variant="primary"
                                                size="xlarge"
                                                icon={BiLogIn}
                                                iconPosition="left"
                                            >
                                                {btn.label}
                                                <BiRightArrowAlt className="w-7 h-7" />
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={index}
                                            onClick={scrollToFeatures}
                                            variant="secondary"
                                            size="xlarge"
                                            icon={BiChevronDown}
                                            iconPosition="left"
                                        >
                                            {btn.label}
                                        </Button>
                                    );
                                })
                            ) : (
                                // Fallback buttons
                                <>
                                    <Button
                                        to="/login"
                                        variant="primary"
                                        size="xlarge"
                                        icon={BiLogIn}
                                        iconPosition="left"
                                    >
                                        Get Started
                                        <BiRightArrowAlt className="w-7 h-7" />
                                    </Button>
                                    <Button
                                        onClick={scrollToFeatures}
                                        variant="secondary"
                                        size="xlarge"
                                        icon={BiChevronDown}
                                        iconPosition="left"
                                    >
                                        Learn More
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap items-center gap-8 pt-2">
                            {features && features.length > 0 ? (
                                features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="p-2">
                                                {Icon && <Icon className={`w-6 h-6 ${feature.color || 'text-green-600'}`} />}
                                            </div>
                                            <span className="text-base text-gray-700 font-medium">{feature.text}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                // Fallback features
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-base text-gray-700 font-medium">Secure & Reliable</span>
                                </div>
                            )}
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