// src/redux/slices/isResumeWithImgSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResumeImageState {
  isResumeWithImg: boolean;
}

const initialState: ResumeImageState = {
  isResumeWithImg: false,
};

const isResumeWithImgSlice = createSlice({
  name: 'isResumeWithImg',
  initialState,
  reducers: {
    setResumeHasImage(state, action: PayloadAction<boolean>) {
      state.isResumeWithImg = action.payload;
    },
  },
});

export const { setResumeHasImage } = isResumeWithImgSlice.actions;
export default isResumeWithImgSlice.reducer;
