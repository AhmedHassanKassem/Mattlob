import { GET_CVDATA, SET_LOADING_DATA } from "./getCvAction";



const initialState = {
  cvData:[],
  loading : true,
};

export const getCvDataReducer = (state = initialState , action : {type : any , payload : any})=>{
  switch (action.type){
    case GET_CVDATA : 
    return{
     ...state,
     cvData : action.payload,
     loading : false
    }

    case SET_LOADING_DATA : 
    return {
        ...state,
        loading : true
    }
     default:
      return state;
  }
}