import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Message from './Message.jsx';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import routes from '../routes';
import getAuthToken from '../utils/getAuthToken.js';

const Messages = ({ notify }) => {
  const { t } = useTranslation();
  const senderName = t('User');
  const dispatch = useDispatch();
  const { currentChatId } = useSelector((state) => state.chatsReducer);
  const chatName = useSelector((state) => state.chatsReducer.currentChats
    .reduce((acc, chat) => {
      acc = chat.id === currentChatId ? chat.name : acc;
      return acc;
    }, ''));
  const { idInstance, apiTokenInstance } = getAuthToken();

  const messages = useSelector((state) => state.messagesReducer.messages
    .filter((message) => message.chatId === currentChatId));

  const inputEl = useRef();
  const formEl = useRef();

  useEffect(() => {
    if (currentChatId !== '') {
      inputEl.current.focus();
    }
  }, [currentChatId]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }) => {
      try {
        const path = [
          `${routes.basePath()}${idInstance}`,
          'sendMessage',
          `${apiTokenInstance}`,
        ].join('/');
        const response = await axios.post(`${path}`, {
          message: body,
          chatId: currentChatId,
        });
        console.log(response);
        if (response.status === 200) {
          const { idMessage } = response.data;
          dispatch(messagesActions.addMessage({
            idMessage,
            body,
            chatId: currentChatId,
            senderName,
            status: 'user',
          }));
        }
      } catch (e) {
        notify('error');
      }
      formik.handleReset();
      inputEl.current.focus();
      formik.setSubmitting(false);
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            {chatName
              && (
                <b>
                  #
                  {' '}
                  {chatName}
                </b>
              )}
            {currentChatId === ''
                && (
                  <b>
                    {t('ChooseChat')}
                  </b>
                )}
          </p>
          <span className="text-muted">
            {t('messages.counter', { count: messages.length })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {messages.map((message) => <Message key={message.idMessage} message={message} />)}
        </div>
        <div className="mt-auto px-5 py-3">
          {currentChatId !== '' && (
          <Form ref={formEl} onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control
                className="border-0 p-0 ps-2 form-control"
                onChange={formik.handleChange}
                aria-label="Новое сообщение"
                value={formik.values.body}
                placeholder={t('EnterMessage')}
                name="body"
                id="body"
                autoComplete="body"
                required
                ref={inputEl}
              />
              <button
                type="submit"
                disabled={!formik.dirty || formik.isSubmitting}
                className="btn btn-light btn-group-vertical"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">{t('Send')}</span>
              </button>
            </Form.Group>
          </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
