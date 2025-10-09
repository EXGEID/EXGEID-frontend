import { useState, useEffect } from 'react';

const WithdrawalRequirementsModal = ({ onClose }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /*const handleOverlayClick = (e) => {
    e.stopPropagation(); // Prevent closing when clicking inside modal
  };*/

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[45%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[80vh]`}
      >
        <div className="overflow-hidden max-h-[80vh] px-4 md:px-8 py-12 md:pt-16 lg:pt-14 md:pb-16 lg:pb-16">
          <h2 className="lg:text-[32px] md:text-[27.92px] text-[24px] font-semibold text-[#E9E2E2] lg:mb-6 mb-2">Exgeid Withdrawal Requirements </h2>
          <div className="overflow-y-auto lg:max-h-[50vh] max-h-[60vh] pr-4 md:pr-12 text-[#CACACA] text-[12px] md:text-[16px] lg:text-[18px]">
            <p className="my-1 md:my-2">1. First withdrawals are only available from after 90 days(3 months).</p>
            <p className="my-1 md:my-2">2. Complete all tasks for your level (referrals, videos, follows, groups).</p>
            <p className="my-1 md:my-2">3. Level 4 payout: ₦180,000</p>
            <p className="my-1 md:my-2">4. Level 5 payout: ₦100,000/month (with daily tasks).</p>
            <p className="my-1 md:my-2">5. Account name must match your registration details.</p>
            <p className="my-1 md:my-2">6. Use your registered password to withdraw.</p>
            <p className="my-1 md:my-2">7. Payments: Monthly.</p>
            <p className="my-1 md:my-2">8. Processing time: 24–72 hours after verification.</p>
          </div>

        
        </div>
      </div>
    </div>
  );
};


export default WithdrawalRequirementsModal;