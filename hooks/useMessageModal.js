import { useState, useEffect } from 'react';
import useToggle from './useToggle';

const useMessageModal = (initialMode = false, initialMessage = "", closeAfter = 3500) => {
  const [modalOpen, setModalOpen] = useToggle(initialMode);
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {

    // if (modalOpen) {
    //   setTimeout(() => {
    //     setModalOpen(false);
    //   }, closeAfter);
    // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  return { modalOpen, setModalOpen, message, setMessage }
}

export default useMessageModal;
