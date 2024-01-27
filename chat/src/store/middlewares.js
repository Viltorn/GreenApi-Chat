import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import fixChatNames from '../utils/helpers/fixChatNames';

const fetchCurrentChats = createAsyncThunk(
  'fetchCurrentChats',
  async (url) => {
    const response = await axios.get(url);
    const { data } = response;
    const fixedData = fixChatNames(data);
    const readChatsData = fixedData.map((chat) => ({ ...chat, read: true }));
    return readChatsData;
  },
);

export default fetchCurrentChats;
