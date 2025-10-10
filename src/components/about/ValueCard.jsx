import FadeInSection from "../FadeInSection";

const Card = ({ type, delay, title, description }) => {
    return (
        <FadeInSection type={type} delay={delay} className="bg-gradient-to-br from-[#1B0D86] to-[#0B0728] hover:scale-105 lg:min-h-48 md:min-h-44 min-h-12 text-[#CACACA] lg:pt-8 md:pt-6 pt-4 lg:pb-8 md:pb-12 pb-10 lg:px-12 md:px-8 px-6">
            <h2 className="font-semibold lg:text-[18.96px] md:text-[16px] text-[12px] lg:mb-2 mb-1">{title}</h2>
            <p className="font-medium lg:text-[16.85px] md:text-[14px] text-[8px] mb-4">{description}</p>
        </FadeInSection>
    );
};

export default Card;