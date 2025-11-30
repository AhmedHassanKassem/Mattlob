
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LangState {
  resumeLang?: string ;
}

const initialState: LangState = {
  resumeLang: '',
};

const resumeLangSlice = createSlice({
  name: 'resumeLang',
  initialState,
  reducers: {
    setResumeLangSlice(state, action: PayloadAction<string>) {
      state.resumeLang = action.payload;
    },
    clearResumeLangSlice(state) {
      state.resumeLang = '';
    },
  },
});

export const { setResumeLangSlice, clearResumeLangSlice } = resumeLangSlice.actions;
export default resumeLangSlice.reducer;