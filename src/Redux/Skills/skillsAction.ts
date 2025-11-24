import { Action } from "redux";
import { RootState } from "../store";
import { axiosInst } from "../../axios/axios";
import { ThunkAction } from "redux-thunk";

export const SET_LOADING_SKILLS = 'SET_LOADING_SKILLS'
export const GET_SKILLS = 'GET_SKILLS'


export const getSkillsAction = (search : string , token : string): ThunkAction<
Promise<void>,
RootState,
unknown,
Action 
> => {
return async (dispatch) => {
  dispatch({type : SET_LOADING_SKILLS})
  try {
    const res = await axiosInst.post(`api/_Skills/SearchSkills` , {name : search} , {headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
    },
});
      dispatch({ type: GET_SKILLS, payload: res.data.data});
    
  } catch (err) {
    console.error(err);
  }
};
};