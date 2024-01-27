import _ from 'lodash';

const fixChatNames = (chats) => {
  const fixedChats = chats.map((chat) => {
    if (chat.name === '' || !chat.name) {
      chat.name = _.uniqueId('User_');
    }
    return chat;
  });
  return fixedChats;
};

export default fixChatNames;
