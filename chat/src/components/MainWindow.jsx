import React, { useEffect, useCallback } from 'react'; /* useContext */
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes';
import ChatsList from './ChatsList.jsx';
import Messages from './Messages.jsx';
import { actions as chatsActions } from '../slices/chatsSlice.js';
// import { actions as messagesActions } from '../slices/messagesSlice.js';
import getModal from '../modals/index.js';
// import authContext from '../contexts/authContext.js';
import getAuthToken from '../utils/getAuthToken.js';

const MainWindow = ({ notify }) => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  // const { logOut } = useContext(authContext);
  const { idInstance, apiTokenInstance } = getAuthToken();

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal notify={notify} />;
  };

  const showNetworkError = useCallback(() => {
    notify('error');
  }, [notify]);

  // const showAuthError = useCallback(() => {
  //   notify('notAuthorized');
  // }, [notify]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get([
          `${routes.basePath()}${idInstance}`,
          'getContacts',
          `${apiTokenInstance}`,
        ].join('/'));
        const data = response.body;
        dispatch(chatsActions.addChats(data));
      } catch (err) {
        showNetworkError();
        throw Error('NetworkError');
      }
    };
    getData();
  });

  useEffect(() => {
    // const getNotification = () => {
    //   const response = axios.get(routes.recieveNotPath())
    //     .then((res) => {
    //       const webhookBody = res.body;
    //       if (webhookBody) {
    //         const webhookId = response.receiptId;
    //         const { typeWebhook } = webhookBody;
    //         if (typeWebhook === 'stateInstanceChanged') {
    //           if (webhookBody.stateInstance === 'notauthorized') {
    //             logOut();
    //             showAuthError();
    //           }
    //         } else if (typeWebhook === 'incomingMessageReceived') {
    //           dispatch(findDispatchRoute(typeWebhook));
    //         }
    //         return webhookId;
    //       }
    //     })
    //     .then((res) => axios.delete(routes.deletNotPath(res)))
    //     .finally(() => setTimeout(() => getNotification(), 3000));
    // };
    // const getNotification = async () => {
    //   try {
    //   // Method waits for 20 sec and returns empty string if there were no sent messages
    //     console.log('Waiting incoming notifications...');
    //     const response = await axios.get([
    //       `${routes.basePath()}${idInstance}`,
    //       'receiveNotification',
    //       `${apiTokenInstance}`,
    //     ].join('/'));
    //     const webhookBody = response.body;
    //     if (webhookBody) {
    //       const webhookId = response.receiptId;
    //       const { typeWebhook } = webhookBody;
    //       if (typeWebhook === 'stateInstanceChanged') {
    //         if (webhookBody.stateInstance === 'notauthorized') {
    //           const deleteNotification = await axios.delete(routes.deletNotPath(webhookId));
    //           if (deleteNotification.status === 'ok') {
    //             logOut();
    //             showAuthError();
    //           }
    //         } else {
    //           await axios.delete(routes.deletNotPath(webhookId));
    //         }
    //       } else if (typeWebhook === 'incomingMessageReceived') {
    //         const { senderName } = webhookBody.senderData;
    //         const { idMessage } = webhookBody;
    //         const { chatId } = webhookBody.senderData;
    //         const sender = senderName !== '' ? senderName : chatId;
    //         const body = webhookBody.messageData.textMessageData.textMessage;
    //         dispatch(messagesActions.addMessage({
    //           idMessage,
    //           body,
    //           chatId,
    //           sender,
    //           status: '',
    //         }));
    //         const deleteNotification = await axios.delete(routes.deletNotPath(webhookId));
    //         if (deleteNotification.status === 'ok') {
    //           setTimeout(() => getNotification(), 3000);
    //         }
    //       }
    //     } else {
    //       setTimeout(() => getNotification(), 3000);
    //     }
    //   } catch (e) {
    //     showNetworkError();
    //     console.log(e);
    //   }
    // };
    // getNotification();
  });

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <ChatsList />
          <Messages notify={notify} />
        </div>
      </div>
      {renderModal(isOpened, type)}
    </>
  );
};
export default MainWindow;
