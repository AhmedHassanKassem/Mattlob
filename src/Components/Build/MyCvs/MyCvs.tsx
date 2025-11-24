import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../Redux/store"
import { useEffect } from "react";
import Templates from "../ChooseTemplate/Templates";
import { useNavigate } from "react-router-dom";
import { setResumeColor } from "../../../Redux/Slices/resumeColorSlice";
import { SquareLoader } from "react-spinners";
import { IResume } from "../../../Interfaces/interface";
import { getCvDataAction } from "../../../Redux/GetCvData/getCvAction";
import { FileWarning } from "lucide-react";
import Button from "../../../Containers/Button";
import { useTranslation } from "react-i18next";

const MyCvs = () => {
    const cvData = useSelector((state: RootState) => state.cvData.cvData);
    const cvsLoading = useSelector((state: RootState) => state.cvData.loading);
    const token = useSelector((state: RootState) => state.token.token);
    const navigate = useNavigate()
    const {t} = useTranslation()
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        dispatch(getCvDataAction(token))

    }, [token])
    const tryParseJSON = (data: any) => {
        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    };
   

    const getTempById = (tempId: number) => {
        const findTemp = cvData.find((temp: any) => temp.temp_id == tempId)
        if (findTemp) {
            const heading = tryParseJSON(findTemp?.heading);
            const experience = tryParseJSON(findTemp?.work_History || '[]');
            const education = tryParseJSON(findTemp?.education || '[]');
            const skills = tryParseJSON(findTemp?.skills || '[]');
            const links = tryParseJSON(findTemp?.personal_Links || '[]');
            const languages = tryParseJSON(findTemp?.languages || '[]');
            const courses = tryParseJSON(findTemp?.courses || '[]');
            const image = tryParseJSON(findTemp?.image || null);

            const fullResume: IResume = {
                full_name: heading?.name || '',
                city: heading?.city || '',
                country: heading?.country || '',
                phone: heading?.phone || '',
                email: heading?.email || '',
                summary: heading?.summary || '',
                marital_status: heading?.marital_status || '',
                military_status: heading?.military_status || '',
                birth_date: heading?.dob || '',
                work_History: experience || [],
                skills: skills || [],
                languages: languages || [],
                education: education || [],
                courses : courses || [],
                image: image || null,
                personal_Links : links || []
                
            };
           console.log(cvData);
           
            localStorage.setItem("resumeData", JSON.stringify(fullResume))
            if (findTemp.color !== null && findTemp.color !== undefined) {
                localStorage.setItem("color", findTemp.color);
                dispatch(setResumeColor(findTemp.color))
            } else {
                localStorage.setItem("color", "#2563eb");
                dispatch(setResumeColor('#2563eb'))

            }
            localStorage.setItem("tempId", tempId.toString())
            navigate("/build-resume/choose-temp")
        }
    }
    const baseWidth = 700;
    const scale = 0.3;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10">
            {cvsLoading ? <div className="flex justify-center items-center min-h-screen">
                <SquareLoader color="#5275c2ff" size={45} />
            </div> : cvData.length == 0 ?<div className="flex justify-center items-center min-h-screen bg-gray-50">
  <div className="flex flex-col items-center gap-4 text-center">
    <p className="font-bold text-2xl text-gray-800">{t("You don't have any added resumes yet")}</p>
    <FileWarning size={96} className="text-sky-500 animate-pulse mb-5" />
    <Button title="Go back" onClick={()=>navigate(-1)} titleClassname="bg-indigo-600 text-white p-5 rounded-4xl hover:shadow-lg  transition-all duration-400 shadow-indigo-300"/>
  </div>
</div>

                      
                : <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t("Your CV Collection")}</h1>
                        <p className="text-gray-600 text-lg">{t("Manage and preview your professional resumes")}</p>
                    </div>

                    <div className="flex flex-wrap gap-30 justify-center items-center">
                        {cvData.map((temps: any) => {
                            const headingObj = temps.heading ? JSON.parse(temps.heading) : {};
                            const nameParts = (headingObj.name || "").split(" ");
                            const resume = {
                                ...temps,
                                ...headingObj,
                                first_name: nameParts[0],
                                last_name: nameParts.slice(1).join(" "),
                                education: temps.education ? JSON.parse(temps.education) : [],
                                skills: temps.skills ? temps.skills.split(",").map((s: string) => s.trim()) : [],
                                experience: temps.work_History ? JSON.parse(temps.work_History) : [],
                            }

                            return <div
                                key={temps.temp_id}
                                className="group relative bg-white scrollbar-hide rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
                                style={{ maxHeight: `${1200 * scale}px`, overflow: 'auto' }}
                            >
                                {/* Gradient header */}
                                {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div> */}

                                {/* Hover Action Buttons */}
                                <div className="sticky  scrollbar-hide top-4  left-4 pl-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform  group-hover:translate-y-0 z-10">
                                    <div className="flex space-x-2">
                                        <button onClick={() => getTempById(temps.temp_id)} className="bg-white/90 hover:bg-blue-500 hover:text-white text-blue-600 p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="bg-white/90 hover:bg-red-500 hover:text-white text-red-600 p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Card content with padding */}
                                <div className="p-6 scrollbar-hide">
                                    {/* Profile section */}
                                    <div className="flex items-center mb-4 scrollbar-hide">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                                            {resume.first_name?.[0]}{resume.last_name?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">
                                                {resume.first_name} {resume.last_name}
                                            </h3>
                                            <p className="text-gray-500 text-sm">{resume.email}</p>
                                        </div>
                                    </div>

                                    {/* CV Preview Container */}
                                    <div className="bg-gray-50 rounded-xl p-4 scrollbar-hide">
                                        <div
                                            className="relative bg-white rounded-lg shadow-sm overflow-hidden scrollbar-hide"
                                            style={{
                                                width: `${baseWidth * scale}px`,
                                                height: `${1100 * scale}px`,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    transform: `scale(${scale})`,
                                                    transformOrigin: "top left",
                                                    width: `${baseWidth}px`,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        maxHeight: `${900 / scale}px`,
                                                        overflowY: "auto",
                                                    }}
                                                    className="scrollbar-hide"
                                                >
                                                    <Templates selectedTempId={resume.temp_id} resume={resume} userTemps={cvData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>}
        </div>
    );

}

export default MyCvs
