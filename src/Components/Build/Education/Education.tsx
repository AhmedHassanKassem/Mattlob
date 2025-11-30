import { useNavigate } from "react-router-dom"
import Button from "../../../Containers/Button"
import Select from "../../../Containers/Select"
import SideBar from "../../../Containers/SideBar"
import Templates, { sampleResume } from "../ChooseTemplate/Templates"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Eye, LogOut, Pen, Trash2, X } from "lucide-react"
import { toast } from "react-toastify"
import { ICountry, ICVData, IEducation, IGovernment, IQualifs, IQualifsType, IResume, ISpecialty, IUniversityAndInsts } from "../../../Interfaces/interface"
import { axiosInst } from "../../../axios/axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../Redux/store"
import { clearFoundUser } from "../../../Redux/Slices/userSlice"
import Courses from "../Courses/Courses"
import { t } from "i18next"
import RadioButton from "../../../Containers/Radiobutton"
import { BounceLoader } from "react-spinners"
import { removeCookie } from "../../../Utils/cookies"

const Education = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()
  const token = useSelector((state: RootState) => state.token.token)
  const resumeColor = useSelector((state: RootState) => state.resumeColor.resumeColor)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTab, setSelectedTab] = useState("education")
  const [countries, setCountries] = useState<ICountry[]>([])
  const [governs, setGoverns] = useState<IGovernment[]>([])
  const [specialities, setSpecialities] = useState<ICountry[]>([])
  const isDark = useSelector((state: RootState) => state.isDark.isDark)
  const [universities, setUniveristies] = useState<IUniversityAndInsts[]>([])
  const [eduId, setEduId] = useState(0);
  const [qualifs, setQualifs] = useState<IQualifsType[]>([]);
  const [colleges, setColleges] = useState<IQualifs[]>([]);
  const [Insts, setInsts] = useState<IQualifs[]>([]);
  const [loadingUnivsOrInsts, setLoadingUnivsOrInsts] = useState(false);

  const [edu, setEdu] = useState<IEducation>({
    id: 0,
    edu_level: "",
    university: {},
    institute: {},
    specialty: {},
    edu_type: true,
    college: {},
    country: {},
    city: {},
    from_year: '',
    to_year: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IEducation, string>>>({});
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    education: [],
  }));
  const [tempId, setTempId] = useState(0);
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);




  const handleChangeCountry = async (field: keyof IEducation, value: number) => {
    let findObj;
    if (field === "country") {
      findObj = countries.find((c: ICountry) => c.id === value)
      await getGoverns(findObj?.id!)
    } else {
      findObj = governs.find((c: ICountry) => c.id === value)
    }
    setEdu({
      ...edu,
      [field]: findObj
    })

  };



  const handleEduChange = async (field: keyof IEducation, value: any) => {
    if (field === "edu_level") {
      const findQualifs: IQualifsType = qualifs.find((s: IQualifsType) => s.id == value)!
      setEdu(prev => ({ ...prev, [field]: findQualifs?.en_name! }));
      await getAllUnivsOrInstitutesByType(Number(value));
    }

    setEdu(prev => ({
      ...prev,
      [field]: value
    }))
  }
  const handleChangeCollegeOrInst = async (field: keyof IEducation, value: number) => {
    let selectedObj: any;

    if (field === "college") {
      selectedObj = colleges.find((x) => x.id === value);
    
    }
    else if (field === "university") {
      selectedObj = universities.find((x) => x.id === value);
    }
    else if (field === "institute") {
      selectedObj = Insts.find((x) => x.id === value);
    }
    else if (field === "specialty") {
      selectedObj = specialities.find((x) => x.id === value);
    }

    setEdu((prev) => ({
      ...prev,
      [field]: selectedObj || {}
    }));
  };



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
    };
  };
  const addEducation = () => {
    const newErrors: Partial<Record<keyof IEducation, string>> = {};
    try {
      const currentEdu = resumeData.education || [];

      const isDefaultOnly =
        currentEdu.length === 2 &&
        currentEdu.every((exp) =>
          sampleResume.resume?.education?.some(
            (sample) =>
              JSON.stringify({ ...sample, id: undefined }) ===
              JSON.stringify({ ...exp, id: undefined })
          )
        );

      let cleanedEducation = isDefaultOnly ? [] : currentEdu;
      let updatedEducation;

      // تحديث او إضافة جديد
      if (eduId > 0) {
        updatedEducation = cleanedEducation.map((educ) =>
          educ.id === eduId ? { ...edu, id: eduId } : educ
        );
      } else {
        const maxId = cleanedEducation.reduce(
          (max, edu) => (edu.id && edu.id > max ? edu.id : max),
          0
        );
        const newEdu = { ...edu, id: maxId + 1 };
        updatedEducation = [...cleanedEducation, newEdu];
      }

      // 🎯 تظبيط منطق المؤهل
      const isHighEdu = edu.edu_level === "1"; // مؤهل عالي
      const isInstituteEdu = edu.edu_level === "2"; // معهد

      // 🎓 التحقق من البيانات المطلوبة
      (Object.keys(edu) as (keyof IEducation)[]).forEach((key) => {
        const value = edu[key];
        const isEmpty = isFieldEmpty(value);

        // 🔹 لو مؤهل عالي → الجامعة + الكلية فقط
        if (isHighEdu) {
          if (key === "institute") return;
          if (key === "university" || key === "college") {
            if (isEmpty) newErrors[key] = t("Required");
            return;
          }

        }

        // 🔹 لو معهد → المعهد فقط
        if (isInstituteEdu) {
          if (key === "university" || key === "college") return;
          if (key === "institute") {
            if (isEmpty) newErrors[key] = t("Required");
            return;
          }
        }

        // 🔹 التخصص مطلوب
        if (key === "specialty" && isEmpty) {
          newErrors[key] = t("Required");
          return;
        }
if (
        edu.from_year &&
        edu.to_year &&
        Number(edu.from_year) > Number(edu.to_year)
      ) {
        newErrors.from_year = t("Start date cannot be after end date");
      }

        if (["country", "city", "from_year", "to_year"].includes(key) && isEmpty) {
          newErrors[key] = t("Required");
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const updatedResume: IResume = {
          ...resumeData,
          education: updatedEducation,
        };

        setResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));
        setCountries([])
        setSpecialities([])
        setGoverns([])
        setEdu({
          id: 0,
          edu_level: "",
          edu_type: true,
          college: {},
          university: {},
          institute: {},
          specialty: {},
          country: {},
          city: {},
          from_year: "",
          to_year: "",
        });
        setEduId(0);
      }
    } catch (error) {
      console.error("Error in add Education:", error);
    }
  };

  const isFieldEmpty = (value: any): boolean => {
    // لو string
    if (typeof value === "string") return value.trim() === "";

    // لو number
    if (typeof value === "number") return false;

    // لو boolean
    if (typeof value === "boolean") return false;

    // null أو undefined
    if (value === null || value === undefined) return true;

    // لو object
    if (typeof value === "object") {
      // object فاضي {}
      if (Object.keys(value).length === 0) return true;

      // object فيه القيمة الأساسية id أو name
      if ("id" in value && (value.id === null || value.id === undefined || value.id === "")) {
        return true;
      }

      return false;
    }

    return false;
  };


  const getEduById = async (expId: number) => {
    setEduId(expId)


    const findEdu: IEducation = resumeData.education?.find((exp: IEducation) => exp.id == expId)!
    getAllUnivsOrInstitutesByType(Number(findEdu.edu_level))
    if (findEdu.edu_level === "1") {
      await getSpecialitiesOfColleges(findEdu.college.id)
    } else if (findEdu.edu_level === "2") {
      await getSpecialitiesOfInstitutes(findEdu.institute.id)
    }
    await getGoverns(findEdu.country.id!)
    if (findEdu) {
      setEdu({
        edu_level: findEdu.edu_level,
        edu_type: findEdu.edu_type,
        college: findEdu.college,
        country: findEdu.country,
        city: findEdu.city,
        university: findEdu.university,
        institute: findEdu.institute,
        specialty: findEdu.specialty,
        from_year: findEdu.from_year,
        to_year: findEdu.to_year,
      })
    }
  }
  const deleteEdu = (eduId: number) => {
    const updatedEdu = resumeData.education?.filter(
      (edu) => edu.id !== eduId
    );

    const updatedResume: IResume = {
      ...resumeData,
      education: updatedEdu,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };
  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = JSON.parse(localStorage.getItem('resumeData')!)
    if (myTempId)
      setTempId(myTempId);
    setResumeData(storedResume)
  }, []);
  const handleNext = async () => {
    if (resumeData.education?.length === 0) {
      toast.warn("Please add at least one education!")
    } else {
      const res = await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        navigate('/build-resume/add-skills')
      }
    }


  };

  const handleLogout = () => {
    removeCookie('token')
    dispatch(clearFoundUser());
    navigate('/login')
  }



  useEffect(() => {
    getAllEduLevels();
    getAllEduTypes()
    const tab = localStorage.getItem('tabSelected')
    if(tab){
      selectTab(tab)
    }
  }, []);


  const getAllUnivsOrInstitutesByType = async (levelId: number) => {
    setLoadingUnivsOrInsts(true); // ⏳ بدء التحميل
    try {
      setUniveristies([]);
      setInsts([]);
      const res = await axiosInst.get('/api/Common/GetUniversityInstituteByEducationType', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: { id: levelId },
      });

      if (res?.data?.data) {
        if (levelId == 1) {
          setUniveristies(res.data.data);
        } else {
          setInsts(res.data.data);
        }
      } else {
        if (levelId == 1) {
          setUniveristies([]);
        } else {
          setInsts([]);
        }
      }
    } catch (error) {
      console.error("error getting edu data", error);
      if (levelId === 1) {
        setUniveristies([]);
      } else {
        setInsts([]);
      }
    } finally {
      setLoadingUnivsOrInsts(false); // ✅ انتهاء التحميل
    }
  };

  const getAllEduTypes = async () => {
    const res = await axiosInst.get('/api/Common/GetAllEducation', {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res) {
      setColleges(res.data.data);
    } else {
      console.log("error getting edu types");
    }
  };
  const getAllEduLevels = async () => {
    const res = await axiosInst.get('/api/Common/GetAllEducationType', {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res) {
      setQualifs(res.data.data);
    } else {
      console.log("error getting edu types");
    }
  };
  const getSpecialitiesOfColleges = async (collegeId?: number) => {
    const res = await axiosInst.get(`/api/Common/GetSpecialtyByEduId?facultyId=${collegeId}`, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res) {
      setSpecialities(res.data.data);
    } else {
      console.log("error getting edu types");
    }
  };
  const getSpecialitiesOfInstitutes = async (instituteId?: number) => {
    const res = await axiosInst.get(`/api/Common/GetSpecialtyByEduId?instituteId=${instituteId}`, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res) {
      setSpecialities(res.data.data);
    } else {
      console.log("error getting edu types");
    }
  };



  const getCountries = async () => {
    await axiosInst.get('/api/Common/GetAllCountries', {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setCountries(res.data.data)
    })
  }

  const getGoverns = async (counId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllGovernmentByCountryId?countryId=${counId}`);
      setGoverns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setGoverns([]);
    }
  };
  useEffect(() => {
    const getSelectedTab = localStorage.getItem("tabSelected")
    if (getSelectedTab === "") {
      selectTab(getSelectedTab!)
    }
    getCountries();
  }, []);

  const selectTab = (tab?: string) => {
    setSelectedTab(tab!)
    localStorage.setItem("tabSelected", tab!)
  }
  return (
    <div
      className={`overflow-y-auto hide-scrollbar h-screen w-full transition-all duration-500 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      {loadingUnivsOrInsts ? <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
        <BounceLoader color="#0084d1" /></div> : null}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className={`${isDark ? "bg-gray-800" : ""} col-span-2`}>
          <SideBar />
        </div>

        {/* Main content */}
        <div
          className={`lg:col-span-10 col-span-12 lg:p-10 p-5 mt-10 lg:mt-0 transition-all duration-500 ${isDark ? "bg-gray-900" : "bg-gray-50"
            }`}
        >
          <div className="flex justify-between">
            {/* Tabs */}
            <div
              className={`flex mb-10 items-center w-full text-sm font-medium text-center ${isDark ? "text-gray-300" : "text-gray-500"
                }`}
            >
              <div>
                <a
                  onClick={() => selectTab("education")}
                  className={`inline-block cursor-pointer lg:px-10 px-5 py-2 rounded-md ${selectedTab == "education"
                    ? isDark
                      ? "bg-gray-700 text-white shadow-md"
                      : "bg-white shadow-md text-sky-700"
                    : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-black hover:text-sky-700 hover:shadow-lg"
                    } transition-all duration-500`}
                >
                  {t("education")}
                </a>
              </div>

              <div>
                <a
                  onClick={() => selectTab("courses")}
                  className={`inline-block cursor-pointer lg:px-10 px-5 py-2 rounded-md ${selectedTab == "courses"
                    ? isDark
                      ? "bg-gray-700 text-white shadow-md"
                      : "bg-white shadow-md text-sky-700"
                    : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-black hover:text-sky-700 hover:shadow-lg"
                    } transition-all duration-500`}
                >
                  {t("courses")}
                </a>
              </div>
            </div>

            {/* Logout Button */}
            <div>
              <Button
                onClick={handleLogout}
                buttonContent={
                  <div
                    className={`flex gap-1 text-sm p-2 w-24 shadow-md transition-all transform hover:shadow-lg duration-500 rounded-md ${isDark
                      ? "text-sky-400 bg-gray-800 border border-gray-700"
                      : "text-[#0069a8] bg-white-300"
                      }`}
                  >
                    <LogOut size={18} />
                    <p>{t("signOut")}</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* Tabs content */}
          {selectedTab == "education" ? (
            <>
              <div className="mb-8">
                <p
                  className={`lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-sky-700"
                    }`}
                >
                  {t("Tell us about your education")}
                </p>
                <p
                  className={`text-sm mt-1 max-w-lg ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {t("Enter your education experience so far, even if you are a current student or did not graduate.")}
                </p>
                <p className="text-xs pt-8 text-red-500 font-semibold">
                  {t("* these fields are mandatory")}
                </p>
              </div>

              {/* Form */}
              <form
                className="grid grid-cols-12 gap-4 grid-flow-dense"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Select fields */}
                <div className="lg:col-span-6 col-span-12 px-2">
                  <Select
                    forSelect={t("Choose")}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-black"
                      }`}
                    label={t("Education Level")}
                    oneValue={
                      <>
                        {qualifs.map((deg: any, index: number) => (
                          <option key={index} value={deg.id}>
                            {lang === "en" ? deg.en_name : deg.ar_name}
                          </option>
                        ))}
                      </>
                    }
                    value={edu.edu_level?.toString()}
                    onChange={(e) => { handleEduChange("edu_level", e.target.value) }
                    }
                  />
                  <div>
                    <p className="text-sm text-red-500">{errors.edu_level}</p>
                  </div>
                </div>
                {edu.edu_level === "1" && (
                  <div className="lg:col-span-6 col-span-12 px-2">
                    <Select
                      forSelect={universities.length > 0 ? "" : t("Choose")}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-black"
                        }`}
                      label={t("University")}
                      value={edu.university?.id}
                      oneValue={
                        <>
                          {universities.map((univ: IUniversityAndInsts, index: number) => (
                            <option key={index} value={univ.id}>
                              {lang === "en" ? univ.en_name : univ.ar_name}
                            </option>
                          ))}
                        </>
                      }
                      onChange={(e) => handleChangeCollegeOrInst("university", Number(e.target.value))}
                    />
                    <div>
                      <p className="text-sm text-red-500">{errors.university}</p>
                    </div>
                  </div>
                )}


                {/* Study Type */}
                <div className="lg:col-span-6 col-span-12 px-2">
                  {edu.edu_level === "1" ? <Select
                    forSelect={
                      colleges.length > 0
                        ? ""
                        : t("Choose")
                    }
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-black"
                      }`}
                    label={t("Colleges")}
                    value={edu.college?.id}
                    oneValue={
                      <>
                        {colleges.map((deg: any, index: number) => (
                          <option key={index} value={deg.id}>
                            {lang === "en" ? deg.en_name : deg.ar_name}
                          </option>
                        ))}
                      </>
                    }
                    onChange={(e) => { handleChangeCollegeOrInst("college", Number(e.target.value)), getSpecialitiesOfColleges(Number(e.target.value)) }
                    }
                    errorMessage={errors.college}
                  /> :

                    <Select
                      forSelect={
                        Insts.length > 0
                          ? ""
                          : t("Choose")
                      }
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-black"
                        }`}
                      label={t("Institutes")}
                      value={edu.institute?.id}
                      oneValue={
                        <>
                          {Insts.map((deg: any, index: number) => (
                            <option key={index} value={deg.id}>
                              {lang === "en" ? deg.en_name : deg.ar_name}
                            </option>
                          ))}
                        </>
                      }
                      onChange={(e) => { handleChangeCollegeOrInst("institute", Number(e.target.value)), getSpecialitiesOfInstitutes(Number(e.target.value)) }
                      }
                      errorMessage={errors.institute}
                    />}
                  <div>
                  </div>
                </div>

                <div className="lg:col-span-6 col-span-12 px-2">
                  <Select
                    forSelect={
                      specialities.length > 0
                        ? ""
                        : t("Choose")
                    }
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-black"
                      }`}
                    label={t("Specialty")}
                    value={edu.specialty?.id}
                    oneValue={
                      <>
                        {specialities.map((spec: ISpecialty, index: number) => (
                          <option key={index} value={spec.id}>
                            {lang === "en" ? spec.en_name : spec.ar_name}
                          </option>
                        ))}
                      </>
                    }
                    onChange={(e) =>
                      handleChangeCollegeOrInst("specialty", Number(e.target.value))
                    }
                    errorMessage={errors.specialty}
                  />
               
                </div>

                {/* Location */}
                <div className="lg:col-span-6 col-span-12 px-2">
                  <Select
                    name="country"
                    label={t("Country")}
                    onChange={(e) =>
                      handleChangeCountry("country", Number(e.target.value))
                    }
                    errorMessage={errors.country}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-black"
                      }`}
                    value={edu.country?.id}
                    oneValue={
                      <>
                        {countries?.map((country: ICountry, index: number) => (
                          <option key={index} value={country.id}>
                            {lang === "en" ? country?.en_name
                              ?.charAt(0)
                              .toUpperCase() +
                              country.en_name?.slice(1)! : country.ar_name}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>
                <div className="lg:col-span-6 col-span-12 px-2">
                  <Select
                    label={t("City")}
                    onChange={(e) =>
                      handleChangeCountry("city", Number(e.target.value))
                    }
                    errorMessage={errors.city}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-black"
                      }`}
                    value={edu.city?.id}
                    oneValue={
                      <>
                        {governs?.map((city: IGovernment, index: number) => (
                          <option key={index} value={city.id}>
                            {lang === "en" ? city?.en_name
                              ?.charAt(0)
                              .toUpperCase() +
                              city.en_name?.slice(1)! : city.ar_name}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>

                {/* Graduation Year */}
                <div className="col-span-12 px-2">
                  <p>{t("Study Period")}</p>
                  <div className="grid grid-cols-12 gap-8">
                    {/* From */}
                    <div className="lg:col-span-6 col-span-12">
                      <Select
                        labelDivClassname="h-0"
                        forSelect={t("From")}
                        className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                          ? "bg-gray-800 border-gray-700 text-gray-100"
                          : "bg-white border-gray-300 text-black"
                          }`}
                        oneValue={
                          <>
                            {workYears.map((year, index) => (
                              <option key={index} value={year}>
                                {year}
                              </option>
                            ))}
                          </>
                        }
                        value={edu?.from_year}
                        onChange={(e) => handleEduChange("from_year", e.target.value)}
                      />
                      <div>
                        <p className="text-sm text-red-500">{errors.from_year}</p>
                      </div>
                    </div>

                    {/* To */}
                    <div className="lg:col-span-6 col-span-12">
                      <Select
                        labelDivClassname="h-0"
                        forSelect={t("To")}
                        className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                          ? "bg-gray-800 border-gray-700 text-gray-100"
                          : "bg-white border-gray-300 text-black"
                          }`}
                        oneValue={
                          <>
                            {workYears.map((year, index) => (
                              <option key={index} value={year}>
                                {year}
                              </option>
                            ))}
                          </>
                        }
                        value={edu?.to_year}
                        onChange={(e) => handleEduChange("to_year", e.target.value)}
                      />
                      <div>
                        <p className="text-sm text-red-500">{errors.to_year}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6 grid grid-cols-3 px-3">
                  <div className="col-span-12 mb-2">
                    <h1>{t("Study type")}</h1>
                  </div>
                  <RadioButton
                    name="eduType"
                    value="true"
                    label={t("Remotely")}
                    checked={edu.edu_type === true}
                    onChange={(e) => setEdu((prev) => ({
                      ...prev,
                      edu_type: e.target.value === "true",
                    }))} />

                  <RadioButton
                    name="eduType"
                    value="false"
                    label={t("Onsite")}
                    checked={edu.edu_type === false}
                    onChange={(e) => setEdu((prev) => ({
                      ...prev,
                      edu_type: e.target.value === "true",
                    }))} />
                </div>
                {/* Add / Update */}
                <div className="col-span-12 flex justify-end mb-10">
                  <Button
                    onClick={addEducation}
                    title={
                      eduId == 0 ? t("Add") : t("Update")
                    }
                    className={`rounded-full py-2 px-6 transition-all duration-300 ${isDark
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                      }`}
                  />
                </div>
              </form>

              {/* Education list */}
              <div className="mb-20">
                {resumeData?.education
                  ?.filter(
                    (edu) =>
                      !sampleResume.resume?.education?.some(
                        (sample) =>
                          JSON.stringify({ ...sample, id: undefined }) ===
                          JSON.stringify({ ...edu, id: undefined })
                      )
                  )
                  .map((edu: IEducation, index: number) => (
                    <div
                      key={edu.id || index}
                      className={`w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 border overflow-hidden group ${isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-100"
                        }`}
                    >
                      <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>

                      <div className="flex flex-col lg:flex-row justify-between p-4 sm:p-6 items-start gap-6">
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-start sm:items-center gap-3 flex-wrap">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`text-sm font-semibold group-hover:text-emerald-600 transition-colors break-words ${isDark ? "text-gray-100" : "text-gray-900"
                                }`}
                            >
                              <span
                                className={`text-sm font-normal mx-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Education Type")}:
                              </span>
                              {qualifs.find((qual: IQualifsType) => qual.id == Number(edu.edu_level))?.[lang === 'en' ? 'en_name' : 'ar_name']}
                            </p>
                          </div>

                          <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`text-lg font-medium break-words ${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Field of study")}:
                              </span>
                              <span className="inline-flex items-center px-3 mx-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {edu.edu_level === "1" ? lang === 'en' ? edu.college.en_name : edu.college.ar_name : edu.edu_level === "2" ? edu.institute?.en_name! : edu.college?.en_name!}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`text-lg font-medium break-words ${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Specialty")}:
                              </span>
                              <span className="inline-flex items-center px-3 mx-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {lang === 'en' ? edu.specialty.en_name : edu.specialty.ar_name}
                              </span>
                            </p>
                          </div>
                          {Object.keys(edu.university).length > 0 && <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`text-lg font-medium break-words ${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("University")}:
                              </span>
                              <span className="inline-flex items-center px-3 mx-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {lang === 'en' ? edu.university.en_name : edu.university.ar_name}
                              </span>
                            </p>
                          </div>}

                          <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`break-words ${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Location")}:
                              </span>
                              <span className="inline-flex items-center px-2.5 mx-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                📍{lang === 'en' ? edu.city.en_name : edu.city.ar_name}, {lang === 'en' ? edu.country.en_name : edu.country.ar_name}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Study Period")}:
                              </span>
                              <span className="inline-flex items-center px-3 mx-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                🎓 {edu.from_year} - {edu.to_year}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 sm:mt-0"></div>
                            <p
                              className={`${isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              <span
                                className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                              >
                                {t("Study type")}:
                              </span>
                              <span className="inline-flex items-center px-3 mx-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {edu.edu_type ? t("Remotely") : t("Onsite")}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="flex gap-3 self-end sm:self-start w-full sm:w-auto justify-end sm:justify-start">
                          <Button
                            btnContentClassname="hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
                            buttonContent={
                              <div className="p-3 items-center border border-red-200 hover:border-red-300 rounded-md w-full sm:w-auto text-center">
                                <Trash2
                                  color="red"
                                  size={18}
                                  onClick={() => deleteEdu(edu.id!)}
                                  className="group-hover/btn:scale-110 transition-transform mx-auto"
                                />
                              </div>
                            }
                          />
                          <Button
                            btnContentClassname="hover:bg-green-50 rounded-lg transition-all duration-200 group/btn"
                            buttonContent={
                              <div className="p-3 items-center border border-green-200 hover:border-green-300 rounded-md w-full sm:w-auto text-center">
                                <Pen
                                  onClick={() => getEduById(edu.id!)}
                                  color="green"
                                  size={18}
                                  className="group-hover/btn:scale-110 transition-transform mx-auto"
                                />
                              </div>
                            }
                          />
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <Courses lang={lang} />
          )}

        </div>
        {showPreview ? <div
          onClick={() => setShowPreview(!showPreview)}
          className="fixed inset-0 bg-gray-900/75 z-50 flex justify-center animate__animated animate__fadeIn"
        >

          <div className="lg:scale-100 scale-60 bg-white w-180 mt-4 animate__animated animate__fadeInUp max-h-180 rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-5">
              <X className="hover:text-red-500 text-sky-700" onClick={() => setShowPreview(!showPreview)} />
            </div>
            <div className="py-5 max-h-150 overflow-y-auto hide-scrollbar rounded">
              <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} color={resumeColor} />
            </div>

          </div>
        </div> : null}

        <div
          className={`col-span-12 fixed bottom-0 right-0 p-2 w-full border shadow-md transition-colors duration-300 ${isDark
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

export default Education
