/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import fetchCurrentChats from '../middlewares.js';
import { actions as messagesActions } from './messagesSlice.js';

const initialState = {
  currentChats: [],
  archiveChats: [],
  currentChatId: null,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChats(state, { payload }) {
      const newChats = payload;
      state.currentChats = [...newChats];
    },
    addChat(state, { payload }) {
      const newChat = payload;
      state.currentChats = [...state.currentChats, newChat];
    },
    addAvatar(state, { payload }) {
      const { id, avatarUrl } = payload;
      const chatIndex = state.currentChats.findIndex((chat) => chat.id === id);
      state.currentChats[chatIndex].avatar = avatarUrl;
    },
    changeName(state, { payload }) {
      const { id, chatName } = payload;
      const chatIndex = state.currentChats.findIndex((chat) => chat.id === id);
      state.currentChats[chatIndex].name = chatName;
    },
    changeCurrentChat(state, { payload }) {
      const id = payload;
      state.currentChatId = id;
      const chatIndex = state.currentChats.findIndex((chat) => chat.id === id);
      state.currentChats[chatIndex].read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(messagesActions.addMessage, (state, { payload }) => {
        const { chatId, senderName } = payload;
        const name = senderName !== '' ? senderName : _.uniqueId('User_');
        const existingChat = state.currentChats.find((chat) => chat.id === chatId);
        if (!existingChat) {
          state.currentChats.unshift({
            id: chatId, name, type: 'user', read: false,
          });
        }
        if (existingChat && state.currentChatId !== chatId) {
          const restChats = state.currentChats.filter((chat) => chat.id !== chatId);
          existingChat.read = false;
          state.currentChats = [existingChat, ...restChats];
        }
      })
      .addCase(fetchCurrentChats.fulfilled, (state, { payload }) => {
        const chats = payload;
        state.currentChats = [...chats];
        console.log('chats loaded...');
      });
  },
});

export const { actions } = chatsSlice;
export default chatsSlice.reducer;
