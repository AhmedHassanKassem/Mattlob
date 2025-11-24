import { ThunkAction } from "redux-thunk";
import { RootState } from "../../store";
import { Action } from "redux";
import { axiosInst } from "../../../axios/axios";
import { setTotalPagesNum } from "../../Slices/totalPages";


export const SET_LOADING_DATA = 'SET_LOADING_DATA'
export const GET_ENGAGED_ROLES = 'GET_ENGAGED_ROLES'


export const getEngagedRoles = (pageNumber? : number , pageSize? : number ): ThunkAction<
Promise<void>,
RootState,
unknown,
Action 
> => {
return async (dispatch) => {
  dispatch({type : SET_LOADING_DATA})
  try {
    const res = await axiosInst.get(`/api/Job/GetAllEngagedJobs?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      dispatch({ type: GET_ENGAGED_ROLES, payload: res.data.data.items});
      dispatch(setTotalPagesNum(res.data.data.pageCount))
      
  } catch (err) {
    console.error(err);
  }
};
};