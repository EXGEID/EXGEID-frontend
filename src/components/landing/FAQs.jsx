import QuestionAndAnsweerBoxes from "./Q&A";
import FadeInSection from "../FadeInSection";

const FrequentlyAskedQuestions = () => {
    const QandAs = [
        {question: "What is EXGEID Africa?", answer: ""},
        {question: "How do I earn?", answer: ""},
        {question: "How much can I earn?", answer: ""},
        {question: "When can I withdraw?", answer: ""},
        {question: "Is it free to join?", answer: ""},
        {question: "How long does it take to level up?", answer: ""},
        {question: " What kind of daily tasks are there?", answer: ""}
    ];

    return (
        <div className="bg-[#09052C]">
            <div className="grid md:grid-cols-2 lg:px-44 px-4 lg:py-24 md:py-8 py-4 lg:gap-8 gap-4 justify-center items-center">
                <FadeInSection type="slideLeft" className="lg:w-[70%]">
                    <h2 className="lg:font-bold font-semibold text-[#CACACA] lg:text-[52.65px] text-[35.46px] lg:mb-4 mb-2">Frequently Asked Questions</h2>
                    <p className="font-regular text-[#A9A8CD] lg:text-[18px] text-[14px]">A community where you earn cash by completing daily tasks and inviting friends.</p>
                </FadeInSection>
                <div>
                    {QandAs.map((QandA, index) =>
                        <div>
                            <div className="md:block hidden"><QuestionAndAnsweerBoxes key={index} {...QandA} type={index % 2 === 0 ? "slideRight": "slideLeft"} delay={index + 2} /></div>
                            <div  className="md:hidden block"><QuestionAndAnsweerBoxes key={index} {...QandA} type={"slideDown"} delay={index + 2} /></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FrequentlyAskedQuestions;