import Card from "./ValueCard";

const cards = [
    { title: "Love", description: "We value people and communities" },
    { title: "Integrity", description: "We operate with transparency and honesty" },
    { title: "Focus", description: "We stay committed to your success" },
    { title: "Empathy", description: "We understand your journey and support your goals" },
   ];

const CoreValues = () => {
    return (
        <div className="bg-[#06031E] lg:py-20 md:py-16 py-8 lg:px-24 md:px-8 px-4">
            <h2 className="font-bold text-white lg:text-[34px] md:text-[25.5px] text-[22.26px] lg:mb-16 md:mb-12 mb-6 lg:text-left text-center">Our Core Values</h2>
            <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-12 md:gap-6 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="">
                        <Card title={card.title} description={card.description} type={i % 2 === 0 ? "slideLeft": "slideUp"} delay={i + 2} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoreValues;