import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import SideBar from "../../../containers/SideBar"

const Fill = () => {
  const navigate = useNavigate()
  return (
    <div>
   <div className="grid grid-cols-12">
  {/* Sidebar */}
  <div className="col-span-3">
    <SideBar />
  </div>

  {/* Main Content */}
  <div className="col-span-6">
    <div className="p-5">
      <Button className="underline text-sky-500" title="Go back" />
    </div>

    <form className="grid grid-cols-4 gap-4 ">
      <div className="col-span-2">
        <Input className="border focus:outline-none py-2 w-full border-gray-400" label="First name" />
      </div>
      <div className="col-span-2">
        <Input className="border focus:outline-none py-2 w-full border-gray-400" label="Last name" />
      </div>
      <div className="col-span-2">
        <Input className="border focus:outline-none py-2 w-full border-gray-400" label="City" />
      </div>
      <div className="col-span-2 flex justify-between">
        <Input className="border focus:outline-none py-2 w-40 border-gray-400" label="Country" />
         <Input className="border focus:outline-none py-2 w-40 border-gray-400" label="Postal Code" />
      </div>
      <div className="col-span-2">
        <Input className="border focus:outline-none py-2 w-full border-gray-400" label="Phone" />
       
      </div>
      <div className="col-span-2">
        <Input className="border focus:outline-none py-2 w-full border-gray-400" label="Email" />
      </div>
    </form>
  </div>

  {/* Empty spacer or future content */}
  <div className="col-span-3">
    <div className="text-center pt-5">Preview</div>
  </div>
   <div className="col-span-12 absolute right-0 bottom-0 mb-10 px-10">
     <div className="flex justify-end items-center ">
    <div className="flex gap-4 text-lg font-bold">
     <Button className="text-sky-600" titleClassname="underline" title="Previous" />
    <Button title="Next step" onClick={()=>navigate('/build-resume/work-history')} 
    titleClassname={`bg-sky-600 p-3 rounded-full text-white py-4 px-8`}/>      
    </div>
  </div>
   </div>
</div>
 
    </div>
  )
}

export default Fill
