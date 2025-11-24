import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { AtSign, KeyRoundIcon } from "lucide-react"
import { axiosInst } from "../../axios/axios"
import { useNavigate } from "react-router-dom"
import { MessageType } from "../../Interfaces/Enums"
import { toast } from "react-toastify"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axiosInst.post("/api/Auth/forgetPassword", { email })
      if (res.data.message.messageType === MessageType.Success) {
        setIsSuccess(true)
        localStorage.setItem('email' , email)
        localStorage.setItem('timer' , "on")
        localStorage.setItem('timerCount' , (900).toString())
        navigate('/resetPassword')
      }else{
        toast.error("This account is not registerd!")
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      // Optionally show error UI here
    }
  }
  useEffect(() => {
   localStorage.removeItem("resendCount")
   localStorage.removeItem("timer")
   localStorage.removeItem("timerCount")
  }, [])
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        {!isSuccess ? <><div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRoundIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you a reset link.
          </p>
        </div><form className="space-y-6" onSubmit={sendEmail}>

            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleEmailChange}
                  value={email}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400"
                  placeholder="Enter your email address"
                  required />
              </div>
            </div>


            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Send Reset Link
            </button>
          </form><div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-sky-600 hover:text-sky-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div><div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Need help?</p>
                <p className="text-xs text-blue-600 mt-1">
                  If you don't receive an email within 5 minutes, check your spam
                  folder or contact support.
                </p>
              </div>
            </div>
          </div></> : null}
      </div>
    </div>
  )
}

export default ForgotPassword
