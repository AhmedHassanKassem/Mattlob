import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICVData } from "../../Interfaces/interface";

interface localCvState {
  localStorageCv: ICVData[];
  loadingCv: boolean;
}

const initialState: localCvState = {
  localStorageCv: [],
  loadingCv: true,
};

const localStorageCv = createSlice({
  name: 'localStorageCart',
  initialState,
  reducers: {
    setLocalCart(state, action: PayloadAction<ICVData[]>) {
      state.localStorageCv = action.payload;
      state.loadingCv = false;
    },
    clearLocalCart(state) {
      state.localStorageCv = [];
    },
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loadingCv = action.payload;
    }
  },
});

export const { setLocalCart, clearLocalCart, setCartLoading } = localStorageCv.actions;
export default localStorageCv.reducer;