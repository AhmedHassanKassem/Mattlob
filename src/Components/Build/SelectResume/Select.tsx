import {  ArrowLeft, ArrowRight, CloudUpload, PenLine } from "lucide-react"
import {  BounceLoader } from "react-spinners"
import Button from "../../../containers/Button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const SelectResume = () => {
 const [loading , setLoading] = useState(false)
 const navigate = useNavigate()
 useEffect(()=>{
  if(loading){
    setTimeout(()=>{
    setLoading(!loading)
    navigate("/")
    },3000)
  }
 },[loading])
  return (
    <div>
      <div className="grid grid-cols-12">
       <div className="col-span-12">
  <p className="text-center text-5xl font-bold pt-5">What do you want to do?</p>
  <p className="text-center text-sm pt-2">Tell us what do you want , and we can help you </p>
  
  <div className="flex min-h-[450px] justify-evenly items-center">
    <Button
      btnContentClassname="p-0"
      buttonContent={
        <div className={`w-full h-full flex flex-col justify-center items-center text-center bg-white rounded shadow-sm px-10 py-15  transition-all
         transform hover:shadow-lg relative hover:-translate-y-2 duration-500`}>
          <CloudUpload size={40} strokeWidth={1} className="text-sky-600 mb-5" />
          <p className="font-bold text-2xl">Upload my resume</p>
          <p className="text-sm max-w-sm pt-2">We'll give you expert guidance to fill out your info and enhance your resume, from start to finish</p>
        </div>
      }
    />

    <Button
      buttonContent={
        <div className={`w-full h-full flex flex-col justify-center items-center text-center rounded bg-white shadow-sm px-10 py-15 transition-all
         transform hover:shadow-lg relative hover:-translate-y-2 duration-500 `}>
          <PenLine size={40} strokeWidth={1} className="text-sky-600 mb-5" />
          <p className="font-bold text-2xl">Build my resume</p>
          <p className="text-sm max-w-sm pt-2">We'll guide you through the whole process so your skills can shine</p>
        </div>
      }
    />
  </div>

  <div className="flex justify-around items-center font-bold">
   <Button buttonContent={
    <div className="flex gap-1 border text-sky-400 p-3 rounded-full px-10 border-2 transition-all transform hover:scale-105 duration-600 hover:bg-sky-100">
       <ArrowLeft size={20}/>  
       <p>Previous</p>     
    </div>
   }/>
   <Button onClick={()=>setLoading(!loading)} buttonContent={
    <div className="flex gap-1 bg-sky-400 p-3 rounded-full px-10 text-white border-2 transition-all transform hover:scale-105 duration-600">
        <p>Next</p>
        <ArrowRight size={20}/>  
    </div>
   }/>
  </div>

 {loading ?  <div className="fixed inset-0 bg-white/90 text-black z-50">
  <div className="flex justify-center items-center h-full w-full">
    <div className="flex flex-col items-center gap-4">
      <BounceLoader color="#1c398e"/>
      <p className="text-sm">Preparing your template....</p>
    </div>
  </div>
</div>
: null}
</div>

      </div>
    </div>
  )
}

export default SelectResume
