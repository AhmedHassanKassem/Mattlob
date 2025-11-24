import { Action } from "redux";
import { RootState } from "../store";
import { axiosInst } from "../../axios/axios";
import { ThunkAction } from "redux-thunk";

export const SET_LOADING_DATA = 'SET_LOADING_DATA'
export const GET_CVDATA = 'GET_CVDATA'


export const getCvDataAction = (token : string): ThunkAction<
Promise<void>,
RootState,
unknown,
Action 
> => {
return async (dispatch) => {
  dispatch({type : SET_LOADING_DATA})
  try {
    const res = await axiosInst.get(`api/CV_Users/GetUserTemplateData` , {headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
    }});
      dispatch({ type: GET_CVDATA, payload: res.data.data});
    
  } catch (err) {
    console.error(err);
  }
};
};