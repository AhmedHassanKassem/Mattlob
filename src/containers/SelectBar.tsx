import { FC } from "react"
import Button from "./Button"
import { useNavigate } from "react-router-dom"


interface selectProops{
    selected? : boolean
}
const SelectBar : FC<selectProops>= ({selected}) => {
    const navigate = useNavigate()
 
  return (
    <div>
<div className="fixed inset-x-0 bottom-0 z-50 h-20 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
  <div className="flex justify-end items-center pt-7 px-40">
    <div className="flex gap-4 text-lg font-bold">
     <Button className="text-sky-600" titleClassname="underline" title="Choose later" />
    <Button title="Use this template" onClick={()=>navigate('/build-resume/select-resume')} 
    titleClassname={`${!selected ? "bg-gray-400 disabled" :"bg-sky-600"} p-3 rounded-full text-white py-4 px-8`}/>      
    </div>
  </div>
</div>


    </div>
  )
}

export default SelectBar
