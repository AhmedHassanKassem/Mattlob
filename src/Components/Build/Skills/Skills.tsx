import { useEffect, useState } from "react";
import Button from "../../../containers/Button"
import SideBar from "../../../containers/SideBar"
import { Plus, X } from "lucide-react";
import Input from "../../../containers/Input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Templates, { IResume, sampleResume } from "../ChooseTemplate/Templates";

const Skills = () => {
   const navigate = useNavigate()
   const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [tempId, setTempId] = useState(0);

 const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,
  }));
  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updatedSkills = [...skills, trimmed];
      setSkills(updatedSkills);
      setInputValue('');

      const updatedResume = {
        ...resumeData,
        skills: updatedSkills,
      };

      setResumeData(updatedResume);
      localStorage.setItem('resumeData', JSON.stringify(updatedResume));
    }
  };
  const deleteSkill = (skillToDelete: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updatedSkills);

    const updatedResume = {
      ...resumeData,
      skills: updatedSkills,
    };
   setResumeData(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && inputValue.trim()) {
    addSkill();
  }
};




  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = localStorage.getItem('resumeData');

    if (storedResume) {
      const parsedResume: IResume = JSON.parse(storedResume);

      const isDefault =
        parsedResume.skills?.length === 1 &&
        Object.values(parsedResume.skills[0]).every((val) =>
          typeof val === 'boolean' ? val === false : val === ''
        );

      if (isDefault || parsedResume.skills?.length === 0) {
        parsedResume.skills = [...sampleResume.resume?.skills!];
      }

      setResumeData(parsedResume);
    } else {
      setResumeData({
        ...sampleResume.resume!,
      });
    }

    if (myTempId) setTempId(myTempId);
  }, []);
    return (
  <div className="overflow-y-auto hide-scrollbar h-screen w-full bg-gray-50">
    <div className="grid grid-cols-12 h-full">
      {/* Sidebar */}
      <div
        className="col-span-2 bg-white shadow-md"
      >
        <SideBar />
      </div>

      {/* Skills Form */}
      <motion.div
        className="col-span-6 p-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <h1 className="text-4xl text-sky-700 font-bold mb-1">Now, what are your skills?</h1>
          <p className="text-gray-600 text-sky-700">Enter your skills below to make your resume more reachable...</p>
          <p className="text-xs text-red-500 pt-6">* these fields are mandatory</p>
        </div>

        <div className="w-full max-w-2xl">
          <div className="relative w-full mb-6">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPressEnter={handleKeyPress}
              placeholder="Add skills"
              className="w-full border focus:outline-none focus:ring-2 focus:ring-sky-500 px-3 py-4 border-gray-400 rounded-lg pr-36"
            />
            <div className="absolute right-2 top-2">
              <Button
                onClick={addSkill}
                disabled={!inputValue.trim()}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed py-2 px-4 rounded-md text-white transition-colors"
                btnContentClassname="p-0"
                buttonContent={
                  <div className="flex items-center gap-1">
                    <Plus size={16} />
                    <span>Add</span>
                  </div>
                }
              />
            </div>
          </div>

          {skills.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-700">Your Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-50 px-3 py-2 rounded-full shadow-md transition-colors"
                  >
                    <span className="text-gray-700 mr-2 font-bold">{skill}</span>
                    <Button
                      onClick={() => deleteSkill(skill)}
                      btnContentClassname="p-0"
                      buttonContent={
                        <span className="text-gray-500 hover:text-red-500 transition-colors">
                          <X size={16} />
                        </span>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 pt-4">
              No skills added yet. Start by typing a skill above!
            </div>
          )}
        </div>
      </motion.div>


   <motion.div
          className="col-span-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
      
 <div className="sticky top-2 max-h-full">
      <div className=" overflow-y-auto hide-scrollbar rounded">
        <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />
      </div>
    </div>
          
        </motion.div>
      {/* Navigation Buttons */}
      <div className="col-span-12 fixed bottom-0 right-0 mb-6 px-10">
        <div className="flex justify-end gap-4 text-lg font-bold">
          <Button
            className="text-sky-600 underline"
            onClick={() => navigate(-1)}
            title="Previous"
          />
          <Button
            onClick={() => navigate('/build-resume/add-summary')}
            title="Next step"
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-4 px-8 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </div>
);

}

export default Skills
