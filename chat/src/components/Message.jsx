import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '../assets/DefaultAvatar.png';
import voiceMsg from '../assets/VoiceMsg.png';

const Message = ({ message }) => {
  const { currentChats } = useSelector((state) => state.chatsReducer);
  const { t } = useTranslation();
  const {
    body,
    senderName,
    idMessage,
    chatId,
    status,
    msgType,
  } = message;
  const currentChat = currentChats.find((chat) => chat.id === chatId);
  const avatar = currentChat.avatar || '';
  const classes = cn({
    'text-success': status === 'user',
  });

  return (
    <div key={idMessage} className="text-break mb-2">
      {status === 'user'
        && (<b className={classes}>{senderName}</b>
        )}
      {(status !== 'user' && avatar !== '')
        && (<img src={avatar} className="rounded-circle img-fluid" style={{ height: '30px', width: '30px' }} alt={t('Avatar')} />
        )}
      {(status !== 'user' && avatar === '')
      && (<img src={defaultAvatar} className="rounded-circle img-fluid" style={{ height: '30px', width: '30px' }} alt={t('Avatar')} />
      )}
      :&nbsp;
      {msgType === 'textMessage' && body}
      {msgType === 'audioMessage' && <a href={body} rel="noreferrer" target="_blank"><img src={voiceMsg} alt="voice message" style={{ height: '30px', width: '30px' }} /></a>}
    </div>
  );
};

export default Message;
