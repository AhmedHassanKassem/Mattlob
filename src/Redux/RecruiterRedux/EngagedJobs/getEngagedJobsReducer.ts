import { GET_ENGAGED_ROLES, SET_LOADING_DATA } from "./getEngagedJobs";




const initialState = {
  engagedRoles:[],
  loading : true,
};

export const getEngagedRolesReducer = (state = initialState , action : {type : any , payload : any})=>{
  switch (action.type){
    case GET_ENGAGED_ROLES : 
    return{
     ...state,
     engagedRoles : action.payload,
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