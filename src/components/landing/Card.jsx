const Card = ({ imageURL, title }) => {
    return(
        <div className="w-[85%] lg:p-4 md:p-3 p-2 font-semibold lg:text-[13.96px] md:text-[8.53px] text-[7.63px] text-white text-center bg-[#09052C] lg:leading-[28.79px] md:leading-[16.54px] md:leading-[14.78px]">
            <img src={imageURL} alt="Card Image" className="mx-auto w-full"/>
            <p className="lg:mt-4 md:mt-3 mt-2">{title}</p>
        </div>
    );
};

export default Card;