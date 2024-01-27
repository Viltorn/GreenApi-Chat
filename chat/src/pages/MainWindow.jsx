import React, {
  useEffect,
  useCallback,
} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { actions as messagesActions } from '../store/slices/messagesSlice.js';
import getAuthToken from '../utils/getAuthToken.js';
import routes from '../api/routes.js';
import ChatsList from '../components/ChatsList.jsx';
import Messages from '../components/Messages.jsx';
import getMessageBody from '../utils/helpers/getMessageBody.js';
import getModal from '../modals/index.js';

const MainWindow = ({ notify, processError }) => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { idInstance, apiTokenInstance } = getAuthToken();

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal notify={notify} />;
  };

  const addNewMessage = useCallback((webhookData) => {
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
    const getNotification = async () => {
      try {
        const response = await axios.get(routes.getNotifPath(idInstance, apiTokenInstance));
        if (response.status === 200) {
          const webhookData = response.data;
          const defaultId = 0;
          const webhookId = webhookData ? webhookData.receiptId : defaultId;
          if (webhookData) {
            addNewMessage(webhookData);
          }
          await axios.delete(routes.deleteNotifPath(idInstance, apiTokenInstance, webhookId));
          setTimeout(() => getNotification(), 3000);
        }
      } catch (e) {
        processError(e.message);
      }
    };

    getNotification();
    // eslint-disable-next-line
  }, []);

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
