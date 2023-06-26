import AddChat from './AddChat.jsx';
import RenameChat from './RenameChat.jsx';

const modals = {
  addChat: AddChat,
  renameChat: RenameChat,
};

export default (modalName) => modals[modalName];
