import { useNavigate } from "react-router-dom";
import Task from "./Task";
import videoIcon from "../../assets/icons/video.svg";
import globalIcon from "../../assets/icons/global.svg";
import paidIcon from "../../assets/icons/paid.svg";
import rate from "../../assets/rate.png";
import video from "../../assets/video.png";
import global from "../../assets/global.png";
import paid from "../../assets/paid.png";
import FadeInSection from "../FadeInSection";

const tasks = [
    { icon: videoIcon, title: "Watch videos & follow links", description: "Take your pick from the daily tasks on the earn page — watch YouTube videos to the end, follow Instagram & TikTok links, and engage with our community.", image: video },
    { icon: globalIcon, title: "Invite friends", description: "Refer your friends and grow your team. You’ll earn referral bonuses as they join. Move up levels by bringing in the required number of referrals.", image: global },
    { icon: paidIcon, title: "Get paid", description: "Earnings accumulate through Levels 1–3 and can be cashed out at Level 4. At Level 4, you can withdraw ₦50,000 to your bank account. ₦40,000–₦100,000 monthly potential", image: paid },
];

const TaskSection = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#06031E]">
            <FadeInSection type="slideUp" className="lg:px-48 md:px-8 px-4 lg:py-16 md:py-6 py-4 grid md:grid-cols-[1fr_2fr] lg:gap-48 gap-8">
                <div>
                    <h3 className="font-bold text-white lg:text-[30.49px] md:text-[22.87px] text-[24px]">Turn your free time into instant <span className="text-[#FEC84D]">Rewards</span></h3>
                    <button onClick={() => navigate('/?modal=signup')} className="bg-[#FEC84D] font-bold text-[#1A202C] lg:text-[15.24px] md:text-[11.43px] text-[13.02px] rounded-md w-full lg:py-4 py-2 lg:my-4 my-2 hover:scale-105 transition-transform duration-300">Earn now</button>
                    <img src={rate} className="lg:w-auto w-[270px] h-[35px]" />
                </div>
                <div className="grid lg:gap-6 md:gap-4 gap-3 lg:w-[75%] lg:ml-16">
                    {tasks.map((task, i) => (
                        <div key={i}>
                            <Task icon={task.icon} title={task.title} description={task.description} image={task.image} />
                        </div>
                    ))}
                </div>
            </FadeInSection>
        </div>
    );
};

export default TaskSection;