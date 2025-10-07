const Task = ({ icon, title, description, image }) => {
  return (
    <div className="lg:mb-8 mb-4">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-2">
            <img src={icon} alt="Task Icon"/>
            <h2 className="font-bold text-white lg:text-[19.05px] md:text-[16px] text-[14px]">{title}</h2>
        </div>

        {/* Description */}
        <p className="font-medium text-[#A9A8CD] lg:text-[15.24px] md:text-[14px] text-[10px] mb-4">{description}</p>

        {/*Image*/}
        <img
            src={image}
            alt={`Task image`}
            className="w-full h-full object-cover"
        />
    </div>
  );
};

export default Task;
