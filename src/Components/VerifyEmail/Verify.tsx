import { useState, FormEvent, useEffect, useRef } from "react"
import { Check, CheckCircle } from "lucide-react"
import { axiosInst } from "../../axios/axios"
import { MessageType } from "../../Interfaces/Enums"
import { IUser, IMessageDetail, EMAIL_CLAIM, NAME_CLAIM } from "../../Interfaces/interface"
import { useNavigate } from "react-router-dom"
import OTPInput from "../../Containers/OTPInput"
import Button from "../../Containers/Button"
import { useDispatch } from "react-redux"
import { setTokenValue } from "../../Redux/Slices/tokenSlice"
import { AppDispatch } from "../../Redux/store"
import { jwtDecode } from "jwt-decode"
import { setFoundUser } from "../../Redux/Slices/userSlice"

const VerifyEmail = () => {
    const [otp, setOtp] = useState("")

    const [email, setEmail] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<IMessageDetail[]>([])
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    const [secondsElapsed, setSecondsElapsed] = useState(0); // 15 minutes in seconds
    const [resendCount, setResendCount] = useState(1)
    const initialTime = 10;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const runTimer = (startFrom: number) => {
        clearInterval(timerRef.current!);
        setSecondsElapsed(startFrom);
        localStorage.setItem('timer', 'on');
        localStorage.setItem('timerCount', startFrom.toString());

        timerRef.current = setInterval(() => {
            setSecondsElapsed(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    localStorage.removeItem('timer');
                    localStorage.removeItem('timerCount');
                    return 0;
                }
                const newTime = prev - 1;
                localStorage.setItem('timerCount', newTime.toString());
                return newTime;
            });
        }, 1000);
    };
    useEffect(() => {
        const getEmail = localStorage.getItem('email')!
       if(getEmail){
 const timer = setInterval(() => {
            setSecondsElapsed(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                localStorage.setItem("timer", formatTime(timer))
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
       }else{
           navigate('/login')
       }
    }, [])
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    useEffect(() => {
        setEmail(localStorage.getItem('email')!)
    }, [])



    const resendCode = async () => {
        try {
            const res = await axiosInst.get('/api/Auth/ResendCode', { params: { email, state: "confirm" } });
            if (res) {
                const resendTimes = localStorage.getItem("resendCount")
                let count = Number(resendTimes)
                setResendCount(count++)
                runTimer(initialTime);
                localStorage.setItem("resendCount", count.toString())
            }
        } catch (error) {
            console.log(error);
        }
    };
    const confirmEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await axiosInst.get('/api/Auth/confirmEmail', { params: { Code: otp } })
            if (res.data.message.messageType == MessageType.Success) {
                setIsSuccess(true)
                dispatch(setTokenValue(res.data.data.token));
                const decoded: any = jwtDecode(res.data.data.token);
                const user: IUser = {
                    email: decoded[EMAIL_CLAIM],
                    name: decoded[NAME_CLAIM],
                    user_id: decoded.user_id,
                };
                dispatch(setFoundUser(user));
                
                setInterval(() => {
                    navigate('/home')
                }, 3000);
            } else {
                setIsError(true)
                setErrorMessage(res.data.message.messages)
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        const timerState = localStorage.getItem('timer');
        const savedTime = parseInt(localStorage.getItem('timerCount') || '0', 10);

        if (timerState === 'on' && savedTime > 0) {
            runTimer(savedTime);   // ✅ Start countdown immediately if timer is on!
        }
        if (resendCount == 3) {
            navigate(-1)
        }
        return () => clearInterval(timerRef.current!);
    }, [resendCount]);
    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            {isSuccess ? <>
                <div className="fixed inset-0 bg-gray-900/75 h-full z-50 flex items-center justify-center" onClick={() => setIsSuccess(false)}>
                    <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full text-center animate__animated animate__fadeInDown" onClick={(e) => { e.stopPropagation() }}>
                        <div className="flex flex-col items-center gap-1">
                            <CheckCircle size={50} className="text-green-500" />
                            <p className="text-lg font-semibold">Your account verified successfully</p>
                            <p className="text-sm">now going to homepage ...</p>
                        </div>
                    </div>
                </div>
            </> : null}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">

                    <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex justify-center">
                            <Check size={30} className="text-green-500" />
                        </div>
                        <p> We sent a 6 digit one time password to your account <strong>{email}</strong>, please check your inbox.</p>
                    </div>


                </div>
                {isError ? <div className=" mb-8">

                    <div className="mt-3 p-4 bg-red-50 rounded-lg border text-start border-red-100">
                        <div className="flex flex-col te gap-1">
                            {errorMessage.map((msg: IMessageDetail, index: number) => (
                                <div className="flex gap-2 items-center" key={index}>
                                    <p className="text-red-500 text-xs">* {msg.message}</p></div>
                            ))}

                        </div>
                    </div>

                </div> : null}

                <form className="space-y-6" onSubmit={confirmEmail}>

                    <div className="relative">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2 flex justify-between"
                        >
                            OTP (one time password)
                            <div>
                                {secondsElapsed === 0 ? (
                                    <Button
                                        onClick={() => {
                                            resendCode();
                                            localStorage.setItem('timer', 'on');
                                            localStorage.setItem('timerCount', (15 * 60).toString());
                                            setSecondsElapsed(15 * 60);
                                        }}
                                        buttonContent={
                                            <div>
                                                <p className="text-sky-500 hover:underline text-sm">Resend code</p>
                                            </div>
                                        }
                                    />
                                ) : (
                                    <div className="justify-end flex mx-2 text-sky-500 items-center gap-2">
                                        <p className="text-gray-500 text-xs">Resend code after</p>
                                        <p className="font-bold">{formatTime(secondsElapsed)}</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        <div className="relative">
                            {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div> */}
                            <OTPInput onChange={(code: string) => setOtp(code)} />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Confirm
                    </button>
                </form><div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Have an account?
                        <a
                            href="/login"
                            className="text-sky-600 hover:text-sky-700 font-medium hover:underline transition-colors duration-200"
                        >
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail