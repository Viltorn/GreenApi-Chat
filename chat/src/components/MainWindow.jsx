import React, {
  useEffect,
  useCallback,
  useContext,
} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes';
import ChatsList from './ChatsList.jsx';
import Messages from './Messages.jsx';
import { actions as chatsActions } from '../slices/chatsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import getModal from '../modals/index.js';
import authContext from '../contexts/authContext.js';
import getAuthToken from '../utils/getAuthToken.js';

const MainWindow = ({ notify }) => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { logOut } = useContext(authContext);
  const { idInstance, apiTokenInstance } = getAuthToken();
  const navigate = useNavigate();

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal notify={notify} />;
  };

  const showError = useCallback((e) => {
    notify(e);
  }, [notify]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get([
          `${routes.basePath()}${idInstance}`,
          'getContacts',
          `${apiTokenInstance}`,
        ].join('/'));
        const { data } = response;
        dispatch(chatsActions.addChats(data));
      } catch (e) {
        showError(e.message);
        console.log(e);
        logOut();
        navigate('/');
      }
    };
    getData();
  }, [apiTokenInstance, idInstance, navigate, logOut, showError, dispatch]);

  useEffect(() => {
    const deletNotPath = [
      `${routes.basePath()}${idInstance}`,
      'deleteNotification',
      `${apiTokenInstance}`,
    ].join('/');

    const getNotpath = [
      `${routes.basePath()}${idInstance}`,
      'receiveNotification',
      `${apiTokenInstance}`,
    ].join('/');

    const getNotification = async () => {
      console.log('Waiting incoming notifications...');
      axios.get(getNotpath)
        .then((response) => {
          const webhookData = response.data;
          const defaultId = 0;
          if (webhookData) {
            const webhookId = webhookData.receiptId;
            const { typeWebhook } = webhookData.body;
            if (typeWebhook === 'stateInstanceChanged' && webhookData.stateInstance === 'notauthorized') {
              showError('notAuthorizedError');
            }
            if (typeWebhook === 'incomingMessageReceived') {
              const { senderName } = webhookData.body.senderData;
              const { idMessage } = webhookData.body;
              const { chatId } = webhookData.body.senderData;
              const body = webhookData.body.messageData.textMessageData.textMessage;
              dispatch(messagesActions.addMessage({
                idMessage,
                body,
                chatId,
                senderName,
                status: '',
              }));
            }
            return webhookId;
          }
          return defaultId;
        })
        .then((webhookId) => axios.delete(`${deletNotPath}/${webhookId}`))
        .then(() => setTimeout(() => getNotification(), 3000))
        .catch((e) => {
          showError(e.message);
          logOut();
          navigate('/');
          console.log(e);
        });
    };

    //   try {
    //   // Method waits for 20 sec and returns empty string if there were no sent messages
    //     const response = await axios.get(getNotpath);
    //     const webhookData = response.data;
    //     if (webhookData) {
    //       const webhookId = webhookData.receiptId;
    //       const { typeWebhook } = webhookData.body;
    //       if (typeWebhook === 'stateInstanceChanged') {
    //         if (webhookData.stateInstance === 'notauthorized') {
    //           const deleteNotification = await axios.delete(`${deletNotPath}/${webhookId}`);
    //           if (deleteNotification.status === 200) {
    //             throw new Error('notAuthorized');
    //           }
    //         } else {
    //           await axios.delete(`${deletNotPath}/${webhookId}`);
    //         }
    //       } else if (typeWebhook === 'incomingMessageReceived') {
    //         const { senderName } = webhookData.body.senderData;
    //         const { idMessage } = webhookData.body;
    //         const { chatId } = webhookData.body.senderData;
    //         const sender = senderName !== '' ? senderName : chatId;
    //         const body = webhookData.body.messageData.textMessageData.textMessage;
    //         dispatch(messagesActions.addMessage({
    //           idMessage,
    //           body,
    //           chatId,
    //           sender,
    //           status: '',
    //         }));
    //         const deleteNotification = await axios.delete(`${deletNotPath}/${webhookId}`);
    //         if (deleteNotification.status === 200) {
    //           setTimeout(() => getNotification(), 3000);
    //         }
    //       }
    //     } else {
    //       setTimeout(() => getNotification(), 3000);
    //     }
    //   } catch (e) {
    //     showError(e.message);
    //     logOut();
    //     console.log(e);
    //   }
    // };
    getNotification();
  }, [apiTokenInstance, dispatch, idInstance, logOut, showError, navigate]);

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-xl-row">
          <ChatsList notify={notify} />
          <Messages notify={notify} />
        </div>
      </div>
      {renderModal(isOpened, type)}
    </>
  );
};
export default MainWindow;
