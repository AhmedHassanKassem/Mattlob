import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { ICandidateRegister, IMessageDetail, IRole } from "../../Interfaces/interface"
import { axiosInst } from "../../axios/axios"
import { toast } from "react-toastify"
import Input from "../../Containers/Input"
import { ScaleLoader } from "react-spinners"
import { MessageType } from "../../Interfaces/Enums"
import Select from "../../Containers/Select"
import { t } from "i18next"
import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store"

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [roles, setRoles] = useState<IRole[]>([])
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const lang = useSelector((state : RootState)=> state.lang.lang)
  const [regForm, setRegForm] = useState({
    Name: "",
    Email: "",
    Mobile: "",
    role_id: 0,
    Password: "",
    Confirm_Password: ""
  })
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ICandidateRegister>()


  const getRoles = async()=>{
   await axiosInst.get('/api/Common/GetAllRoles').then((res)=>{
    const filteredRoles = res.data.data.filter((filteredRole : IRole)=> filteredRole.is_active === true)
    setRoles(filteredRoles)
   }).finally(()=>setLoadingRoles(false))
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...regForm, [name]: value };

    setRegForm(updatedForm);

    // Password match check
    if (name === 'Password' || name === 'Confirm_Password') {
      setPasswordMatch(updatedForm.Password === updatedForm.Confirm_Password);
    }
  };
  const formData = new FormData();
  formData.append('Name', regForm.Name);
  formData.append('Email', regForm.Email);
  formData.append('role_id', regForm.role_id.toString());
  formData.append('Mobile', regForm.Mobile);
  formData.append('Password', regForm.Password);
  formData.append('Confirm_Password', regForm.Confirm_Password);

  const submit = async () => {
    setLoading(true);

    try {
      const response = await axiosInst.post('/api/Auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'  // ✅ Correct key, correct value
        }
      });
      if (response.data.message.messageType === MessageType.Success) {
        localStorage.setItem('email', regForm.Email);
        navigate('/verify');
      } else {
        const allMessages = response.data.message.messages
          .filter((msg: IMessageDetail | null) => msg !== null)  // ✅ Remove nulls
          .map((msg: IMessageDetail) => msg.message)
          .join('\n');

        if (allMessages) toast.error(allMessages);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || t("Sign up failed. Please try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  const signInWithLinked = () => {
    try {
      const host = window.location.host
      const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=864irqylqi4oka&redirect_uri=http://${host}&scope=openid%20profile%20email&state=linkedin`;
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

  useEffect(() => {
    getRoles()
  }, [])

  
  return (
    <div>
      <div className="grid lg:grid-cols-12 overflow-hidden">
      
        <div className="lg:col-span-6  col-span-12">
          <div className=" lg:min-h-screen flex lg:items-center py-5 px-5">
            <div className="w-full lg:px-0 ">
              <div className="bg-white mt-10 lg:mt-0 lg:p-8 p-4 shadow-md rounded-md">
                <div className="flex justify-center items-center block lg:hidden">
      <img src="../../logoBlue.png" alt="" width={40}/>
      <img src="../../logoNameBlack.png" alt="" width={60}/>
    </div>
                <h2 className="text-2xl font-bold mb-6">{t("signUp")}</h2>
                <form onSubmit={handleSubmit(submit)} method="post">
                   <div className="mb-2">
                      <Select
                      label={t("Sign up as")}
                      labelClassname="font-bold mb-1 text-sm "
                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.role_id
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      
                      {...register("role_id", {
                        required: `${t("Role")} ${t("Required")}`,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("role_id", Number(e.target.value));
                        },
                      })}
                      errorMessage={
                        errors.role_id && errors.role_id?.message
                      }
                      oneValue={
                        <>
                        {roles.map((role : IRole, index : number)=>{                         
                         return loadingRoles ? <option>Loading ....</option> :  
                         <option value={role.id} key={index}>{lang === "en" ? role.roleEnName : role.roleArName}</option>
                        })}
                        </>
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      label={t("Name")}
                      labelClass="font-bold mb-1 text-sm "
                      type="text"

                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.Name
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      placeholderType="Enter your Name"
                      {...register("Name", {
                        required: `${t("Name")} ${t("Required")}`,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("Name", e.target.value);
                        },
                      })}
                      errorMessage={
                        errors.Name && errors.Name?.message
                      }
                    />
                  </div>
                 
                  <div className="mb-2">
                    <Input
                      label={t("Email")}
                      labelClass="font-bold mb-1 text-sm "
                      type="email"

                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.Email
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      placeholderType="Enter your Email"
                      {...register("Email", {
                        required: `${t("Email")} ${t("Required")}`,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("Email", e.target.value);
                        },
                      })}
                      errorMessage={
                        errors.Email && errors.Email?.message
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      label={t("Phone")}
                      labelClass="font-bold mb-1 text-sm "
                      type="text"

                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.Mobile
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      placeholderType="Enter your Mobile"
                      {...register("Mobile", {
                        required: `${t("Phone")} ${t("Required")}`,
                        minLength: {
                          value: 11,
                          message: t("Mobile number must be 11 numbers")
                        },

                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("Mobile", e.target.value);
                        },
                      })}
                      errorMessage={
                        errors.Mobile && errors.Mobile?.message
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <Input
                      label={t("Password")}
                      labelClass="font-bold mb-1 text-sm "
                      placeholderType="Enter Password"
                      type="password"
                      {...register("Password", {
                        required: `${t("Password")} ${t("Required")}`,
                        minLength: {
                          value: 8,
                          message:
                            t("Password must be at least 8 characters long"),
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                          message: t("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"),
                        },

                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("Password", e.target.value);
                        },
                      })}
                      className={`bg-white border py-2 w-full px-3 text-black focus:outline-none focus:ring-1 ${errors.Password
                        ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                        : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 rounded shadow-inner border border-gray-300 py-1`}
                      errorMessage={errors.Password?.message}
                    />

                  </div>
                  <div className="mb-2">
                    <Input
                      label={t("Confirm password")}
                      labelClass="font-bold mb-1 text-sm "
                      type="password"

                      className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${errors.Confirm_Password
                          ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                          : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                      placeholderType="Enter your Confirm_Password"
                      {...register("Confirm_Password", {
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setValue("Confirm_Password", e.target.value);
                        },
                      })}
                      errorMessage={
                        errors.Confirm_Password && errors.Confirm_Password?.message
                      }
                    />
                    {!passwordMatch && (
                      <p className="text-red-500 text-xs mt-1">{t("Passwords do not match")}</p>
                    )}
                  </div>

                  <button
                    className="w-full bg-sky-600 text-white py-3 mt-3 rounded hover:bg-sky-700 transition duration-200 cursor-pointer"
                    type="submit"
                  >
                    {loading ? <div><ScaleLoader width={3} height={20} color="white" /></div> : t("signUp")}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <span className="text-gray-700 text-sm">{t("have an account?")}  </span>
                  <a href="/login" className="text-sky-500 font-medium hover:underline">
                    {t("signIn")}
                  </a>
                  <div className="text-xs mt-5">
                    <div className="flex items-center justify-center gap-4 my-6">
                      <div className="flex-grow border-b border-gray-300"></div>
                      <p className="px-2 text-sm text-gray-600 bg-white">{t("Or sign up with")}</p>
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

export default Register
