import React from 'react';
import { useTranslation } from 'react-i18next';

const Message = ({ message }) => {
  const { t } = useTranslation();
  const { body, username, id } = message;

  return (
    <div key={id} className="text-break mb-2">
      <b>{username}</b>
      :&nbsp;
      {t(`${body}`)}
    </div>
  );
};

export default Message;
