import { MdPersonAdd } from "react-icons/md";

const Objective = ({ description }) => {
    return (
        <div className="flex items-center justify-items-start lg:gap-4 gap-2 lg:my-6 my-2">
            <div className="flex items-center justify-center lg:w-12 lg:h-12 w-8 h-8 bg-gray-800 text-white rounded-full">
                <MdPersonAdd size={20} />
            </div>
            <div>
                <p className="lg:text-[16px] md:text-[14px] text-[10.47px] font-medium text-[#CACACA]">{description}</p>
            </div>
        </div>
    );
};

export default Objective;