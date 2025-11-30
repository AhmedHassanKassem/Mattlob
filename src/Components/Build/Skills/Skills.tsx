import { useEffect, useState } from "react";
import Button from "../../../Containers/Button"
import SideBar from "../../../Containers/SideBar"
import { ChevronLeft, ChevronRight, Eye, LogOut, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Templates, { sampleResume } from "../ChooseTemplate/Templates";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../../../Containers/MultiSelect";
import { ICVData, IResume, ISkills } from "../../../Interfaces/interface";
import { axiosInst } from "../../../axios/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Redux/store";
import { getSkillsAction } from "../../../Redux/Skills/skillsAction";
import { clearFoundUser } from "../../../Redux/Slices/userSlice";
import { useTranslation } from "react-i18next";
import { removeCookie } from "../../../Utils/cookies";

const Skills = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.token.token)
  const [skills, setSkills] = useState<ISkills[]>([]);
  const [showPreview, setShowPreview] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const resumeColor = useSelector((state: RootState) => state.resumeColor.resumeColor)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const [searchTerm, setSearchTerm] = useState('');
  const [tempId, setTempId] = useState(0);
  const dispatch: AppDispatch = useDispatch()
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    skills: []
  }));
const isDark = useSelector((state : RootState)=> state.isDark.isDark)

  const availableSkills = useSelector((state: RootState) => state.skills.skills)
  const loading = useSelector((state: RootState) => state.skills.loading)
  const mapResumeToICVData = (): ICVData => {
    const tempId = Number(localStorage.getItem('tempId'))
    return {
      temp_id: tempId, // dynamic if needed
      heading: JSON.stringify({
        summary: resumeData.summary || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        dob: resumeData.birth_date || '',
        marital_status: resumeData.marital_status || '',
        military_status: resumeData.military_status || '',
        country: resumeData.country || '',
        city: resumeData.city || '',
        name: `${resumeData.full_name || ''}`.trim()
      }),
      work_History: JSON.stringify(resumeData.work_History || []),
      education: JSON.stringify(resumeData.education || []),
      courses: JSON.stringify(resumeData.courses || []),
      languages: JSON.stringify(resumeData.languages || []),
      skills: JSON.stringify(resumeData.skills || []),
      is_paid: false
    };
  };
  const deleteSkill = (skillToDelete: any) => {
    const updatedSkills : ISkills[] = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updatedSkills);

    const updatedResume = {
      ...resumeData,
      skills: updatedSkills,
    };
    setResumeData(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };

  const handleSkillSelect = (updated: ISkills[]) => {
    const sanitized = updated.map(s => s ?? "");

    setSkills(sanitized);

    const updatedResume = {
      ...resumeData,
      skills: sanitized,
    };

    setResumeData(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));
  };


  const getFilteredSkills = async (search: string = "") => {
    dispatch(getSkillsAction(search, token))
  };

  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = JSON.parse(localStorage.getItem('resumeData')!)
    setSkills(storedResume.skills)
    if (myTempId)
      setTempId(myTempId);
    setResumeData(storedResume)
  }, []);

  const handleNext = async () => {
    if (!resumeData?.skills || resumeData?.skills?.length < 3) {
      toast.warn("Please add at least 3 skills!");
    }
    else {
      const res = await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        navigate('/build-resume/add-links')
      }
    }
  };

  const handleLogout = () => {
    removeCookie('token')
    dispatch(clearFoundUser());
    navigate('/login')
  }
  return (
     <div
      className={`overflow-y-auto hide-scrollbar min-h-screen w-full transition-colors duration-500 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <SideBar />
        </div>

        <div className="lg:col-span-10 col-span-12 p-10">
          {/* Header */}
          <div className="flex justify-between mt-10 lg:mt-0">
            <div className="mb-6">
              <h1
                className={`lg:text-4xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-sky-700"
                }`}
              >
                {t("Now, what are your skills?")}
              </h1>
              <p
                className={`lg:text-sm text-xs w-45 lg:w-full ${
                  isDark ? "text-gray-300" : "text-gray-600 text-sky-700"
                }`}
              >
                {t("Enter your skills below to make your resume more reachable...")}
              </p>
              <p className="text-xs text-red-500 pt-6">
                {t("* these fields are mandatory")}
              </p>
            </div>

            <div>
              <Button
                onClick={handleLogout}
                buttonContent={
                  <div
                    className={`flex gap-1 text-sm p-2 shadow-md transition-all transform hover:shadow-lg duration-500 ${
                      isDark
                        ? "bg-gray-800 text-sky-400"
                        : "bg-white text-[#0069a8]"
                    }`}
                  >
                    <LogOut size={18} />
                    <p>{t("signOut")}</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* Skills Section */}
          <MultiSelectDropdown
            opened={isOpen}
            setOpened={setIsOpen}
            onChange={handleSkillSelect}
            selectedValues={skills}
            value={searchTerm}
            options={availableSkills}
            loading={loading}
            labelKey={lang === "en" ? "en_Name" : "ar_Name"}
            divContent={
              <>
                <div
                  className={`py-2 ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="relative">
                    <Search
                      size={16}
                      className={`absolute left-3 top-3 ${
                        isDark ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);
                        getFilteredSkills(value);
                      }}
                      placeholder={t("Find your skills...")}
                      className={`w-full pl-10 pr-3 py-2 text-sm border-b focus:outline-none transition-colors ${
                        isDark
                          ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-sky-500 placeholder-gray-400"
                          : "border-gray-300 focus:border-sky-500 text-gray-900"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </>
            }
            selectedValuesContent={
              skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-2 py-1 shadow-md transition-colors ${
                        isDark
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="mr-2 font-bold">{lang === 'en' ? skill.en_Name : skill.ar_Name}</span>
                      <button
                        onClick={() => deleteSkill(skill)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-0 bg-transparent border-none"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`font-poppins text-sm font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-gray-700"
                      }`}>
                  {t("No skills added yet!")}
                </p>
              )
            }
            setValue={setSearchTerm}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div
            onClick={() => setShowPreview(!showPreview)}
            className="fixed inset-0 bg-gray-900/75 z-50 flex justify-center animate__animated animate__fadeIn"
          >
            <div
              className={`lg:scale-100 scale-60 w-180 mt-4 animate__animated animate__fadeInUp max-h-180 rounded-xl overflow-hidden ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-5">
                <X
                  className={`hover:text-red-500 cursor-pointer ${
                    isDark ? "text-sky-400" : "text-sky-700"
                  }`}
                  onClick={() => setShowPreview(!showPreview)}
                />
              </div>
              <div className="py-5 max-h-150 overflow-y-auto hide-scrollbar rounded">
                <Templates
                  selectedTempId={tempId}
                  resume={{ ...sampleResume, ...resumeData }}
                  color={resumeColor}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div
          className={`col-span-12 fixed bottom-0 right-0 p-2 w-full border shadow-md transition-colors duration-300 ${
            isDark
              ? "bg-gray-800 border-gray-700 shadow-black"
              : "bg-white border-gray-200 shadow-md"
          }`}
        >
          <div className="flex justify-center lg:justify-end">
            <div className="flex lg:gap-5 gap-10 text-lg font-bold">
              <Button
                className={`rounded-md p-2 border transition-all duration-300 shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark
                  ? "text-white border-white shadow-white"
                  : "text-sky-600 border-sky-200 shadow-sky-300"
                  }`}
                onClick={() => navigate(-1)}
                btnTitle="Go Previous"
                buttonContent={<div className="text-sm flex items-center justify-center w-20">    
                {lang === "en" ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                <p className="text-sm">{t("Previous")}</p>
                </div>}
              />

              <Button
                onClick={() => setShowPreview(true)}
                btnTitle="Show Preview"
                className={`rounded-md p-2 border transition-all duration-300 shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark
                  ? "text-white border-white shadow-white"
                  : "text-sky-600 border-sky-200 shadow-sky-300"
                  }`}
                buttonContent={<div className="flex items-center w-32 justify-center gap-1"><Eye /> <p className="text-sm">{t("Preview")}</p></div>}
              />

              <Button
                onClick={handleNext}
                btnTitle="Go Next"
                className={`rounded-md p-2 transition-all border duration-300 shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark
                  ? "text-white border-white shadow-white"
                  : "text-sky-600 border-sky-200 shadow-sky-300"
                  }`}
                buttonContent={<div className="text-sm flex items-center justify-center w-20">
                <p className="text-sm">{t("Next")}</p>
                {lang === "en" ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </div>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Skills
