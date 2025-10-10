import { useState } from 'react';
import PhoneIcon from "../../assets/icons/call.svg";
import LocationIcon from "../../assets/icons/location.svg";
import MessageIcon from "../../assets/icons/message-text.svg";
import EmailIcon from "../../assets/icons/email.svg";
import FadeInSection from '../FadeInSection';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-[#09052C] lg:py-32 items-center py-12 px-6 lg:px-8">
      <FadeInSection type="slideUp" className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="">
          <div className="grid md:grid-cols-2 md:gap-16 gap-12 items-start">
            {/* Left Side - Contact Info */}
            <div className="">
              <h1 className="lg:text-[32px] md:text-[20px] text-[20.79px] font-semibold text-[#CACACA] lg:mb-6 mb-2">Get In Touch</h1>
              <p className="font-semibold text-[#CACACA] lg:text-[16px] md:text-[14px] text-[12.39px] lg:mb-12 mb-6 leading-relaxed">
                We're always available to support your EXGEID journey. Reach us via any of the channels below:
              </p>
              
              <div className="space-y-8">
                {/* Office Address */}
                <div className="flex items-start space-x-4">
                  <img src={LocationIcon}/>
                  <div>
                    <h3 className="lg:mt-[-5px] mt-[-2px] text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] mb-1">Office Address</h3>
                    <p className="lg:text-[14px] md:text-[12.27px] text-[10.47px] font-medium text-[#CACACA]">EXGEID Africa HQ</p>
                    <p className="lg:text-[14px] md:text-[12.27px] text-[10.47px] font-medium text-[#CACACA]">Lagos, Nigeria</p>
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="flex items-start space-x-4">
                  <img src={PhoneIcon}/>
                  <div>
                    <h3 className="lg:mt-[-5px] mt-[-2px] text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] mb-1">Phone number</h3>
                    <p className="lg:text-[14px] md:text-[12.27px] text-[10.47px] font-medium text-[#CACACA]">+234 (XXX) XXX XXXX</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <img src={MessageIcon}/>
                  <div>
                    <h3 className="lg:mt-[-5px] mt-[-2px] text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] mb-1">E-Mail</h3>
                    <p className="lg:text-[14px] md:text-[12.27px] text-[10.47px] font-medium text-[#CACACA]">support@exgeid.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div>
              <h2 className="font-semibold lg:text-[22px] md:text-[16.62px] text-[15.59px] text-[#B5B5B5] lg:mb-6 mb-2">Send us a message</h2>
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12.56px] text-[11.52px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                  />
                </div>
                
                <div className="relative">
                  <img src={EmailIcon} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12.56px] text-[11.52px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    placeholder="Enter Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg font-regular text-[#A9A8CD] lg:text-[15.37px] md:text-[12.56px] text-[11.52px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D] resize-none"
                  />
                </div>
                
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#8F0406] hover:bg-red-700 hover:scale-105 text-white font-medium lg:text-[15.37px] md:text-[12px] text-[11.52px] md:py-4 py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default ContactForm;