import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../containers/Input";
import { useForm } from "react-hook-form";
import { ICandidateLogin } from "../Interfaces/interface";

const Login = () => {

  const [loginForm , setLoginForm] = useState({
    email : "",
    password : ""
  })
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
    watch,
  } = useForm<ICandidateLogin>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>)=> {
    const {name , value} = e.target
    if(name == "email"){
      setLoginForm({
        ...loginForm,
        email : value
      })
    }
    if(name == "password"){
      setLoginForm({
        ...loginForm,
        password : value
      })
    }
  }

  const submit = (e?: FormEvent<HTMLFormElement>)=>{
   e?.preventDefault()
   try {
    alert('hello')
   } catch (error) {
    
   }
  }
  return (
    <div>
    

       <div className="grid lg:grid-cols-12 overflow-hidden">
        <div className="lg:col-span-6 col-span-12 lg:min-h-screen h-full bg-sky-700">
          <div className="flex justify-center p-4 items-center">
            <img src="../../logo.png" alt="" />
          </div>
          </div>
          <div className="lg:col-span-6 flex justify-center items-center ">
          <div className=" min-h-screen flex items-center justify-center max-w-lg">
      <div className="w-full min-w-xl">
        {/* Logo */}
    

        {/* Login Card */}
        <div className="bg-white p-8 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-6">Sign in</h2>
          
          <div className="text-sky-600 font-medium mb-4">As an Employer</div>
          
          <div onSubmit={()=>submit()}>
            <div className="mb-4">
            <Input
                        label="Email"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        type="email"
                        className={` w-full px-3 py-2 text-black focus:outline-none focus:ring-1 
                        ${
                          errors.account_email
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                        placeholderType="Enter your email"
                        {...register("account_email", {
                          required: "Email is required",
                          onChange: (e : ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setValue("account_email", e.target.value);
                          },
                        })}
                        errorMessage={
                          errors.account_email && errors.account_email?.message
                        }
                      />
            </div>
            
            <div className="mb-2">
            <Input
                        label="Password"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        placeholderType="Enter Password"
                        type="password"
                        {...register("account_password", {
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
                          onChange: (e : ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setValue("account_password", e.target.value);
                          },
                        })}
                        className={`bg-white border py-2 w-full px-3 text-black focus:outline-none focus:ring-1 ${
                          errors.account_password
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 rounded shadow-inner border border-gray-300 py-1`}
                        errorMessage={errors.account_password?.message}
                      />
           
            </div>
            
            <div className="mb-6">
              <a href="#" className="text-gray-800 hover:text-sky-600 text-sm">
                Forgot password?
              </a>
            </div>
            
            <button
              onClick={()=>submit()}
              className="w-full bg-sky-600 text-white py-3 rounded hover:bg-sky-700 transition duration-200"
            >
              Login
            </button>
          </div>
          
          <div className="text-center mt-6">
            <span className="text-gray-700">No Employer Account? </span>
            <a href="#" className="text-sky-500 font-medium hover:underline">
              Sign up
            </a>
            <div className="mt-2">
              <span className="text-gray-700">Vendor? </span>
              <a href="#" className="text-sky-500 font-medium hover:underline">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>
    </div>
    </div>
  )
}

export default Login
