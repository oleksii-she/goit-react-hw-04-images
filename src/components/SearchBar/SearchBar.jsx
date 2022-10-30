import { FaSearchMinus } from 'react-icons/fa';
import css from './SearchBar.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';

export const SearchBar = ({ onSubmitSearchBar }) => {
  const initialValues = {
    value: '',
  };

  const handleSubmit = (values, { resetForm }) => {
    const { value } = values;
    if (value.trim() === '') {
      return toast.error('Type something', {
        position: 'top-right',
      });
    }

    onSubmitSearchBar(value);
    resetForm();
  };

  return (
    <header className={css.Searchbar}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form className={css.search_form}>
          <button type="submit" className={css.searchForm_button}>
            <FaSearchMinus />
          </button>
          <Field
            className={css.SearchForm_input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            name="value"
          />
          <Toaster />
        </Form>
      </Formik>
    </header>
  );
};
