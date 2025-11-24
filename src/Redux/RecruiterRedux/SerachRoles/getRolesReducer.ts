import { GET_ROLES, SET_LOADING_DATA } from "./getRoles";



const initialState = {
  roles:[],
  loading : true,
};

export const getRolesReducer = (state = initialState , action : {type : any , payload : any})=>{
  switch (action.type){
    case GET_ROLES : 
    return{
     ...state,
     roles : action.payload,
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