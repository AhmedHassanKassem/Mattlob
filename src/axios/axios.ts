import axios from "axios";


export const axiosInst = axios.create({
    baseURL : "http://mattlob-001-site1.qtempurl.com/",
    withCredentials : true
})