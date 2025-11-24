import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface isDarkState {
    isDark: boolean;
  }
  
  const initialState: isDarkState = {
    isDark: false,
  };
  
  const isDarkSlice = createSlice({
    name: 'isDark',
    initialState,
    reducers: {
      setIsDarkState(state, action: PayloadAction<boolean>) {
        state.isDark = action.payload;
      },
      clearIsDarkState(state) {
        state.isDark = true;
      },
    },
  });
  
  export const { setIsDarkState , clearIsDarkState } = isDarkSlice.actions;
  export default isDarkSlice.reducer;