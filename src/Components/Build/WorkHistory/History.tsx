import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import CheckBoxInput from "../../../containers/Checkbox"
import Input from "../../../containers/Input"
import Select from "../../../containers/Select"
import SideBar from "../../../containers/SideBar"

const History = () => {
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
      <p className="text-3xl font-bold">Tell us about your most recent job</p>
      <p className="text-sm">We’ll start there and work backward.</p>
      <p className="text-sm pt-10">* these fields are mandatory</p>
    </div>

    <form className="grid grid-cols-12 px-5">
     <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="Title" />
    
     </div>
     <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="Employer" />
    
     </div> 
      <div className="col-span-3 p-4">
        <Select forSelect="Month" className="border focus:outline-none py-2.5 px-2 w-full border-gray-400" label="Start date" />
     </div>
     <div className="col-span-3 p-4">
        <Select forSelect="Year" className="border focus:outline-none py-2.5 px-2 w-full border-gray-400"  />
     </div>
     <div className="col-span-3 p-4">
        <Select forSelect="Month" className="border focus:outline-none py-2.5 px-2 w-full border-gray-400" label="End date" />
      <CheckBoxInput className="p-0" label2={'I currently work here'} labelClassName2="pl-1"/>
     </div>
     <div className="col-span-3 p-4">
        <Select forSelect="Year" className="border focus:outline-none py-2.5 px-2 w-full border-gray-400"  />
     </div>
     <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="Location" />
        <div> 
      <CheckBoxInput className="p-0" label2={'Remote'} labelClassName2="pl-1"/>
     </div> 
     </div>

     <div className="col-span-6 p-3">
      <label htmlFor="desc">Description</label>
      <textarea name="desc" className="border focus:outline-none py-2 px-2 w-full border-gray-400"  id="1" />
     </div>
    </form>
     </div>          <div className="col-span-12 absolute right-0 bottom-0 mb-10 px-10">
     <div className="flex justify-end items-center ">
    <div className="flex gap-4 text-lg font-bold">
     <Button className="text-sky-600" titleClassname="underline" title="Previous" />
    <Button title="Next step" onClick={()=>navigate('/build-resume/add-educ')} 
    titleClassname={`bg-sky-600 p-3 rounded-full text-white py-4 px-8`}/>      
    </div>
  </div>
   </div>
      </div>

    </div>
  )
}

export default History
