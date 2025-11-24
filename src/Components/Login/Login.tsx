import { ChangeEvent, FormEvent, useState } from "react";

import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {  ScaleLoader } from "react-spinners";

import { jwtDecode } from "jwt-decode";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { EMAIL_CLAIM, ICandidateLogin, IUser, NAME_CLAIM } from "../../Interfaces/interface";
import { axiosInst } from "../../axios/axios";
import { setTokenValue } from "../../Redux/Slices/tokenSlice";
import { setFoundUser } from "../../Redux/Slices/userSlice";
import Input from "../../Containers/Input";
import { setCookie } from "../../Utils/cookies";
import { useTranslation } from "react-i18next";


const Login = () => {
  const navigate = useNavigate()
const dispatch : AppDispatch = useDispatch()
const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<ICandidateLogin>()

  const handleChange = (field : keyof ICandidateLogin , value : string) => {

      setLoginForm({
        ...loginForm,
        [field]: value
      })
    

  }
  const submit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInst.post('api/Auth/login', loginForm);
      const token = response.data?.data?.token;

      if (token) {
        setCookie('token', token , 1);
        dispatch(setTokenValue(token));
              const decoded: any = jwtDecode(token);
              const user: IUser = {
                email: decoded[EMAIL_CLAIM],
                name: decoded[NAME_CLAIM],
                user_id: decoded.user_id,
              };
              dispatch(setFoundUser(user));
        toast.success("Logged in successfully");
        navigate('/home');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      console.error("Login error:", message);
    } finally {
      setLoading(false);
    }
  };

  
const signInWithLinked = ()=>{
  try {
       const host = window.location.host
  const clientId = '864irqylqi4oka';
  const redirectUri = `http://${host}`;
  const scope = 'email profile openid';

  const responseType = 'code';
      const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}&state=linkedin`;
      window.location.href = linkedInUrl
      
  } catch (error) {
    console.log(error);   
  }
}
const signInWithGoogle = () => {
   const host = window.location.host
  const clientId = '967275738944-dmo8h43tpupar5aq6kjht57vmn6l951i.apps.googleusercontent.com';
  const redirectUri = `http://${host}`;
  const scope = 'email profile openid';
  const responseType = 'code';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=google`;
  window.location.href = googleAuthUrl;
};
  return (
    <div>
      <div className="grid lg:grid-cols-12 overflow-hidden">
            <div className="lg:col-span-6  col-span-12">
          <div className=" lg:min-h-screen flex lg:items-center py-5 px-5">
            <div className="w-full lg:px-0 ">
              <div className="bg-white mt-10 lg:mt-0 lg:p-8 p-4 shadow-md rounded-md">
                            <div className="flex justify-center  items-center gap-3 block lg:hidden">
      <img src="../../logoBlue.png" alt="" width={40}/>
      <img src="../../logoNameBlack.png" alt="" width={60}/>
    </div>
                <h2 className="text-2xl font-bold mb-6">{t("signIn")}</h2>
                <form onSubmit={submit} method="post">
                  <div className="mb-2">
                    <Input
                      label={t("Email")}
                      labelClass="font-bold mb-1 text-sm"
                      type="email"
                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.email
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      {...register("email", {
                        required: "Email is required",
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange("email" , e.target.value);
                          setValue("email", e.target.value);
                        },
                      })}
                      errorMessage={
                        errors.email && errors.email?.message
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <Input
                      label={t("Password")}
                      labelClass="font-bold mb-1 text-sm "
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters long",
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, // At least one letter and one number
                          message:
                            "Password must contain both letters and numbers",
                        },
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange("password" , e.target.value);
                          setValue("password", e.target.value);
                        },
                      })}
                      className={`bg-white border py-2 w-full px-3 text-black focus:outline-none focus:ring-1 ${errors.password
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 rounded shadow-inner border border-gray-300 py-1`}
                      errorMessage={errors.password?.message}
                    />

                  </div>

                  <div className="mb-3">
                    <a href="/forgotPassword" className="text-sky-800 hover:text-sky-600 text-sm">
                      {t("Forgot password?")}
                    </a>
                  </div>

                  <button
                    className="w-full bg-sky-600 text-white py-3 rounded hover:bg-sky-700 transition duration-200 cursor-pointer"
                    type="submit"
                  >
                    {loading ? <div><ScaleLoader width={3} height={20} color="white" /></div> : t("signIn")}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <span className="text-gray-700 text-sm">{t("Dont have an account?")}  </span>
                  <a href="/register" className="text-sky-500 font-medium hover:underline">
                    {t("signUp")}
                  </a>
                  <div className="text-xs mt-5">
                    <div className="flex items-center justify-center gap-4 my-6">
                      <div className="flex-grow border-b border-gray-300"></div>
                      <p className="px-2 text-sm text-gray-600 bg-white">{t("Or login with")}</p>
                      <div className="flex-grow border-b border-gray-300"></div>
                    </div>
                    <div className="flex gap-7 justify-center mt-2">
                      <img loading="lazy" src="/linked.webp" alt="linked" onClick={signInWithLinked} className="transform hover:scale-110 duration-700 cursor-pointer" width={40} />
                      <img loading="lazy" src="/google.png" alt="linked" onClick={signInWithGoogle} className="transform hover:scale-110 duration-700 cursor-pointer" width={40} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="lg:col-span-6 col-span-12 lg:block hidden lg:min-h-screen h-full bg-sky-700">  

         <div className="flex justify-center w-full items-center mt-5">
       <img src="../../logoNameWhite.png" alt="" width={60}/>
      <img src="../../logoWhite.png" alt="" width={60}/>
    </div>
  <div className="flex items-center justify-between items-center p-8 mt-20">
    {/* Logo Section */}
  

    {/* Main Content */}
    <div className="text-white space-y-6 lg:space-y-6 ">
      <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
        {t("Find Your Dream Job Today")}
      </h1>
      <p className="text-lg lg:text-xl text-sky-100 leading-relaxed">
        {t("Connect with top employers and discover opportunities that match your skills and aspirations")}
      </p>
      
      {/* Features */}
      <div className="space-y-4 mt-8">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("Thousands of Jobs")}</h3>
            <p className="text-sky-100 text-sm">{t("Browse opportunities from leading companies")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("Easy Application")}</h3>
            <p className="text-sky-100 text-sm">{t("Apply with one click using your profile")}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t("Career Growth")}</h3>
            <p className="text-sky-100 text-sm">{t("Build your career with professional guidance")}</p>
          </div>
        </div>
      </div>
    </div>
   

  </div> 
  <div className=" text-xs  mt-40 text-end px-3">
      <div className="text-white">
        All rights reserved to Mattlob 2025
      </div>
    </div>
     
</div>
    
      </div>
    </div>
  )
}

export default Login
