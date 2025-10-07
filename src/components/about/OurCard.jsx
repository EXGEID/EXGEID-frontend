const Card = ({ title, description }) => {
    return (
        <div className="bg-[#0C063B] lg:h-48 md:h-44 text-center text-white lg:pt-8 md:pt-6 pt-4 lg:pb-16 md:pb-10 pb-6 lg:px-12 md:px-8 px-10">
            <h2 className="font-bold lg:text-[19.69px] md:text-[14.28px] text-[11.22px] lg:mb-6 mb-3">{title}</h2>
            <p className="font-medium lg:text-[16px] md:text-[12px] text-[11.22px] mb-4">{description}</p>
        </div>
    );
};

export default Card;