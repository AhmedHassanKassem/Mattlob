import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICVData } from "../../Interfaces/interface";

interface localCvState {
  localStorageCv: ICVData;
}

const initialState: localCvState = {
  localStorageCv: {},
};

const localStorageCv = createSlice({
  name: 'localStorageCV',
  initialState,
  reducers: {
    setFoundCv(state, action: PayloadAction<ICVData>) {
      state.localStorageCv = action.payload;
    },
    clearFoundCv(state) {
      state.localStorageCv = {};
    },
  },
});

export const { setFoundCv, clearFoundCv: clearLocalCart } = localStorageCv.actions;
export default localStorageCv.reducer;