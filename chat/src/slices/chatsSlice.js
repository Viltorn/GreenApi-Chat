/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { actions as messagesActions } from './messagesSlice.js';

const initialState = {
  currentChats: [],
  archiveChats: [],
  currentChatId: '',
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChats(state, { payload }) {
      const newChats = payload.map((chat) => {
        if (chat.name === '') {
          chat.name = _.uniqueId('User_');
        }
        return chat;
      });
      console.log(newChats);
      state.currentChats = [...newChats];
    },
    addAvatar(state, { payload }) {
      const { id, avatarUrl } = payload;
      console.log(id);
      const newChats = state.currentChats.map((chat) => {
        if (chat.id === id) {
          chat.avatar = avatarUrl;
        }
        return chat;
      });
      state.currentChats = [...newChats];
    },

    changeCurrentChat(state, { payload }) {
      const id = payload;
      state.currentChatId = id;
    },

    extraReducers: (builder) => {
      builder
        .addCase(messagesActions.addMessage, (state, { payload }) => {
          const { chatId, senderName } = payload;
          const name = senderName !== '' ? senderName : _.uniqueId('User_');
          const oldChat = state.currentChats.find((chat) => chat.id === chatId);
          if (oldChat) {
            state.currentChats = [{ id: chatId, name, type: 'user' }, ...state.currentChats];
          }
        });
    },
    // archiveChat(state, { payload }) {
    //   state.channels.push(payload);
    // },
    // extractChat(state, { payload }) {
    //   const { id } = payload;
    //   const newState = state.channels.filter((channel) => channel.id !== id);
    //   state.channels = newState;
    //   if (state.currentChannelId === id) {
    //     state.currentChannelId = state.channels[0].id || '';
    //   }
    // },
    // renameChat(state, { payload }) {
    //   const { id, name } = payload;
    //   const newState = state.channels.map((channel) => {
    //     if (channel.id === id) {
    //       channel.name = name;
    //     }
    //     return channel;
    //   });
    //   state.channels = newState;
    // },
  },
});

export const { actions } = chatsSlice;
export default chatsSlice.reducer;
