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

const getMessageBody = (data) => {
  const type = data.typeMessage;
  switch (type) {
    case 'audioMessage':
      return { msgType: type, body: data.fileMessageData.downloadUrl };
    case 'textMessage':
      return { msgType: 'textMessage', body: data.textMessageData.textMessage };
    default:
      return { msgType: 'textMessage', body: '<wrong message format>' };
  }
};

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

  const processError = useCallback((errMessage) => {
    showError(errMessage);
    logOut();
    navigate('/');
    console.log(errMessage);
  }, [logOut, showError, navigate]);

  const processWebhookData = useCallback((webhookData) => {
    const { typeWebhook } = webhookData.body;
    if (typeWebhook === 'stateInstanceChanged' && webhookData.stateInstance === 'notauthorized') {
      processError('notAuthorizedError');
    }
    if (typeWebhook === 'incomingMessageReceived') {
      const { senderName } = webhookData.body.senderData;
      const { idMessage } = webhookData.body;
      const { chatId } = webhookData.body.senderData;
      const { body, msgType } = getMessageBody(webhookData.body.messageData);
      dispatch(messagesActions.addMessage({
        idMessage,
        body,
        chatId,
        senderName,
        status: '',
        msgType,
      }));
    }
  }, [dispatch, processError]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(routes.getContactsPath(idInstance, apiTokenInstance));
        const { data } = response;
        dispatch(chatsActions.addChats(data));
      } catch (e) {
        processError(e.message);
      }
    };
    getData();
  }, [apiTokenInstance, idInstance, dispatch, processError]);

  useEffect(() => {
    const getNotification = async () => {
      try {
        const response = await axios.get(routes.getNotifPath(idInstance, apiTokenInstance));
        if (response) {
          console.log(response);
          console.log(1);
          const webhookData = response.data;
          const defaultId = 0;
          const webhookId = webhookData ? webhookData.receiptId : defaultId;
          if (webhookData) {
            processWebhookData(webhookData);
          }
          await axios.delete(routes.deleteNotifPath(idInstance, apiTokenInstance, webhookId));
          setTimeout(() => getNotification(), 3000);
        }
      } catch (e) {
        processError(e.message);
      }
    };

    getNotification();
  }, [apiTokenInstance, dispatch, idInstance, processError, processWebhookData]);

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
