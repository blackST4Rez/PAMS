import Header from "../Common/Header"
import Footer from "../Common/Footer"
import HeroSection from "../Sections/HeroSection"
import FeaturesSection from "../Sections/FeatureSection"
import HowItWorksSection from "../Sections/HowItWorksSection"

const HomePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <Footer />
        </div>
    )
}

export default HomePage