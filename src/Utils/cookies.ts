import Cookies from 'js-cookie';


export const setCookie = (key : string , value : string , days : number) => {
  Cookies.set(key, value , {expires : days , secure : false , sameSite : 'Lax'})
}


export const getCookie = (key : string)=>{
return Cookies.get(key)
}


export const removeCookie = (key : string)=>{
return Cookies.remove(key)
}