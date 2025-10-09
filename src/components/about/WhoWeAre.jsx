import WhoWeAreBanner from "../../assets/Who-we-are.png"

const WhoWeAre = () => {
    return (
        <section className="bg-[#06031E] flex flex-col md:flex-row justify-between lg:px-24 md:px-16 px-6 lg:pt-32 md:py-24 pt-32 lg:pb-4 pb-6">
            <div className="lg:w-[38%] lg:mt-24 md:mb-12">
                <h1 className="text-[#FEC84D] lg:mt-0 md:mt-[-48px] font-semibold lg:text-[48px] md:text-[36px] text-[24px] lg:leading-[69px] md:leading-[51.75px] leading-[38.81px] lg:mb-4 mb-2">Who We Are</h1>
                <p className="text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] lg:mb-4 mb-2">EXGEID Africa is a cooperative society and digital platform built to empower a new generation of skilled and unskilled entrepreneurs across Africa and the diaspora. We combine technology, teamwork, and financial incentives to create a system where everyday actions lead to real earnings and real impact.</p>
                <p className="text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px]">We're not just helping people earn — we're building a powerful movement of growth, empowerment, and collaboration.</p>
            </div>
            <img alt="EXGEID Who We Are Banner" src={WhoWeAreBanner} className="md:w-[60%] h-[60%]"/>
        </section>
    );
};

export default WhoWeAre;