import { useEffect } from 'react';

const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    }
  
    document.addEventListener('click', handleClickOutside, true);
  
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    }
  }, [ref, onClickOutside]);
}

export default useClickOutside;
