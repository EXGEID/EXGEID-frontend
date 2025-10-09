import WhyWeExistBanner from "../../assets/portrait.png"

const WhyWeExist = () => {
    return (
        <section className="bg-[#09052C] flex">
            <img src={WhyWeExistBanner} alt="EXGEID Why We Exist Banner" className="lg:mt-48 md:mt-36 mt-34 lg:w-auto lg:h-auto w-[70%] h-[70%]"/>
            <div className="lg:mt-24 md:mt-16 mt-12 lg:mr-24 md:mr-16 mr-6 lg:ml-[-20px] ml-[-80px] lg:w-[40%]">
                <h2 className="font-black text-white lg:text-[30px] md:text-[28px] text-[13px] lg:mb-6 mb-3">Why We Exist</h2>
                <p className="text-white font-regular lg:text-[18.01px] md:text-[14px] text-[8px] lg:leading-[30.33px] md:leading-[30.33px] leading-[14.18px] lg:mb-4 mb-2">In a time when income opportunities are limited, EXGEID Africa offers a simple, structured way to earn by being active, consistent, and connected. We believe that when people work together, share resources, and support one another — incredible things happen.</p>
                <button className="bg-[#8F0406] hover:bg-red-700 hover:scale-105 text-white font-medium lg:px-4 md:px-3 px-2 lg:py-4 md:py-3 py-2 lg:w-48 md:w-32 w-20 rounded-md my-2 md:my-4 lg:text-[21.97px] md:text-[16px] text-[10.18px]">Signup</button>
            </div>
        </section>
    );
};

export default WhyWeExist;