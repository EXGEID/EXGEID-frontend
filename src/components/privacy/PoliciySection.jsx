import DocIcon from "../../assets/icons/doc.svg";
import InfoIcon from "../../assets/icons/information.svg";
import GlobeIcon from "../../assets/icons/globe.svg";
import ChartIcon from "../../assets/icons/chart-success.svg";
import SettingsIcon from "../../assets/icons/setting-2.svg";
import BookMarkIcon from "../../assets/icons/bookmark.svg";
import LockIcon from "../../assets/icons/lock-circle.svg";
import TransferIcon from "../../assets/icons/translate.svg";
import ProfileTickIcon from "../../assets/icons/profile-tick.svg";

const PolicySection = () => {
  return (
    <div className="bg-[#09052C] lg:py-32 items-center py-10 px-6 lg:px-56">
        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px]">
            <div className="flex items-center">
                <img src={DocIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Information We Collect</h2>
            </div>
            <p>We may collect the following types of information:</p>
            <p>Personal Information: Name, email address, phone number, payment details, profile information, etc.</p>
            <p>Usage Data:App activity, interactions, preferences, and log files.</p>
            <p>Device Information: IP address, device model, operating system, browser type, and mobile network.</p>
            <p>Location Data:Approximate or precise location (if you enable location services).</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px]">
            <div className="flex items-center">
                <img src={DocIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">How We Use Your Information</h2>
            </div>
            <p>We use your information to:</p>
            <p>* Provide and improve EXGEID membership services.</p>
            <p>* Personalize content and user experience.</p>
            <p>* Process payments and subscriptions.</p>
            <p>* Send updates, notifications, and membership support responses.</p>
            <p>* Monitor usage, prevent fraud, and ensure security.</p>
            <p>* Comply with legal obligations.</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={InfoIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">How We Share Your Information</h2>
            </div>
            <p>We may share your information with:</p>
            <p>Service Providers:Payment processors, cloud storage providers, analytics partners, etc.</p>
            <p>Business Partners: For joint features, promotions, or integrations.</p>
            <p>Legal Authorities: If required by law, regulation, or legal process.</p>
            <p>In Case of Business Transfer: If EXGEID merges with other cooperatives, or undergoes restructuring, user data may be part of the transferred assets.</p>
            <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px]">
            <div className="flex items-center">
                <img src={GlobeIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Cookies and Tracking Technologies</h2>
            </div>
            <p>EXGEID may use cookies, web beacons, and similar technologies to:</p>
            <p>* Remember your preferences.</p>
            <p>* Improve performance and analytics.</p>
            <p>* Deliver personalized advertising (where applicable).</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px]">
            <div className="flex items-center">
                <img src={ChartIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Your Privacy Choices</h2>
            </div>
            <p>You have the membership right to:</p>
            <p>* Access, update, or delete your account information.</p>
            <p>* Opt out of marketing communications.</p>
            <p>* Control app permissions (location, notifications, etc.) from your device settings.</p>
            <p>* Request a copy of the personal data we hold about you (where legally applicable).</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={SettingsIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Data Security</h2>
            </div>
            <p>We use industry-standard security measures (encryption, firewalls, secure servers) to protect your information. However, no system is 100% secure, and we cannot guarantee complete protection.</p>    
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={BookMarkIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Data Retention</h2>
            </div>
            <p>We keep your personal data only as long as necessary to provide services, comply with legal obligations, or resolve disputes. When no longer needed, we delete or anonymize your data.</p>    
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={LockIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Children’s Privacy</h2>
            </div>
            <p>EXGEID membership is not intended for children under 18. We do not knowingly collect data from children(Only where parents provide such information for service purposes). If we learn we have collected information from a child without parental consent, we will delete it immediately.</p>
        </section>

        <section className="mb-4 lg:mb-8 font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={TransferIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">International Data Transfers</h2>
            </div>
            <p>Your information may be transferred to and stored in countries outside your home country. By using EXGEID, you consent to such transfers, which will be protected by appropriate safeguards.</p>
        </section>

        <section className="font-medium text-[#CACACA] lg:text-[18px] md:text-[14px] text-[10px] lg:w-[90%]">
            <div className="flex items-center">
                <img src={ProfileTickIcon} className="lg:mb-3 mb-2 scale-[65%] origin-left md:scale-[100%]" />
                <h2 className="ml-[-5px] md:ml-4 text-[#CACACA] font-bold lg:text-[20px] md:text-[14.28px] text-[11.22px] lg:mb-4 mb-2">Changes to This Privacy Policy</h2>
            </div>
            <p>We may update this Privacy Policy from time to time. If changes are significant, we will notify you via app notifications, email, or website updates. Please review regularly.</p>    
        </section>
    </div>
  );
};

export default PolicySection;