import Reason from "./Reason";
import Mockup from "../../assets/Mockup.png"
import FadeInSection from "../FadeInSection";

const reasons = [
    { header: "Be part of something bigger", description: "Join a network of entrepreneurs and change-makers across Africa and the diaspora." },
    { header: "Your effort pays off", description: "The more you participate, the more you earn — up to ₦100,000 monthly." },
    { header: "Earn while you grow", description: "Complete simple daily tasks, refer friends, and watch your earnings rise." },
    { header: "We value our members", description: "Every member matters. We reward your commitment and help you succeed." },
    { header: "Secure & transparent", description: "Clear earning rules, reliable payouts, and a trusted community." },
];

const WhyJoinUs = () => {
    return (
        <div className="bg-[#09052C] lg:py-12 md:py-8 py-6 lg:px-24 md:px-8 px-4 flex md:flex-row flex-col-reverse items-center justify-center md:gap-6 gap-4">
            <FadeInSection type="slideLeft"><img src={Mockup} alt="EXGEID Why Join Us Banner" /></FadeInSection>
            <div>
                <h2 className="font-bold text-[#CACACA] lg:text-[34px] md:text-[25.5px] text-[22.26px]">Why Join Exgeid</h2>
                <div>
                    {reasons.map((reason, i) => (
                        <div>
                            <div key={i} className="md:block hidden">
                                <Reason header={reason.header} description={reason.description} type={"slideRight"} delay={i} />
                            </div>
                            <div key={i} className="md:hidden block">
                                <Reason header={reason.header} description={reason.description} type={"zoom"} delay={i} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyJoinUs;