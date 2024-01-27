import React from 'react';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '../assets/DefaultAvatar.png';
import exclamation from '../assets/Exclamation.png';

const ChatAvatarBtn = ({
  name,
  classes,
  change,
  avatar,
  read,
}) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={change}
      type="button"
      className={classes}
    >
      <span style={{ position: 'relative' }}>
        {!read && (<img src={exclamation} className="rounded-circle float-right" style={{ postion: 'relative', height: '15px', width: '15px' }} alt={t('Avatar')} />
        )}
        {avatar
      && (<img src={avatar} className="rounded-circle img-fluid" style={{ maxHeight: '30px', maxWidth: '30px' }} alt={t('Avatar')} />
      )}
        {(!avatar || avatar === '')
      && (<img src={defaultAvatar} className="rounded-circle img-fluid" style={{ height: '30px', width: '30px' }} alt={t('Avatar')} />
      )}
      </span>
      <small>
        {' '}
        {`${name}`}
      </small>
    </button>
  );
};

export default ChatAvatarBtn;
