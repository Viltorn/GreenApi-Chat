import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './slices/messagesSlice.js';
import modalsReducer from './slices/modalsSlice.js';
import chatsReducer from './slices/chatsSlice.js';
import loaderReducer from './slices/loaderSlice.js';

export default configureStore({
  reducer: {
    chatsReducer,
    messagesReducer,
    modalsReducer,
    loaderReducer,
  },
});
