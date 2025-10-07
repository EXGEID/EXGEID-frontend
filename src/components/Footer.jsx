import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/landing-logo.png";
import FadeInSection from "./FadeInSection";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#06031E] lg:px-48 lg:py-28 md:py-12 md:px-8 py-8 px-4"><FadeInSection type="slideDown">
            <div className="grid lg:grid-cols-[3fr_2fr] md:grid-cols-2 grid-cols-1 lg:gap-12 md:gap-8 gap-4">
                <div>
                    <h2 className="font-bold text-[#CACACA] lg:text-[26.34px] text-[19.76px] lg:mb-4 mb-2">EXGEID AFRICA</h2>
                    <p className="font-regular text-[#A9A8CD] lg:text-[17.56px] md:text-[12px] text-[13.17px]">Empowering entrepreneurs across Africa and the diaspora through community, collaboration, and rewards.</p>
                </div>
                <div>
                    <div className="flex mg:gap-4 gap-2 mb-3">
                        <input type="email" placeholder="Enter your email" className="w-[75%] lg:p-4 p-2 rounded-lg bg-[#0C0827] font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12px] text-[11.52px]"/>
                        <button className="bg-[#8F0406] hover:bg-red-700 hover:scale-105 rounded-lg text-white font-normal lg:text-[15.37px] md:text-[12px] text-[11.52px] px-3">Subscribe</button>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-[16px] h-[16px] flex items-center justify-center my-auto rounded-full bg-[#A9A8CD] text-[#0C0827] text-[12px]">i</div>
                        <p className="font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12px] text-[11.52px]">Your email is safe with us. <Link to="/privacy-policy" className="underline">privacy policy</Link></p>
                    </div>
                </div>
            </div>
            <hr className="hidden md:block h-1 w-full bg-[#4F5B76] my-8" />
            <img src={Logo} alt="EXGEID logo" className="mx-auto lg:my-12 mt-8 mb-4"/>
            <ul className="flex flex-col md:flex-row md:gap-12 gap-4 justify-center items-center font-medium text-[#A9A8CD] lg:text-[17.56px] text-[13.17px]">
                <Link to="/" className="hover:text-gray-200 hover:scale-105">Home</Link>
                <Link to="/about" className="hover:text-gray-200 hover:scale-105">About Us</Link>
                <Link to="/contact-us" className="hover:text-gray-200 hover:scale-105">Contact Us</Link>
                <button onClick={() => navigate('?modal=terms-and-conditions')} className="hover:text-gray-200 hover:scale-105">Terms</button>
                <Link to="/privacy-policy" className="hover:text-gray-200 hover:scale-105">Privacy Policy</Link>
            </ul></FadeInSection>
        </div>
    );
};

export default Footer;