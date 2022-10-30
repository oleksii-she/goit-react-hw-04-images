import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './modal.module.css';
const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ children, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', hendleKeyDown);
    return () => {
      window.removeEventListener('keydown', hendleKeyDown);
    };
  }, []);
  function hendleKeyDown(e) {
    if (e.code === 'Escape') {
      onClose();
    }
  }

  function onCloseOverlay(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className={css.Overlay} onClick={e => onCloseOverlay(e)}>
      <div className={css.Modal}>{children}</div>
    </div>,
    modalRoot
  );
};
