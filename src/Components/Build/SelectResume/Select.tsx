import {  ArrowLeft, ArrowRight, CloudUpload, PenLine } from "lucide-react"
import {  BounceLoader } from "react-spinners"
import Button from "../../../containers/Button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Templates, { IResume, sampleResume } from "../ChooseTemplate/Templates"


const SelectResume = () => {
 const [loading , setLoading] = useState(false)
   const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,
  }));
  const [tempId, setTempId] = useState(0);
 const navigate = useNavigate()
 useEffect(()=>{
  if(loading){
    setTimeout(()=>{
    setLoading(!loading)
    navigate("/build-resume/fill-data")
    },3000)
  }
 },[loading])
 useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
    const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;

    if (myTempId) {
      setTempId(myTempId)
      setResumeData(resume)
    }

  }, [])
return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="grid grid-cols-12">
      <motion.div
        className="col-span-12 min-h-screen"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.p
          className="text-center text-4xl font-bold pt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          What do you want to do?
        </motion.p>

        <motion.p
          className="text-center text-sm pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Tell us what do you want, and we can help you
        </motion.p>

        <motion.div
          className="flex min-h-[450px] justify-evenly items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button
            btnContentClassname="p-0"
            buttonContent={
              <motion.div
                className="w-full h-full flex flex-col justify-center items-center text-center bg-white rounded shadow-sm px-10 py-15 transition-all transform hover:shadow-lg relative hover:-translate-y-2 duration-500"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1 }}
              >
                <CloudUpload size={40} strokeWidth={1} className="text-sky-600 mb-5" />
                <p className="font-bold text-2xl">Upload my resume</p>
                <p className="text-sm max-w-sm pt-2">
                  We'll give you expert guidance to fill out your info and enhance your resume, from start to finish
                </p>
              </motion.div>
            }
          />

          <Button
            buttonContent={
              <motion.div
                className="w-full h-full flex flex-col justify-center items-center text-center rounded bg-white shadow-sm px-10 py-15 transition-all transform hover:shadow-lg relative hover:-translate-y-2 duration-500"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1 }}
              >
                <PenLine size={40} strokeWidth={1} className="text-sky-600 mb-5" />
                
                <div className="flex">
                  <div>
                    <p className="font-bold text-2xl">Build my resume</p>
                  </div>
                  <div className="scale-5 w-8 h-8 hidden">
                   <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />

                  </div>
                </div>
                <p className="text-sm max-w-sm pt-2">
                  We'll guide you through the whole process so your skills can shine
                </p>
              </motion.div>
            }
          />
        </motion.div>

        <motion.div
          className="flex justify-around items-center font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <Button
            buttonContent={
              <div className="flex gap-1 border text-sky-400 p-3 rounded-full px-10 border-2 transition-all transform hover:scale-105 duration-600 hover:bg-sky-100">
                <ArrowLeft size={20} />
                <p>Previous</p>
              </div>
            }
          />
          <Button
            onClick={() => setLoading(!loading)}
            buttonContent={
              <div className="flex gap-1 bg-sky-400 p-3 rounded-full px-10 text-white border-2 transition-all transform hover:scale-105 duration-600">
                <p>Next</p>
                <ArrowRight size={20} />
              </div>
            }
          />
        </motion.div>

        {loading && (
          <motion.div
            className="fixed inset-0 bg-white/90 text-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex justify-center items-center h-full w-full">
              <div className="flex flex-col items-center gap-4">
                <BounceLoader color="#1c398e" />
                <p className="text-sm">Preparing your template....</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  </motion.div>
)
}

export default SelectResume
