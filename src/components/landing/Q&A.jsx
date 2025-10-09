import { useState } from "react";
import FadeInSection from "../FadeInSection";

const QuestionAndAnsweerBoxes = ({ question, answer, type, delay }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <FadeInSection type={type} delay={delay} className="w-full bg-[#06031E] border border-[#7E868B3D] border-b-4 border-r-2 lg:mb-4 mb-2 rounded-2xl hover:scale-105">
            <div className="lg:pl-16 pl-4 lg:pr-16 pr-8 lg:pt-6 pt-6 lg:pb-6 pb-4 flex">
                <label className="flex-grow font-medium text-[#CACACA] lg:text-[16px] md:text-[14px] text-[10.54px]">{question}</label>
                <button
                    className="font-bold lg:text-4xl text-[#CACACA] text-2xl ml-2 lg:mt-[-12px] mt-[-15px]" 
                    onClick={() => setShowAnswer(obj => !obj)}>
                        {showAnswer ? "-" : "+" }
                </button>
            </div>
            {showAnswer && 
                <FadeInSection type="slideDown" className="lg:pl-4 pl-2 lg:pt-6 pt-4 lg:pb-6 pb-4 border border-gray-900 border-t-4">
                    <label className="font-medium text-[#CACACA] lg:text-[16px] md:text-[14px] text-[10.54px]">{answer}</label>
                </FadeInSection>
            }
        </FadeInSection>
    );
};

export default QuestionAndAnsweerBoxes;