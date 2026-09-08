import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import HeroSection from '../Sections/HeroSection';
import FeaturesSection from '../Sections/FeatureSection';
import HowItWorksSection from '../Sections/HowItWorksSection';
import StatsSection from '../Sections/StatsSection';
import CTASection from '../Sections/CTASection';
import { landingData } from '../Data/LandingData';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const { header, hero, features, howItWorks, stats, cta, footer } = landingData;

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Header {...header} />
            <HeroSection data={hero} />
            <FeaturesSection data={features} />
            <HowItWorksSection data={howItWorks} />
            <StatsSection data={stats} />
            <CTASection data={cta} />
            <Footer {...footer} />
        </div>
    );
};

export default LandingPage;