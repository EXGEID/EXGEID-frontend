const ReferralSteps = () => {
  const steps = [
    { level: "01", text: "Level 1 ₦500" },
    { level: "02", text: "Level 2 ₦1000" },
    { level: "03", text: "Level 3 ₦1500" },
    { level: "04", text: "Level 4 ₦2000" },
  ];

  return (
    <div className="flex justify-center gap-8 mt-6 flex-wrap">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-5 border-gray-500 flex items-center justify-center text-lg font-bold">
            {step.level}
          </div>
          <p className="text-xs text-gray-400 mt-2">{step.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReferralSteps;
