import React from 'react';
import cn from 'classnames';

const Message = ({ message }) => {
  const {
    body,
    sender,
    idMessage,
    status,
  } = message;
  const classes = cn({
    'text-success': status === 'user',
  });

  return (
    <div key={idMessage} className="text-break mb-2">
      <b className={classes}>{sender}</b>
      :&nbsp;
      {body}
    </div>
  );
};

export default Message;
