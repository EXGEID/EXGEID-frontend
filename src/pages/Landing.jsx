import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import WhyJoinUs from "../components/landing/WhyJoinUs";
import TaskSection from "../components/landing/TaskSection";
import FrequentlyAskedQuestions from "../components/landing/FAQs";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <WhyJoinUs />
            <TaskSection />
            <FrequentlyAskedQuestions />
            <Footer />
        </div>
    );
};

export default LandingPage;