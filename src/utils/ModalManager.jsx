import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ModalContext from './ModalContext';
import LoginModal from '../components/LoginForm';
import SignupModal from '../components/SignUpForm';
import ForgotPasswordModal from '../components/ForgotPassword';
import PasswordEmailVerificationModal from '../components/PasswordEmailVerification';
import ResetPasswordModal from '../components/ResetPassword';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import VideoPlayerModal from '../components/VideoPlayer';
import TaskPrerequisitesModal from '../components/TaskPrerequisites';
import WithdrawalRequirementsModal from '../components/WithdrawalRequirements';

function ModalManager() {
  const [modalStack, setModalStack] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modalsFromUrl = params.get('modal')?.toLowerCase().split(',').filter(Boolean) || [];
    const token = params.get('token');
    const email = params.get('email');
    const accessToken = params.get('accessToken');
    console.log('URL Params:', { modalsFromUrl, token, email, accessToken }); // Debug
    if (modalsFromUrl.length > 0) {
      setModalStack((prev) => {
        const currentModals = prev.map((modal) => modal.name);
        if (currentModals.join(',') === modalsFromUrl.join(',')) {
          console.log('URL modals match current stack, skipping:', modalsFromUrl); // Debug
          return prev;
        }
        const newStack = modalsFromUrl.map((name) => ({
          name: name.toLowerCase(),
          data: { token, email, accessToken },
        }));
        console.log('Setting modalStack from URL:', newStack); // Debug
        return newStack;
      });
    }
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modalNames = modalStack.length > 0 ? modalStack[modalStack.length - 1].name.toLowerCase() : '';
    if (modalNames) {
      params.set('modal', modalNames);
      // Preserve accessToken only for reset-password modal
      if (modalNames !== 'reset-password') {
        params.delete('accessToken');
      }
    } else {
      params.delete('modal');
      params.delete('token');
      params.delete('email');
      params.delete('accessToken');
    }
    const currentPath = location.pathname === '/' ? '' : location.pathname;
    const newUrl = params.toString() ? `${currentPath || '/'}?${params.toString()}` : currentPath || '/';
    console.log('Updating URL from modalStack change:', { currentPath, params: params.toString(), newUrl }); // Debug
    window.history.pushState({}, document.title, newUrl);
  }, [modalStack, location.pathname, location.search]);

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
    <ModalContext.Provider value={{ openModal }}>
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
                    initialData={modal.data}
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
            {modal?.name === 'watch-video' && (
                <VideoPlayerModal
                    onClose={closeTopModal}
                    initialData={modal.data}
                />
            )}
            {modal?.name === 'task-prerequisites' && (
                <TaskPrerequisitesModal
                    onClose={closeTopModal}
                />
            )}
        </div>
      ))}
    </ModalContext.Provider>
  );
}

export default ModalManager;
