/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
      const newChats = payload;
      state.currentChats = newChats;
    },
    changeCurrentChat(state, { payload }) {
      const id = payload;
      state.currentChatId = id;
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
