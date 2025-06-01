import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import SideBar from "../../../containers/SideBar"

const Summary = () => {
   const navigate = useNavigate()

  return (
    <div>
      <div className="grid grid-cols-12">
      <div className="col-span-2">
       <SideBar/>
      </div>
      <div className="col-span-10">
         <div className="p-5">
      <Button className="underline text-sky-500" title="Go back" />
    </div>
       <div className="mx-5">
      <p className="text-3xl font-bold">Tell us more about you</p>
      <p className="text-sm">Enter your summary below , to make your resume more reachable...</p>
      <p className="text-sm pt-10">* these fields are mandatory</p>
    </div> 
     <div className="p-10">
      <div className="block">
        <label htmlFor="desc">Description</label>
      <textarea name="desc" className="border focus:outline-none py-2 px-2 w-full border-gray-400"  id="1" />
      </div>
     </div>
      <div className="col-span-12 absolute right-0 bottom-0 mb-10 px-10">
     <div className="flex justify-end items-center ">
    <div className="flex gap-4 text-lg font-bold">
     <Button className="text-sky-600" titleClassname="underline" title="Previous" />
    <Button title="Next step" onClick={()=>navigate('/build-resume/finalize')} 
    titleClassname={`bg-sky-600 p-3 rounded-full text-white py-4 px-8`}/>      
    </div>
  </div>
   </div>
    </div>
    </div>
    </div>
  )
}

export default Summary
