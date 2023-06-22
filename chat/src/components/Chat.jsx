import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as chatsActions } from '../slices/chatsSlice.js';

const ButtonEl = ({ name, classes, change }) => (
  <button
    onClick={change}
    type="button"
    className={classes}
  >
    <span className="me-1">#</span>
    {`${name}`}
  </button>
);

const Chat = ({ chat }) => {
  const { t } = useTranslation();
  const { id, name } = chat;
  console.log(id);
  const chatName = name || id.split('@')[0];
  const { currentChatId } = useSelector((state) => state.chatsReducer);
  const classes = cn({
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
    'text-truncate': true,
    btn: true,
    'btn-secondary': id === currentChatId,
  });
  const dispatch = useDispatch();

  const changeChannel = (e) => {
    e.preventDefault();
    if (id !== currentChatId) {
      dispatch(chatsActions.changeCurrentChat(id));
    }
  };

  return (
    <li className="nav-item w-100">
      <Dropdown role="group" className="d-flex dropdown btn-group">
        <ButtonEl name={chatName} change={changeChannel} classes={classes} />
        <Dropdown.Toggle variant="" id="dropdown-basic">
          <span className="visually-hidden">{t('ChannelToogle')}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            href="#"
            onClick={() => dispatch(modalsActions.openModal({ type: 'removeChannel', id }))}
          >
            {t('Delete')}
          </Dropdown.Item>
          <Dropdown.Item
            href="#"
            onClick={() => dispatch(modalsActions.openModal({ type: 'renameChannel', id }))}
          >
            {t('Rename')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
};

export default Chat;
