import { createContext } from 'react';

const ModalContext = createContext({
  openModal: () => {},
});

export default ModalContext;