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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(routes.getContactsPath(idInstance, apiTokenInstance));
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
    const getNotification = () => {
      console.log('Waiting incoming notifications...');
      axios.get(routes.getNotifPath(idInstance, apiTokenInstance))
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
            return webhookId;
          }
          return defaultId;
        })
        .then((webhookId) => axios
          .delete(routes.deleteNotifPath(idInstance, apiTokenInstance, webhookId)))
        .then(() => setTimeout(() => getNotification(), 3000))
        .catch((e) => {
          showError(e.message);
          logOut();
          navigate('/');
          console.log(e);
        });
    };

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
