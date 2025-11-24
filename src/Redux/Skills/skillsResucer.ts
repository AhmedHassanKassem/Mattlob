import { GET_SKILLS, SET_LOADING_SKILLS } from "./skillsAction";




const initialState = {
  skills:[],
  loading : true,
};

export const getSkillsReducer = (state = initialState , action : {type : any , payload : any})=>{
  switch (action.type){
    case GET_SKILLS : 
    return{
     ...state,
     skills : action.payload,
     loading : false
    }

    case SET_LOADING_SKILLS : 
    return {
        ...state,
        loading : true
    }
     default:
      return state;
  }
}