import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import SideBar from "../../../containers/SideBar"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Templates, { IResume, sampleResume } from "../ChooseTemplate/Templates"

const Fill = () => {
  const navigate = useNavigate()
  const [tempId, setTempId] = useState(0)
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,
  }));


  const handleChange = (field: keyof IResume, value: any) => {
    const updatedResume = {
      ...resumeData,
      [field]: value,
    };

    setResumeData(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };


  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
    const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;

    if (myTempId) {
      setTempId(myTempId)
      setResumeData(resume)
    }

  }, [])

  return (
    <div className="overflow-y-auto hide-scrollbar h-screen w-full bg-gray-50">
      <div className="grid grid-cols-12 h-full">

        <motion.div
          className="col-span-2 bg-white shadow-md"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SideBar />
        </motion.div>

        <motion.div
          className="col-span-6 p-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <h1 className="text-4xl text-sky-700 font-bold mb-1">Start filling your data</h1>
            <p className="text-gray-600 text-sky-700">Enter your data below to make your resume more reachable...</p>
            <p className="text-xs text-red-500 pt-6">* these fields are mandatory</p>
          </div>

          <form className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                label="First name"
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => handleChange("last_name", e.target.value)}
                label="Last name" />
            </div>
            <div className="col-span-2">
              <Input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => handleChange("city", e.target.value)}
                label="City" />
            </div>
            <div className="col-span-2 flex gap-2">
              <Input className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none w-38 focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => handleChange("country", e.target.value)}
                label="Country" />
              <Input className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none w-38 focus:ring-2 focus:ring-sky-500 transition"
                label="Postal Code" />
            </div>
            <div className="col-span-2">
              <Input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => handleChange("phone", e.target.value)}
                label="Phone" />
            </div>
            <div className="col-span-2">
              <Input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                onChange={(e) => handleChange("email", e.target.value)}
                label="Email" />
            </div>
          </form>

        </motion.div>

        <div
          className="col-span-4  shadow-inner"
        >
          <div className="col-span-4 w-full">
    <div className="sticky top-2 max-h-full">
      <div className=" overflow-y-auto hide-scrollbar rounded">
        <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />
      </div>
    </div>
          </div>
        </div>

        <div className="col-span-12 fixed bottom-0 right-0 py-6 px-10 ">
          <div className="flex justify-end gap-4 text-lg font-bold">
            <Button
              className="text-sky-600 underline"
              onClick={() => navigate(-1)}
              title="Previous"
            />
            <Button
              onClick={() => navigate('/build-resume/work-history')}
              title="Next step"
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-4 px-8 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fill
