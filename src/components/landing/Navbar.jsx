import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.png";
import FadeInSection from "../FadeInSection";

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#09052C] lg:px-24 md:px-16 px-4 lg:py-4 md:py-3 py-3 fixed top-0 w-full z-50">
            <div className="flex items-center justify-between">
                {/* Logo - Centered on mobile */}
                <img 
                    src={logo} 
                    alt="EXGEID logo" 
                    className="w-[60%] h-[50%] sm:w-auto sm:h-auto my-auto mx-auto md:mx-0 lg:w-[20%] md:w-[25%] max-w-[150px]"
                />
                
                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:gap-16 md:gap-8 gap-4 items-center justify-center ml-[5%]">
                    <Link to="#" className="text-white font-semibold lg:text-[16px] md:text-[13.58px] text-[10.18px]">
                        Home
                    </Link>
                    <Link to="/about" className="text-[#4F5B76] hover:text-gray-400 hover:scale-105 font-semibold lg:text-[16px] md:text-[13.58px] text-[10.18px]">
                        About Us
                    </Link>
                    <Link to="/contact-us" className="text-[#4F5B76] hover:text-gray-400 hover:scale-105 font-semibold lg:text-[16px] md:text-[13.58px] text-[10.18px]">
                        Contact Us
                    </Link>
                    <button 
                        onClick={() => navigate('?modal=terms-and-conditions')} 
                        className="text-[#4F5B76] hover:text-gray-400 hover:scale-105 font-semibold lg:text-[16px] md:text-[13.58px] text-[10.18px]"
                    >
                        Terms
                    </button>
                </div>

                {/* Desktop Signup and Login Buttons */}
                <div className="flex gap-6 ml-4"><button 
                    onClick={() => navigate('?modal=signup')} 
                    className="hidden lg:block bg-[#8F0406] hover:bg-red-700 hover:scale-105 text-white lg:px-4 md:px-3 px-2 lg:py-4 md:py-3 py-2 lg:w-28 md:w-20 rounded-md my-2 md:my-4 lg:text-[16px] md:text-[13.58px] text-[10.18px]"
                >
                    Sign Up
                </button>
                <button 
                    onClick={() => navigate('?modal=login')} 
                    className="hidden lg:block border-2 border-[#FEC84D] font-bold hover:bg-yellow-900 hover:scale-105 text-[#FEC84D] lg:px-4 md:px-3 px-2 lg:py-4 md:py-3 py-2 lg:w-28 md:w-20 rounded-md my-2 md:my-4 lg:text-[16px] md:text-[13.58px] text-[10.18px]"
                >
                    Login
                </button></div>

                {/* Hamburger Icon */}
                <button 
                    className="lg:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg className="w-8 h-8 text-[#CACACA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            // X Icon
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            // Hamburger Icon
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div 
                className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col items-center gap-4 py-4 bg-[#09052C]">
                    <Link 
                        to="#" 
                        className="text-white font-semibold text-[14px]"
                        onClick={toggleMenu}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className="text-[#4F5B76] hover:text-gray-400 font-semibold text-[14px]"
                        onClick={toggleMenu}
                    >
                        About Us
                    </Link>
                    <Link 
                        to="/contact-us" 
                        className="text-[#4F5B76] hover:text-gray-400 font-semibold text-[14px]"
                        onClick={toggleMenu}
                    >
                        Contact Us
                    </Link>
                    <button 
                        onClick={() => {
                            navigate('?modal=terms-and-conditions');
                            toggleMenu();
                        }} 
                        className="text-[#4F5B76] hover:text-gray-400 font-semibold text-[14px]"
                    >
                        Terms
                    </button>
                    <button 
                        onClick={() => {
                            navigate('?modal=signup');
                            toggleMenu();
                        }} 
                        className="bg-[#8F0406] hover:bg-red-700 text-white px-4 py-2 rounded-md text-[14px]"
                    >
                        Signup
                    </button>
                    <button 
                        onClick={() => {
                            navigate('?modal=login');
                            toggleMenu();
                        }} 
                        className="border-2 border-[#FEC84D] font-semibold hover:bg-yellow-900 hover:scale-105 text-[#FEC84D] px-4 py-2 rounded-md text-[14px]"
                    >
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;