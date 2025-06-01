import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import SideBar from "../../../containers/SideBar"

const Finish = () => {
  return (
    <div>
       <div className="grid grid-cols-12">
      <div className="col-span-2">
       <SideBar/>
      </div>
      <div className="col-span-10 max-w-4xl">
         <div className="p-5">
      <Button className="underline text-sky-500" title="Go back" />
    </div>
       <div className="mx-5">
      <p className="text-3xl font-bold">Now add some links to make your resume connectable</p>
      <p className="text-sm">Add some links below if exists , to make your resume more reachable...</p>
    </div> 
     <div className="pt-5">
          <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="Github" />
     </div> 
       <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="LinkedIn" />
     </div> 
       <div className="col-span-6 px-4">
        <Input className="border focus:outline-none py-2 px-2 w-full border-gray-400" label="Gmail" />
     </div>
     </div>
     <div className="col-span-12 absolute right-0 bottom-0 mb-10 px-10">
     <div className="flex justify-end items-center ">
    <div className="flex gap-4 text-lg font-bold">
     <Button className="text-sky-600" titleClassname="underline" title="Previous" />
    <Button title="Generate resume" 
    titleClassname={`bg-sky-600 p-3 rounded-full text-white py-4 px-8`}/>      
    </div>
  </div>
   </div> 
    </div> 
    </div> 
    </div>
  )
}

export default Finish
