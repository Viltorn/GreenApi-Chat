import React, { useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
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
import axios from 'axios';
import { actions as modalActions } from '../slices/modalsSlice';
import { actions as chatsActions } from '../slices/chatsSlice.js';
import { chatsSchema } from '../utils/validation.js';
import routes from '../routes';
import getAuthToken from '../utils/getAuthToken.js';

const AddChat = ({ notify }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { idInstance, apiTokenInstance } = getAuthToken();
  const { currentChats } = useSelector((state) => state.chatsReducer);
  const chatIds = currentChats.map((chat) => Number(chat.id.slice(0, 11)));

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      phone: '',
    },
    validationSchema: chatsSchema(chatIds),
    onSubmit: async ({ phone }) => {
      try {
        const whatsAppCheck = await axios
          .post(routes
            .checkWhatsAppPath(idInstance, apiTokenInstance), { phoneNumber: Number(phone) });
        console.log(whatsAppCheck.data);
        if (whatsAppCheck.data.existsWhatsapp) {
          const contactInfo = await axios
            .post(routes.getContactInfo(idInstance, apiTokenInstance), { chatId: `${phone}@c.us` });
          if (contactInfo.status === 200) {
            const { data } = contactInfo;
            const { avatar, name, chatId } = data;
            dispatch(chatsActions.addChat({
              avatar, name, id: chatId, type: 'user',
            }));
            dispatch(chatsActions.changeCurrentChat(chatId));
            notify('add');
            handleClose();
          }
        } else {
          formik.setSubmitting(false);
          notify('wrongPhone');
        }
      } catch (err) {
        console.log(err);
        notify(err.message);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('AddChat')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <FormGroup>
              <FormControl
                id="phone"
                type="text"
                ref={inputEl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                data-testid="input-body"
                name="phone"
                isInvalid={formik.errors.phone}
                className="mb-2"
              />
              {formik.errors.phone ? (
                <div className="invalid-feedback">{t(`errors.${formik.errors.phone}`)}</div>
              ) : null}
              <FormLabel htmlFor="phone" className="visually-hidden">{t('ChatNumber')}</FormLabel>
              <p className="small mb-3 text-muted">
                {t('NumberFormat')}
                : 79995556622
              </p>
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

export default AddChat;
