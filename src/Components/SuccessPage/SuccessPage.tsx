import { FC, ReactNode } from "react"


interface successProps {
    message? :string
    icon? : ReactNode
}
const SuccessPage : FC<successProps> = ({message , icon}) => {
  return (
    <div className="max-w-2xl flex justify-center items-center min-h-screen">
      <div className="bg-white ">
       <div className="py-5">{icon}</div>
       <div className="text-sm font-poppins font-bold">{message}</div>
      </div>
    </div>
  )
}

export default SuccessPage
