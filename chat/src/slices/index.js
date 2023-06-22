import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalsReducer from './modalsSlice.js';
import chatsReducer from './chatsSlice.js';

export default configureStore({
  reducer: {
    chatsReducer,
    channelsReducer,
    messagesReducer,
    modalsReducer,
  },
});
