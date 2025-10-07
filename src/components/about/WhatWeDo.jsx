import Objective from "./Objective";
import WhatWeDoBanner from "../../assets/What-we-do.png"

const objectives = [
    { description: "Reward users for watching videos, engaging with content, and referring others." },
    { description: "Build a vibrant network of like-minded entrepreneurs." },
    { description: "Provide tools and opportunities that drive economic growth across Africa." },];

const WhatWeDo = () => {
    return (
        <div className="bg-[#020109] grid md:grid-cols-2 lg:gap-12 md:gap-8 gap-6 lg:px-16 md:px-8 px-4">
            <img src={WhatWeDoBanner} alt="EXGEID What We Do Banner" className="order-2 md:order-1 md:pt-48"/>
            <div className="order-1 md:order-2 md:pt-24 lg:w-[80%] pt-12 md:pb-12">
                <h2 className="font-bold text-white lg:text-[34px] md:text-[25.5px] text-[22.26px]">What we do</h2>
                <div>
                    {objectives.map((objective, i) => (
                        <div key={i}>
                            <Objective description={objective.description} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhatWeDo;