import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as chatsActions } from '../slices/chatsSlice.js';
import getAvatar from '../utils/getAvatar.js';
import getAuthToken from '../utils/getAuthToken.js';
import defaultAvatar from '../assets/DefaultAvatar.png';
import exclamation from '../assets/Exclamation.png';

const ButtonEl = ({
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
        {read === 'not'
      && (<img src={exclamation} className="rounded-circle float-right" style={{ postion: 'relative', height: '15px', width: '15px' }} alt={t('Avatar')} />
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

const Chat = ({ chat, notify }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { idInstance, apiTokenInstance } = getAuthToken();
  const {
    id, name, avatar, read,
  } = chat;
  const { currentChatId } = useSelector((state) => state.chatsReducer);
  const classes = cn({
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
    'text-truncate': true,
    btn: true,
    'bg-secondary': id === currentChatId,
  });

  const showError = useCallback((e) => {
    notify(e);
  }, [notify]);

  const changeChannel = async (e) => {
    e.preventDefault();
    try {
      if (id !== currentChatId) {
        if (!avatar) {
          const avatarUrl = await getAvatar(id, idInstance, apiTokenInstance);
          dispatch(chatsActions.addAvatar({ id, avatarUrl }));
        }
        dispatch(chatsActions.changeCurrentChat(id));
      }
    } catch (err) {
      showError(err.message);
      dispatch(chatsActions.changeCurrentChat(id));
    }
  };

  return (
    <li className="nav-item w-100">
      <Dropdown role="group" className="d-flex dropdown btn-group">
        <ButtonEl
          name={name}
          read={read}
          avatar={avatar}
          change={changeChannel}
          classes={classes}
        />
        <Dropdown.Toggle variant="" id="dropdown-basic">
          <span className="visually-hidden">{t('ChatToogle')}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            href="#"
            onClick={() => dispatch(modalsActions.openModal({ type: 'renameChat', id }))}
          >
            {t('Rename')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
};

export default Chat;

/* <Dropdown.Item
href="#"
onClick={() => dispatch(modalsActions.openModal({ type: 'removeChannel', id }))}
>
{t('Delete')}
</Dropdown.Item> */
