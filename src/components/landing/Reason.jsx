import { MdPersonAdd } from "react-icons/md";
import FadeInSection from "../FadeInSection";

const Reason = ({ type, delay, header, description }) => {
    return (
        <FadeInSection type={type} delay={delay} className="flex items-center justify-items-start lg:gap-4 gap-2 lg:my-6 my-2">
            <div className="flex items-center justify-center lg:w-12 lg:h-12 w-8 h-8 bg-gray-800 text-white rounded-full">
                <MdPersonAdd size={20} />
            </div>
            <div>
                <h3 className="lg:text-[18px] md:text-[16px] text-[11.78px] font-bold text-[#CACACA] mb-2">{header}</h3>
                <p className="lg:text-[16px] md:text-[14px] text-[10.47px] font-medium text-[#CACACA]">{description}</p>
            </div>
        </FadeInSection>
    );
};

export default Reason;