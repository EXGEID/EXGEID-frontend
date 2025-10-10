import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/landing-logo.png";
import FadeInSection from "./FadeInSection";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Footer = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const API_ENDPOINT = "https://exgeid-backend.onrender.com/api/v1/public/add/subscribers/news-letter";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log("Subscription successful:", { email });
                toast.success("Successfully subscribed!", {
                    style: {
                        background: "#09052C",
                        color: "#CACACA",
                        border: "1px solid #FEC84D",
                        zIndex: 9999,
                    },
                    iconTheme: {
                        primary: "#FEC84D",
                        secondary: "#09052C",
                    },
                    position: "top-center",
                    duration: 5000,
                });
                // Delay clearing the form to allow toast to display
                setTimeout(() => {
                    setEmail(""); // Clear the form
                    setLoading(false);
                }, 5000); // Match toast duration
            } else {
                throw new Error("Subscription failed");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error("Failed to subscribe. Please try again.", {
                style: {
                    background: "#09052C",
                    color: "#CACACA",
                    border: "1px solid #ef4444",
                    zIndex: 9999,
                },
                iconTheme: {
                    primary: "#ef4444",
                    secondary: "#09052C",
                },
                position: "top-center",
                duration: 5000,
            });
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#06031E] lg:px-48 lg:py-28 md:py-12 md:px-8 py-8 px-4">
            <style jsx>{`
                .spinner {
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid #FEC84D;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 0.5rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 5000,
                    style: {
                        zIndex: 9999,
                    },
                }}
                containerStyle={{
                    top: 20,
                    zIndex: 9999,
                }}
            />
            <FadeInSection type="slideDown">
                <div className="grid lg:grid-cols-[3fr_2fr] md:grid-cols-2 grid-cols-1 lg:gap-12 md:gap-8 gap-4">
                    <div>
                        <h2 className="font-bold text-[#CACACA] lg:text-[26.34px] text-[19.76px] lg:mb-4 mb-2">EXGEID AFRICA</h2>
                        <p className="font-regular text-[#A9A8CD] lg:text-[17.56px] md:text-[12px] text-[13.17px]">
                            Empowering entrepreneurs across Africa and the diaspora through community, collaboration, and rewards.
                        </p>
                    </div>
                    <div>
                        <form className="flex mg:gap-4 gap-2 mb-3" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-[75%] lg:p-4 p-2 rounded-lg bg-[#0C0827] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D] font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12px] text-[11.52px]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className={`bg-[#8F0406] hover:bg-red-700 hover:scale-105 rounded-lg text-white font-normal lg:text-[15.37px] md:text-[12px] text-[11.52px] px-3 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Loading...
                                    </>
                                ) : (
                                    "Subscribe"
                                )}
                            </button>
                        </form>
                        <div className="flex gap-1">
                            <div className="w-[16px] h-[16px] flex items-center justify-center my-auto rounded-full bg-[#A9A8CD] text-[#0C0827] text-[12px]">i</div>
                            <p className="font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12px] text-[11.52px]">
                                Your email is safe with us. <Link to="/privacy-policy" className="underline">privacy policy</Link>
                            </p>
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
                </ul>
            </FadeInSection>
        </div>
    );
};

export default Footer;