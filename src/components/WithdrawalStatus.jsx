import { useState, useEffect } from 'react';
import { FaBan } from 'react-icons/fa';

const WithdrawalStatusModal = ({ onClose }) => {
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
          <h2 className="lg:text-[32px] md:text-[27.92px] text-[24px] font-semibold text-[#E9E2E2] lg:mb-6 mb-2 text-center">Exgeid Withdrawal Status </h2>
          <div className="overflow-y-auto lg:max-h-[50vh] max-h-[60vh] pr-4 md:pr-12 text-[#CACACA] text-[12px] md:text-[16px] lg:text-[18px]">
            <FaBan size={100} color="#FF0000" className='mx-auto' />
            <p className="my-4 md:my-8 text-lg text-center">Withdrawals prohibited until the end of level 10</p>
          </div>

        
        </div>
      </div>
    </div>
  );
};


export default WithdrawalStatusModal;