
import { useNavigate } from "react-router-dom"
import Button from "../../../Containers/Button"
import Input from "../../../Containers/Input"
import SideBar from "../../../Containers/SideBar"
import { useEffect, useRef, useState } from "react"
import Templates, {  sampleResume } from "../ChooseTemplate/Templates"
import { ICVData, IResume } from "../../../Interfaces/interface"
import { ChevronLeft, ChevronRight, DownloadCloudIcon, Eye, LogOut, Trash2, X } from "lucide-react"
import { axiosInst } from "../../../axios/axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../Redux/store"
import { clearFoundUser } from "../../../Redux/Slices/userSlice"
import { t } from "i18next"
import TemplatePDF from "../ChooseTemplate/TemplatePDF"
const Finish = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()
  const resumeColor = useSelector((state: RootState) => state.resumeColor.resumeColor)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,
  }));
const isDark = useSelector((state : RootState)=> state.isDark.isDark)

const [links, setLinks] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false)
  const token = useSelector((state: RootState) => state.token.token)
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isPaid, setIsPaid] = useState(true);
  const [tempId, setTempId] = useState(0);
  const handleAddLink = (updated: string[]) => {
    setResumeData(prev => {
      const updatedResume = { ...prev, personal_Links: updated };
      localStorage.setItem("resumeData", JSON.stringify(updatedResume));
      return updatedResume;
    });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
    handleAddLink(updated);
  };

  const mapResumeToICVData = (): ICVData => {
    const tempId = Number(localStorage.getItem('tempId'))
    const color = (localStorage.getItem('color'))
    return {
      temp_id: tempId,
      color: color!,
      heading: JSON.stringify({
        summary: resumeData.summary || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        country: resumeData.country || '',
        dob: resumeData.birth_date || '',
        city: resumeData.city || '',
        marital_status: resumeData.marital_status || '',
        military_status: resumeData.military_status || '',
        name: `${resumeData.full_name || ''}`.trim()
      }),
      work_History: JSON.stringify(resumeData.work_History || []),
      education: JSON.stringify(resumeData.education || []),
      courses: JSON.stringify(resumeData.courses || []),
      skills: JSON.stringify(resumeData.skills || []),
      languages: JSON.stringify(resumeData.languages || []),
      personal_Links: JSON.stringify(resumeData.personal_Links || []),
      is_paid: false
    };
  };
  


  const checkForPurchase = async () => { 
    if (mapResumeToICVData().is_paid === true) {
      setIsPaid(!isPaid)
    } else {
      await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`
        }
      })
      
    //  downloadPDF()
    window.print()
      // localStorage.removeItem('resumeData')
      // localStorage.removeItem('tempId')
      // localStorage.removeItem('color')
    }
  }

useEffect(() => {
  const resume = JSON.parse(localStorage.getItem('resumeData') || "null") ?? sampleResume.resume;
  const myTempId = JSON.parse(localStorage.getItem('tempId')!);
  const storedLinks = Array.isArray(resume.personal_Links) ? resume.personal_Links : ['', ''];
  setLinks(storedLinks);

  if (myTempId > 0) {
    setTempId(myTempId);
    setResumeData(resume);
  }
}, []);

  const addNewLink = () => {
    const updated = [...links, ""];
    setLinks(updated);
    handleAddLink(updated);
  };

  const removeLink = (index: number) => {
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
    handleAddLink(updated);
  };
  const handleLogout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    dispatch(clearFoundUser());
    navigate('/login')
  }


  return (
   <><div className={`min-h-screen relative w-full no-print transition-colors duration-500 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="grid grid-cols-12 h-full">

        {!isPaid && (
          <div
            className={`fixed inset-0 z-50 min-h-screen flex items-center justify-center ${isDark ? "bg-gray-800/80" : "bg-gray-900/75"}`}
            onClick={() => setIsPaid(!isPaid)}
          >
            <div
              className={`max-w-4xl p-6 font-poppins font-bold animate__animated animate__bounceInDown rounded-lg shadow-xl transition-all ${isDark
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white text-black"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <p>You must purchase this resume</p>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="col-span-2 no-print">
          <SideBar />
        </div>

        {/* Form Section */}
        <div className="lg:col-span-10 col-span-12 p-10 transition-all duration-300">
          <div className="flex justify-between mt-10 lg:mt-0">
            <div className="mb-6">
              <h1
                className={`lg:text-4xl font-bold mb-1 w-52 lg:w-full ${isDark ? "text-white" : "text-sky-700"}`}
              >
                {t("Add links to make your resume connectable")}
              </h1>
              <p
                className={`lg:text-sm text-xs w-45 lg:w-full ${isDark ? "text-gray-400" : "text-gray-600 text-sky-700"}`}
              >
                {t("Add any relevant personal/professional links.")}
              </p>
            </div>

            <div>
              <Button
                onClick={handleLogout}
                buttonContent={<div
                  className={`flex gap-1 text-sm p-2 shadow-md transition-all transform hover:shadow-lg duration-500 rounded-md ${isDark
                      ? "bg-gray-700 text-sky-400"
                      : "bg-white text-[#0069a8]"}`}
                >
                  <LogOut size={18} />
                  <p>{t("signOut")}</p>
                </div>} />
            </div>
          </div>

          {/* Links Inputs */}
          <div className="grid grid-cols-1 gap-4">
            {links?.map((link, index) => (
              <div key={index} className="flex gap-2 items-center w-full">
                <div className="grid grid-cols-1 w-full">
                  <Input
                    name={index.toString()}
                    label={index === 0
                      ? "GitHub"
                      : index === 1
                        ? "LinkedIn"
                        : `${t("Other Link")} ${index - 1 + 1}`}
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                        : "border-gray-300 text-gray-900"}`} />
                </div>
                {index >= 2 && (
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className={`px-1 mt-4 hover:underline cursor-pointer transition ${isDark ? "text-red-400 hover:text-red-300" : "text-red-500"}`}
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            ))}

            <Button
              className={`mb-10 font-bold p-2 rounded-md transition-all ${isDark
                  ? "bg-sky-600 text-gray-100 hover:bg-sky-500"
                  : "bg-sky-200 text-black hover:bg-sky-300"}`}
              title1={t("Add more links")}
              titleClassname1="px-2"
              onClick={addNewLink}
              iconClass="fa fa-plus" />
          </div>
        </div>

        {/* Hidden Preview */}


        {/* Preview Modal */}
        {showPreview && (
          <div
            onClick={() => setShowPreview(!showPreview)}
            className={`fixed inset-0 z-50 flex justify-center animate__animated animate__fadeIn ${isDark ? "bg-gray-800/80" : "bg-gray-900/75"}`}
          >
            <div
              className={`lg:scale-100 scale-60 mt-4 max-h-180 rounded-xl animate__animated animate__fadeInUp overflow-hidden transition-all ${isDark
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white shadow-lg"} w-180`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-2">
                <X
                  className={`text-xs hover:shadow-md cursor-pointer rounded ${isDark
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "bg-red-500 text-white"}`}
                  size={20}
                  onClick={() => setShowPreview(!showPreview)} />
              </div>
              <div className="py-5 max-h-150 overflow-y-auto hide-scrollbar rounded">
                <Templates
                  selectedTempId={tempId}
                  color={resumeColor}
                  disableScale={true}
                  resume={{ ...sampleResume, ...resumeData }} />
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div
          className={`col-span-12 fixed bottom-0 right-0 p-2 w-full border shadow-md transition-all no-print ${isDark
              ? "bg-gray-800 border-gray-700 shadow-sky-900/30"
              : "bg-white border-gray-200 shadow-sky-300"}`}
        >
          <div className="flex justify-center lg:justify-end">
            <div className="flex lg:gap-5 gap-15 text-lg font-bold">
              <Button
                className={`rounded-full p-2 transition-all duration-300 border shadow-sm hover:shadow-md ${isDark
                    ? "text-white border-white shadow-white"
                    : "text-sky-600 border-sky-200 hover:shadow-md shadow-sky-300"}`}
                onClick={() => navigate(-1)}
                btnTitle="Go Previous"
                buttonContent={lang === "en" ? <ChevronLeft /> : <ChevronRight />} />

              <Button
                onClick={() => setShowPreview(true)}
                btnTitle="Show Preview"
                className={`rounded-full p-2 transition-all duration-300 border shadow-sm hover:shadow-md ${isDark
                    ? "text-white border-white shadow-white"
                    : "text-sky-600 border-sky-200 hover:shadow-md shadow-sky-300"}`}
                buttonContent={<Eye />} />

              <Button
                btnTitle="Download CV"
                onClick={checkForPurchase}
                className={`text-sm rounded-full p-2 transition-all duration-300 border shadow-sm hover:shadow-md ${isDark
                    ? "text-white border-white shadow-white"
                    : "text-sky-600 border-sky-200 hover:shadow-md shadow-sky-300"}`}
                buttonContent={<DownloadCloudIcon />} />
            </div>
          </div>
        </div>

      </div>

    </div>
    <div className="cv-print-area hidden print:block">
  <TemplatePDF
    ref={resumeRef}
    selectedTempId={tempId}
    disableScale={true}
    resume={resumeData}
    color={resumeColor} />
</div>
</>
  );
}

export default Finish
