import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface totalPagesState {
  totalPages: number  ;
}

const initialState: totalPagesState = {
  totalPages: 0 ,
};

const totalPagesSlice = createSlice({
  name: 'totalPages',
  initialState,
  reducers: {
    setTotalPagesNum(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    clearTotalPagesNum(state) {
      state.totalPages = 0;
    },
  },
});

export const { setTotalPagesNum, clearTotalPagesNum } = totalPagesSlice.actions;
export default totalPagesSlice.reducer;