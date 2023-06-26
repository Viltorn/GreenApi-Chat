import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
} from 'react-bootstrap';
import { actions as modalActions } from '../slices/modalsSlice';
import { actions as chatsActions } from '../slices/chatsSlice.js';
import { chatsNamesSchema } from '../utils/validation';

const RenameChannel = ({ notify }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { currentChats } = useSelector((state) => state.chatsReducer);
  const { id } = useSelector((state) => state.modalsReducer);
  const chatNames = currentChats.map((chat) => chat.name);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      chatName: '',
    },
    validationSchema: chatsNamesSchema(chatNames),
    onSubmit: ({ chatName }) => {
      dispatch(chatsActions.changeName({ chatName, id }));
      handleClose();
      notify('rename');
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('RenameChat')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <FormGroup>
              <FormControl
                id="chatName"
                type="text"
                ref={inputEl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.chatName}
                data-testid="input-body"
                isInvalid={formik.errors.chatName}
                name="chatName"
                className="mb-2"
              />
              {formik.errors.chatName ? (
                <div className="invalid-feedback">{t(`errors.${formik.errors.chatName}`)}</div>
              ) : null}
              <FormLabel htmlFor="chatName" className="visually-hidden">{t('ChatName')}</FormLabel>
              <FormGroup className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2" data-bs-dismiss="modal">{t('Cancel')}</Button>
                <Button variant="primary" type="submit">{t('Send')}</Button>
              </FormGroup>
            </FormGroup>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
