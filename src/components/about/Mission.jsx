import Card from "./OurCard";

const cards = [
    { title: "Our Mission", description: "To provide a reliable earning platform that rewards participation while connecting entrepreneurs with opportunities that support their business growth and personal development." },
    { title: "Our Vision", description: "To empower millions of entrepreneurs through partnerships, digital tools, and task-based earnings — helping them turn time and effort into tangible value." },
   ];

const Mission = () => {
    return (
        <div className="bg-[#09052C] lg:py-20 md:py-16 py-8 lg:px-24 md:px-8 px-4 flex md:flex-row flex-col lg:gap-12 md:gap-6 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="">
                    <Card title={card.title} description={card.description} />
                </div>
            ))}
        </div>
    );
};

export default Mission;