import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoginModal from '../components/LoginForm';
import SignupModal from '../components/SignUpForm';
import ForgotPasswordModal from '../components/ForgotPassword';
import PasswordEmailVerificationModal from '../components/PasswordEmailVerification';
import ResetPasswordModal from '../components/ResetPassword';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import WithdrawalRequirementsModal from '../components/WithdrawalRequirements';

function ModalManager() {
  const [modalStack, setModalStack] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modalsFromUrl = params.get('modal')?.toLowerCase().split(',').filter(Boolean) || [];
    const token = params.get('token');
    const email = params.get('email');
    console.log('URL Params:', { modalsFromUrl, token, email }); // Debug
    if (modalsFromUrl.length > 0) {
      setModalStack((prev) => {
        const currentModals = prev.map((modal) => modal.name);
        if (currentModals.join(',') === modalsFromUrl.join(',')) {
          console.log('URL modals match current stack, skipping:', modalsFromUrl); // Debug
          return prev;
        }
        const newStack = modalsFromUrl.map((name) => ({
          name: name.toLowerCase(),
          data: { token, email },
        }));
        console.log('Setting modalStack from URL:', newStack); // Debug
        return newStack;
      });
    }
  }, [location]);

 useEffect(() => {
    //const modalNames = modalStack.map((modal) => modal.name.toLowerCase()).join(',');
    const modalNames = modalStack.length > 0 ? modalStack[modalStack.length - 1].name.toLowerCase() : '';
    const currentPath = location.pathname === '/' ? '' : location.pathname;
    const newUrl = modalNames ? `${currentPath || '/'}?modal=${modalNames}` : currentPath || '/';
    console.log('Updating URL from modalStack change:', { currentPath, newUrl }); // Debug
    window.history.pushState({}, document.title, newUrl);
  }, [modalStack, location.pathname]);

  const openModal = (modalName, data = {}) => {
    console.log('Opening modal:', modalName, data); // Debug
    const normalizedName = modalName.toLowerCase();
    setModalStack((prev) => {
      const newStack = [...prev, { name: normalizedName, data }];
      console.log('New modalStack:', newStack); // Debug
      return newStack;
    });
  };

  const closeTopModal = () => {
    console.log('closeTopModal called - Current modalStack:', modalStack); // Debug
    setModalStack((prev) => {
      if (prev.length === 0) {
        console.warn('modalStack is empty, cannot close'); // Debug
        return prev;
      }
      const newStack = prev.slice(0, -1);
      console.log('New modalStack after closing:', newStack); // Debug
      return newStack;
    });
  };

  const closeCurrentAndOpenNext = (nextModal, data = {}) => {
    console.log('Replacing modal with:', nextModal, data); // Debug
    const normalizedName = nextModal.toLowerCase();
    setModalStack((prev) => {
      const newStack = [...prev.slice(0, -1), { name: normalizedName, data }];
      console.log('New modalStack after replacing:', newStack); // Debug
      return newStack;
    });
  };

  const visibleModals = modalStack.slice(-2);
  console.log('Rendering - Visible modals:', visibleModals); // Debug

  return (
    <>
      <Outlet /> {/* Renders MainLayout and its nested routes */}
      {/*{modalStack.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />
      )}*/}
      {visibleModals.map((modal, index) => (
        <div key={modal.name + index} style={{ zIndex: 1000 + index }}>
            {modal?.name === 'login' && (
                <LoginModal
                onClose={closeTopModal}
                onSuccess={closeCurrentAndOpenNext}
                openModal={openModal}
                closeCurrentAndOpenNext={closeCurrentAndOpenNext}
                />
            )}
            {modal?.name === 'signup' && (
                <SignupModal
                    onClose={closeTopModal}
                    openModal={openModal}
                    closeCurrentAndOpenNext={closeCurrentAndOpenNext}
                />
            )}
            {modal?.name === 'forgot-password' && (
                <ForgotPasswordModal
                    onClose={closeTopModal}
                    onSuccess={closeCurrentAndOpenNext}
                />
            )}
            {modal?.name === 'password-change-email-verification' && (
                <PasswordEmailVerificationModal
                    onClose={closeTopModal}
                    onResend={closeCurrentAndOpenNext}
                    initialData={modal.data}
                />
            )}
            {modal?.name === 'reset-password' && (
                <ResetPasswordModal
                    onClose={closeTopModal}
                    onSuccess={closeCurrentAndOpenNext}
                />
            )}
            {modal?.name === 'terms-and-conditions' && (
                <TermsAndConditionsModal
                    onClose={closeTopModal}
                />
            )}
            {modal?.name === 'withdrawal-requirements' && (
                <WithdrawalRequirementsModal
                    onClose={closeTopModal}
                />
            )}
            {modal?.name === 'settings' && (
                <SettingsModal
                    onClose={closeTopModal}
                    initialData={modal.data}
                />
            )}
        </div>
      ))}
    </>
  );
}

export default ModalManager;