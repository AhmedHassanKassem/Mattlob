import { useState } from "react";
import Button from "../../../containers/Button"
import SideBar from "../../../containers/SideBar"
import { Plus, X } from "lucide-react";
import Input from "../../../containers/Input";
import { useNavigate } from "react-router-dom";

const Skills = () => {
   const navigate = useNavigate()
   const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      setSkills([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const deleteSkill = (skillToDelete : string) => {
    setSkills(skills.filter(skill => skill !== skillToDelete));
  };

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && inputValue.trim()) {
    addSkill();
  }
};

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
      <p className="text-3xl font-bold">Now , What is your skills?</p>
      <p className="text-sm">Enter your skills below , to make your resume more reachable...</p>
      <p className="text-sm pt-10">* these fields are mandatory</p>
    </div>

 <div className="max-w-2xl mx-auto p-6">
  <div className="relative flex items-center mb-6">
  <Input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyPressEnter={handleKeyPress}
  placeholder="Add Skills"
  className="min-w-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 px-3 py-4 border-gray-400 rounded-lg"
/>

         <Button onClick={addSkill} className="absolute right-15 top-5 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed py-2 px-3 rounded-md text-white transition-colors"
 btnContentClassname="p-0" disabled={!inputValue.trim()} buttonContent={
          <div className="flex"><Plus size={20} />
        <p>Add skill</p>
          </div>
         }/>
      
      </div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-700">Your Skills:</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50  px-3 py-2 rounded-full shadow-md transition-colors"
              >
                <span className="text-gray-700 mr-2 font-bold">{skill}</span>
                <Button onClick={() => deleteSkill(skill)} 
 btnContentClassname="p-0"  buttonContent={
          <div  className="text-gray-500 hover:text-red-500 transition-colors">
            <X size={16} />

          </div>
         }/>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No skills added yet. Start by typing a skill above!
        </div>
      )}
     </div>
      <div className="col-span-12 absolute right-0 bottom-0 mb-10 px-10">
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
    </div>
  )
}

export default Skills
