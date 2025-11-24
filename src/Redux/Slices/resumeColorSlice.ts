import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IResumeColor {
    resumeColor: string;
}

const initialValue : IResumeColor = {
    resumeColor: ''
}

const resumeColorSlice = createSlice({
    name: 'resumeColor',
    initialState: initialValue,
    reducers: {

        setResumeColor(state , action : PayloadAction<string>){
            state.resumeColor = action.payload
        },

        clearResumeColor(state){
            state.resumeColor = ''
        }
    }
})

export const {setResumeColor , clearResumeColor} = resumeColorSlice.actions
export default resumeColorSlice.reducer;