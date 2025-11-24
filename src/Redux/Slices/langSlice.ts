
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LangState {
  lang?: string ;
}

const initialState: LangState = {
  lang: '',
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLangSlice(state, action: PayloadAction<string>) {
      state.lang = action.payload;
    },
    clearLangSlice(state) {
      state.lang = '';
    },
  },
});

export const { setLangSlice, clearLangSlice } = langSlice.actions;
export default langSlice.reducer;