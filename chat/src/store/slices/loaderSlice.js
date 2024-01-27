import { createSlice } from '@reduxjs/toolkit';
import fetchCurrentChats from '../middlewares.js';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: { status: 'LOADING' },
  reducers: {
    resetState(state) {
      state.status = 'LOADING';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentChats.fulfilled, (state) => {
      state.status = 'LOADED';
    });
    builder.addCase(fetchCurrentChats.rejected, (state) => {
      state.status = 'ERROR';
    });
  },
});

export const { actions } = loaderSlice;
export default loaderSlice.reducer;
