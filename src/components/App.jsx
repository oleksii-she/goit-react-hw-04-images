import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { pixabayApi } from './api';

import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './modal/modal';
import { Loader } from './Loader/Loader';
import { Button } from './loadMore/button';
import { ErrorUser } from './Error/ErrorUser';

import css from './app.module.css';

export const App = () => {
  const [array, setArray] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalImgSrc, setModalImgSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [hidden, setHidden] = useState(false);

  const onOpenModal = e => {
    const imgForModal = e.target.dataset.src;
    setShowModal(true);
    setModalImgSrc(imgForModal);
  };

  useEffect(() => {
    if (searchValue === '') {
      return;
    }

    apiPixabayResponce(searchValue, page);
  }, [searchValue, page]);

  const apiPixabayResponce = async (searchValue, page) => {
    try {
      setStatus('pending');

      const arrayObj = await pixabayApi(searchValue, page);

      if (arrayObj.hits.length > 0) {
        setArray(prevState => [...prevState, ...arrayObj.hits]);
        setStatus('resolved');
      } else {
        toast.error(
          `Sorry, but nothing was found for your query ${searchValue}`,
          { position: 'top-right' }
        );
        setStatus('idle');
        return;
      }

      if (Math.round(arrayObj.totalHits / 12) < page) {
        toast.error(
          `We are sorry, but you have reached the end of search results`,
          { position: 'top-right' }
        );
        setHidden(false);
      }
      if (arrayObj.hits.length > 11) {
        setHidden(true);
      }
    } catch (error) {
      setStatus('rejected');
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    setModalImgSrc('');
  };

  const hendlerFormSubmit = value => {
    if (searchValue !== value) {
      setSearchValue(value);
      setArray([]);
      setPage(1);
    }
  };

  const loadMore = () => {
    setPage(p => p + 1);

    if (page > 1) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  if (status === 'rejected') {
    return (
      <div className={css.App}>
        <SearchBar onSubmit={hendlerFormSubmit} />
        <ErrorUser />
      </div>
    );
  }

  return (
    <div className={css.App}>
      <SearchBar onSubmitSearchBar={hendlerFormSubmit} />
      {searchValue && <ImageGallery data={array} clickModal={onOpenModal} />}
      {hidden === true && <Button loadMore={loadMore} />}
      {showModal && (
        <Modal onClose={onCloseModal}>
          <img src={modalImgSrc} alt="" />
        </Modal>
      )}
      {status === 'pending' && <Loader />}
    </div>
  );
};
