import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import Chat from './Chat.jsx';

const ChatsList = ({ notify }) => {
  const { t } = useTranslation();
  const { currentChats } = useSelector((state) => state.chatsReducer);
  const dispatch = useDispatch();

  return (
    <div className="h-100 col-4 col-md-4 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('Chats')}</span>
        <button type="button" onClick={() => dispatch(modalsActions.openModal({ type: 'addChannel' }))} className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      {currentChats.length !== 0
        && (
        <ul className="nav flex-column nav-pills nav-fill px-2">
          {currentChats.map((chat) => (
            <Chat key={chat.id} chat={chat} notify={notify} />
          ))}
        </ul>
        )}
    </div>
  );
};

export default ChatsList;
