import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IToken {
    token: string;
}

const initialValue : IToken = {
    token: ''
}

const tokenSlice = createSlice({
    name: 'token',
    initialState: initialValue,
    reducers: {

        setTokenValue(state , action : PayloadAction<string>){
            state.token = action.payload
        },

        clearTokenValue(state){
            state.token = ''
        }
    }
})

export const {setTokenValue , clearTokenValue} = tokenSlice.actions
export default tokenSlice.reducer;