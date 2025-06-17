import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import SideBar from "../../../containers/SideBar"
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useState } from "react";
import Templates, { IResume, sampleResume } from "../ChooseTemplate/Templates";

const Summary = () => {
   const navigate = useNavigate()
  //  const [summary , setSummary]  =useState("")
     const [tempId, setTempId] = useState(0);
   
    const [resumeData, setResumeData] = useState<IResume>(() => ({
       ...sampleResume.resume!,
     }));
     

     const handleChangeSummary = (e : ChangeEvent<HTMLTextAreaElement>)=>{
       const {name , value} = e.target
       const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;
       if(name == "summary"){
               const updatedResume = {
      ...resume,
      summary: value
    };
   setResumeData(updatedResume)
      localStorage.setItem('resumeData', JSON.stringify(updatedResume));
       }
     }
       useEffect(() => {
         const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
         const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;
     
         if (myTempId) {
           setTempId(myTempId)
           setResumeData(resume)
         }
     
       }, [])
       useEffect(() => {
        const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
         const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;
         if (resume) {
   

      const isDefault =
        resume.summary?.length === 1 &&
        Object.values(resume.summary).every((val) =>
          typeof val === 'boolean' ? val === false : val === ''
        );

      if (isDefault || resume.summary?.length === 0) {
        resume.summary = sampleResume.resume?.summary!;
      }

      setResumeData(resume);
    } else {
      setResumeData({
        ...sampleResume.resume!,
      });
    }
         if (myTempId) {
           setTempId(myTempId)
           setResumeData(resume)
         }
  
     
       }, [])
  return (
  <div className="overflow-y-auto hide-scrollbar h-screen w-full bg-gray-50">
    <div className="grid grid-cols-12 h-full">
      
      {/* Sidebar */}
      <div
        className="col-span-2 bg-white shadow-md"
      >
        <SideBar />
      </div>

      {/* Summary Form */}
      <motion.div
        className="col-span-6 p-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <h1 className="text-4xl text-sky-700 font-bold mb-1">Tell us more about you</h1>
          <p className="text-gray-600 text-sky-700">Enter your summary below to make your resume more reachable...</p>
          <p className="text-xs text-red-500 pt-6">* this field is mandatory</p>
        </div>

        <div className="w-full max-w-2xl">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="summary"
            onChange={handleChangeSummary}
            className="w-full h-40 border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            placeholder="Write a brief summary about yourself..."
          />
        </div>
      </motion.div>

      {/* Live Preview */}

      <motion.div
          className="col-span-4 shadow-inner"
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
            onClick={() => navigate('/build-resume/finalize')}
            title="Next step"
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-4 px-8 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </div>
);

}

export default Summary
