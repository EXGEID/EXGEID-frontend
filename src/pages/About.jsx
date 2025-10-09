import Navbar from "../components/about/Navbar";
import WhoWeAre from "../components/about/WhoWeAre";
import Mission from "../components/about/Mission";
import WhatWeDo from "../components/about/WhatWeDo";
import CoreValues from "../components/about/CoreValues";
import WhyWeExist from "../components/about/WhyWeExist";
import Footer from "../components/Footer";

const About = () => {
    return (
        <div>
            <Navbar />
            <WhoWeAre />
            <Mission />
            <WhatWeDo />
            <CoreValues />
            <WhyWeExist />
            <Footer />
        </div>
    );
};

export default About;