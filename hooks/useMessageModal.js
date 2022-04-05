import { useState } from 'react';
import useToggle from './useToggle';

const useMessageModal = (initialMode = false, initialMessage = "") => {
  const [modalOpen, setModalOpen] = useToggle(initialMode);
  const [message, setMessage] = useState(initialMessage);

  return { modalOpen, setModalOpen, message, setMessage }
}

export default useMessageModal;
