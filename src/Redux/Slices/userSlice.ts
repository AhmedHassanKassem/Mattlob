import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../Interfaces/interface";

interface localUserState {
  localStorageUser: IUser;
}

const initialState: localUserState = {
  localStorageUser: {},
};

const localStorageUser = createSlice({
  name: 'localStorageUser',
  initialState,
  reducers: {
    setFoundUser(state, action: PayloadAction<IUser>) {
      state.localStorageUser = action.payload;
    },
    clearFoundUser(state) {
      state.localStorageUser = {};
    },
  },
});

export const { setFoundUser, clearFoundUser} = localStorageUser.actions;
export default localStorageUser.reducer;