import { useNavigate } from "react-router-dom"
import Button from "../../../Containers/Button"
import Input from "../../../Containers/Input"
import Select from "../../../Containers/Select"
import SideBar from "../../../Containers/SideBar"
import CheckboxAdvanced from "../../../Containers/AnimateChekbox"
import Templates, { sampleResume } from "../ChooseTemplate/Templates"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Eye, LogOut, Pen, Trash2, X } from "lucide-react"
import { toast } from "react-toastify"
import { ICountry, ICVData, IDepartment, IExperience, IGovernment, IJobTiltes, IResume, IVillage } from "../../../Interfaces/interface"
import { axiosInst } from "../../../axios/axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../Redux/store"
import { clearFoundUser } from "../../../Redux/Slices/userSlice"
import { t } from "i18next"
import RadioButton from "../../../Containers/Radiobutton"
import Volunteers from "../Volunteers/Volunteers"
import { BounceLoader } from "react-spinners"
import { removeCookie } from "../../../Utils/cookies"

const History = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.token.token)
  const [tempId, setTempId] = useState(0);
  const [showPreview, setShowPreview] = useState(false)
  const resumeColor = useSelector((state: RootState) => state.resumeColor.resumeColor)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const [expId, setExpId] = useState(0);
  const [villages, setVillages] = useState<IVillage[]>([])
  const [jobTitles, setJobTitles] = useState<IJobTiltes[]>([])
  const [showJobTitles, setShowJobTitles] = useState(false)

  const [workPos, setWorkPos] = useState<ICountry>({
    id: 0,
    en_name: "",
    ar_name: "",
  }); const [workTo, setWorkTo] = useState("");
  const [selectedTab, setSelectedTab] = useState("exprience");
  const [countries, setCountries] = useState<ICountry[]>([])
  const [governs, setGoverns] = useState<IGovernment[]>([])
  const [provinces, setProvinces] = useState<IDepartment[]>([])
  const [loadingJobTitle, setLoadingJobTitle] = useState(false)
  const workMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
  const [errors, setErrors] = useState<Partial<Record<keyof IExperience, string>>>({});
  const dispatch: AppDispatch = useDispatch()
  const isDark = useSelector((state: RootState) => state.isDark.isDark)

  const [expr, setExpr] = useState<IExperience>(() => ({
    role: {},
    company: '',
    from_year: '',
    to_year: workTo,
    from_month: '',
    to_month: '',
    address_info: '',
    remote: false,
    employmentType: true,
    present: false,
    details: '',
    country: workPos,
    city: {},
    province: {},
    village: {},
  }));
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    work_History: []
  }));
  const handleExprChange = (field: keyof IExperience, value: any) => {
    setExpr((prev) => ({
      ...prev,
      [field]: value,
    }));

  };
  const handleCheckRemote = (name: keyof IExperience, checked: boolean) => {
    setExpr(prev => ({
      ...prev,
      [name]: checked,
      ...(name === "remote" && {
        country: { id: -1, en_name: "Remotely", ar_name: "Remotely" }, // dummy ICountry
        city: { id: -1, en_name: "", ar_name: "" }, // dummy IGovernment
      }),
      ...(name === "present" && {
        to_year: checked ? "Present" : "",
        to_month: checked ? "Present" : "",
      }),
    }));

    if (name === "remote") setWorkPos({ id: -1, en_name: "Remotely", ar_name: "Remotely" });
    if (name === "present") setWorkTo(checked ? "Present" : "");
  };

const handleChangeCity = async (field: keyof IExperience, value: number) => {
  const findCity = governs.find((city) => city.id === value);

  await getProvinces(value);

  const updatedExpr = {
    ...expr,
    [field]: findCity,
  };

  setExpr(updatedExpr);

  const updatedResume = {
    ...resumeData,
    work_History: resumeData.work_History?.map(exp =>
      exp.id === expId ? updatedExpr : exp
    ),
  };

  setResumeData(updatedResume);
  localStorage.setItem("resumeData", JSON.stringify(updatedResume));
};
const handleChangeProvince = async (field: keyof IExperience, value: number) => {
  const findProv = provinces.find((prov) => prov.id === value);

  await getVillages(findProv?.id!);

  const updatedExpr = {
    ...expr,
    [field]: findProv,
  };

  setExpr(updatedExpr);

  const updatedResume = {
    ...resumeData,
    work_History: resumeData.work_History?.map(exp =>
      exp.id === expId ? updatedExpr : exp
    ),
  };

  setResumeData(updatedResume);
  localStorage.setItem("resumeData", JSON.stringify(updatedResume));
};

const handleChangeVillage = (field: keyof IExperience, value: number) => {
  const findVillage = villages.find((vil) => vil.id === value);

  const updatedExpr = {
    ...expr,
    [field]: findVillage,
  };

  setExpr(updatedExpr);

  const updatedResume = {
    ...resumeData,
    work_History: resumeData.work_History?.map(exp =>
      exp.id === expId ? updatedExpr : exp
    ),
  };

  setResumeData(updatedResume);
  localStorage.setItem("resumeData", JSON.stringify(updatedResume));
};

  useEffect(() => {
    getCountries();
  }, []);
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
      courses: JSON.stringify(resumeData.courses || []),
      education: JSON.stringify(resumeData.education || []),
      languages: JSON.stringify(resumeData.languages || []),

    };
  };
  const handleNext = async () => {
    if (resumeData.work_History?.length === 0) {
      toast.warn("Please add at least one experience!")
    } else {
      const res = await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        navigate('/build-resume/add-educ')
      }
    }
  };

  const addExperience = () => {
    try {
      const newErrors: Partial<Record<keyof IExperience, string>> = {};

      const currentExp = resumeData.work_History || [];
      const isDefaultOnly = currentExp.length === 2 &&
        currentExp.every((exp) =>
          sampleResume.resume?.work_History?.some((sample) =>
            JSON.stringify({ ...sample, id: undefined }) ===
            JSON.stringify({ ...exp, id: undefined })
          )
        );

      let cleanedExperience = isDefaultOnly ? [] : currentExp;

      let updatedExperience;

      if (expId > 0) {
        updatedExperience = cleanedExperience.map((exp) =>
          exp.id === expId ? { ...expr, id: expId } : exp
        );

      } else {
        const maxId = cleanedExperience.reduce((max, exp) => {
          return exp.id && exp.id > max ? exp.id : max;
        }, 0);
        const newExp = { ...expr, id: maxId + 1, workTo: workTo };
        updatedExperience = [...cleanedExperience, newExp];
      }
      (Object.keys(expr!) as (keyof IExperience)[]).forEach((key) => {
        const value = expr![key]
        const isEmpty = value === null || value === undefined || String(value).trim() === "";
        const skipValidation =
          (key === "city" || key === "country" || key === "address_info") && expr.remote;
        if (isEmpty && !skipValidation) {
          newErrors[key] = t(`Required`);
        }
      });
      if (
        expr.from_year &&
        expr.to_year &&
        Number(expr.from_year) > Number(expr.to_year)
      ) {
        newErrors.from_year = "Start date cannot be after end date";
      }
      if (expr.from_year === expr.to_year) {
        if (
          expr.from_month &&
          expr.to_month &&
          Number(expr.from_month) > Number(expr.to_month)
        ) {
          newErrors.from_year = "Start month cannot be after end month";
        }
      }
      if (expr.from_year === expr.to_year && expr.from_month === expr.to_month) {
        newErrors.from_year = t("Start month cannot equals end month");

      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        const updatedResume: IResume = {
          ...resumeData,
          work_History: updatedExperience,
        };
        setResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));
        setExpr({
          role: {},
          company: '',
          from_year: '',
          to_year: '',
          from_month: '',
          to_month: '',
          address_info: '',
          remote: false,
          employmentType: true,
          present: false,
          details: '',
          country: {},
          city: {},
          province: {},
          village: {},
        });
        setCountries([])
        setProvinces([])
        setGoverns([])
        setVillages([])
        setExpId(0); // Reset editing mode
        getCountries()
      }
    } catch (error) {
      console.error("Error in addExperience:", error);
    }
  };

  const getExpById = async (expId: number) => {
    setExpId(expId)
    getCountries()
    const findExp: IExperience = resumeData.work_History?.find((exp: IExperience) => exp.id == expId)!
    await getGoverns(findExp.country.id!)
    await getProvinces(findExp.city.id!)
    await getVillages(findExp.province.id!)
    if (findExp) {
      setExpr({
        role: findExp.role,
        company: findExp.company,
        from_year: findExp.from_year,
        to_year: findExp.to_year,
        from_month: findExp.from_month,
        to_month: findExp.to_month,
        address_info: findExp.address_info,
        remote: findExp.remote,
        employmentType: findExp.employmentType,
        present: findExp.present,
        details: findExp.details,
        country: findExp.country,
        city: findExp.city,
        province: findExp.province,
        village: findExp.village,
      })
    }
  }
  const deleteExp = (expId: number) => {
    const updatedExperience = resumeData.work_History?.filter(
      (exp) => exp.id !== expId
    );

    const updatedResume: IResume = {
      ...resumeData,
      work_History: updatedExperience,
    };
    setExpId(0)
    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };


  useEffect(() => {

    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = JSON.parse(localStorage.getItem('resumeData')!)
    if (myTempId)
      setTempId(myTempId)
    setResumeData(storedResume)
  }, []);

  const getGoverns = async (counId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllGovernmentByCountryId?countryId=${counId}`);
      setGoverns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setGoverns([]);
    }
  };

  const getCountries = async () => {
    await axiosInst.get('/api/Common/GetAllCountries').then((res) => {
      setCountries(res.data.data)
    })
  }
  const getProvinces = async (cityId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllMarkazByCityId?cityId=${cityId}`);
      setProvinces(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setProvinces([]);
    }
  };

  const getVillages = async (provId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllVillageByProvinceId?provinceId=${provId}`);
      setVillages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setVillages([]);
    }
  };
  const handleChangeCountry = async (field: keyof IExperience, value: number) => {
    let selectedField;

    if (field === 'country') {
      selectedField = countries.find((country: ICountry) => country.id === value);
    } else if (field === 'city') {
      selectedField = governs.find((gov: ICountry) => gov.id === value);
    }

    // تحديث الـ state
    const updatedEdu = {
      ...expr,
      [field]: selectedField || '', // fallback لو مش موجود
    };
    setExpr(updatedEdu);

    // جلب المحافظات بس لو غيرنا الدولة
    if (field === 'country') {
      await getGoverns(value || 0);
    }
  };


  const handleLogout = () => {
    removeCookie('token')
    dispatch(clearFoundUser());
    navigate('/login')
  }



  const handleJobTitle = async (value: any) => {
    if (!value) return;
    setLoadingJobTitle(true)
    try {
      const res = await axiosInst.get(`/api/Common/GetDescriptionByJobTitleId?id=${value.id}`);
      const details = res.status === 200 ? res.data.data?.en_name || "" : "";

      const updatedResume: IExperience = {
        ...expr,
          role: value,
        details,   // حدث details و role مرة واحدة
      };

      setExpr(updatedResume);
      setShowJobTitles(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingJobTitle(false)
    }
  };


  const getJobTitles = async (search: string) => {
    setLoadingJobTitle(true)
    try {
      const res = await axiosInst.post(`/api/Common/SearchJobTitles`, { name: search });
      if (res.data.data.length > 0) {
        setJobTitles(res.data.data)
        setShowJobTitles(true)
      } else {
        setShowJobTitles(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingJobTitle(false)
    }

  }
const handleTitleChange = (field: keyof IExperience, value: any) => {
  if (field === "role") {
    getJobTitles(value);
    setShowJobTitles(true);

    const updatedResume = {
      ...expr,
      role: {
        ...expr.role,
        en_name: value   // ← ضيف القيمة جوه الأوبجكت بدل ما تستبدله
      }
    };

    setExpr(updatedResume);
    return;
  }

  const updatedResume = {
    ...expr,
    [field]: value,
  };

  setExpr(updatedResume);
};




  return (
    <div className={`min-h-screen relative w-full transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <SideBar />
        </div>
        <div className="lg:col-span-10 col-span-12 p-10">
          {loadingJobTitle ? <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
            <BounceLoader color="#0084d1" /></div> : null}
          <div className="flex justify-between">
            {/* Tabs */}
            <div
              className={`flex mb-10 gap-5 items-center w-full text-sm font-medium text-center ${isDark ? "text-gray-300" : "text-gray-500"
                }`}
            >
              <div>
                <a
                  onClick={() => setSelectedTab("exprience")}
                  className={`inline-block cursor-pointer lg:px-10 px-5 py-2 rounded-md ${selectedTab == "exprience"
                    ? isDark
                      ? "bg-gray-700 text-white shadow-md"
                      : "bg-white shadow-md text-sky-700"
                    : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-black hover:text-sky-700 hover:shadow-lg"
                    } transition-all duration-500`}
                >
                  {t("Experience")}
                </a>
              </div>

              <div>
                <a
                  onClick={() => setSelectedTab("volunteers")}
                  className={`inline-block cursor-pointer lg:px-10 px-5 py-2 rounded-md ${selectedTab == "volunteers"
                    ? isDark
                      ? "bg-gray-700 text-white shadow-md"
                      : "bg-white shadow-md text-sky-700"
                    : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-black hover:text-sky-700 hover:shadow-lg"
                    } transition-all duration-500`}
                >
                  {t("volunteers")}
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
          {selectedTab === "exprience" ? <><div className="mb-2">
            <h1 className={`lg:text-4xl font-bold mb-1 lg:w-full w-45 ${isDark ? "text-white" : "text-sky-700"}`}>
              {t("Tell us about your most recent job")}</h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600 text-sky-700"} lg:text-sm text-xs lg:w-full w-45`}>
              {t("We’ll start there and work backward.")}</p>
            <p className="text-xs text-red-500 pt-6">{t("* these fields are mandatory")}</p>
          </div>

            <form className="grid grid-cols-12 gap-4">
              <div className="lg:col-span-6 col-span-12 relative">
                <Input
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                   ${isDark
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-gray-300 bg-white text-black"
                    }`}
                  onChange={(e) => handleTitleChange("role", e.target.value)}
                  errorMessage={errors.role}
                  value={expr.role.en_name}
                  label={t("Job title")}
                  name="role"
                />
                {showJobTitles ? (
                  <div
                    className={`absolute top-full left-0 z-10 w-full rounded-md mt-1 max-h-60 overflow-y-auto shadow-md ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                      }`}
                  >
                    {jobTitles?.map((job: IJobTiltes, index: number) => {
                      return (
                        <div key={index}>
                          <p
                            className={`p-2 cursor-pointer text-base ${isDark ? "hover:bg-gray-700" : "hover:bg-sky-200"
                              }`}
                            onClick={() => handleJobTitle(job!)}
                          >

                            {lang === "en" ? job?.en_name?.charAt(0).toUpperCase() +
                              job.en_name?.slice(1)! : job.ar_name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="lg:col-span-6 col-span-12">
                <Input
                  label={t("Company")}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
                  value={expr.company}
                  onChange={(e) => handleExprChange('company', e.target.value)}
                  errorMessage={errors.company} />
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  className={`w-full border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
                  forSelect={t("Month")}
                  label={t("Start Date")}
                  oneValue={<>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>}
                  value={expr.from_month}
                  onChange={(e) => handleExprChange('from_month', e.target.value)} />
                <div><p className="text-sm text-red-500">{errors.from_year}</p></div>
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  className={`w-full border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
                  forSelect={t("Year")}
                  oneValue={<>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>}
                  value={expr.from_year}
                  onChange={(e) => handleExprChange('from_year', e.target.value)} />
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  forSelect={t("Month")}
                  disabled={expr.present}
                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.present
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                    `}

                  oneValue={<>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>}
                  value={expr.to_month}
                  onChange={(e) => handleExprChange('to_month', e.target.value)}
                  label={t("End Date")} />
                <div><p className="text-sm text-red-500">{errors.to_year}</p></div>
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  forSelect={t("Year")}
                  disabled={expr.present}
                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.present
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `}
                  oneValue={<>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>}
                  value={expr.to_year}
                  onChange={(e) => handleExprChange('to_year', e.target.value)} />
              </div>

              <div className="col-span-12 flex justify-start">
                <CheckboxAdvanced
                  label={t("I currently work here")}
                  name="present"
                  size="sm"
                  labelClassName={`pl-1 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  checked={expr.present}
                  onChange={(checked: boolean) => handleCheckRemote("present", checked)} />
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  label={t("Country")}
                  name="country"
                  disabled={expr.remote}
                  onChange={(e) => handleChangeCountry("country", Number(e.target.value))}
                  errorMessage={errors.country}
                  value={expr.country?.id}
                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.remote
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `} oneValue={<>
                    {countries?.map((country: ICountry, index: number) => {
                      return <option key={index} value={country.id}>
                        {lang === "en" ? country?.en_name?.charAt(0).toUpperCase() + country.en_name?.slice(1)! : country.ar_name}
                      </option>
                    })}
                  </>} />
              </div>

              <div className="lg:col-span-3 col-span-6">
                <Select
                  disabled={expr.remote}
                  label={t("City")}
                  onChange={(e) => handleChangeCity("city", Number(e.target.value))}
                  errorMessage={errors.city}
                  value={expr.city?.id}

                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.remote
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `} oneValue={<>
                    {governs?.map((city: IGovernment, index: number) => {
                      return <option key={index} value={city.id}>
                        {lang === "en" ? city?.en_name?.charAt(0).toUpperCase() + city.en_name?.slice(1)! : city.ar_name}
                      </option>
                    })}
                  </>} />
              </div>
              <div className="lg:col-span-3 col-span-12">
                <Select
                  disabled={expr.remote}

                  label={t("Province")}
                  onChange={(e) => handleChangeProvince("province", Number(e.target.value))}
                  errorMessage={errors.province}
                  oneValue={
                    <>
                      {provinces?.map((prov: IDepartment, index: number) => {
                        return (
                          <option key={index} value={prov.id}>
                            {lang === "en" ? prov?.en_name?.charAt(0).toUpperCase() +
                              prov.en_name?.slice(1)! : prov.ar_name}
                          </option>
                        );
                      })}
                    </>
                  }
                  value={expr.province?.id}

                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.remote
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `}
                />
              </div>
              <div className="lg:col-span-3 col-span-12">
                <Select
                  disabled={expr.remote}
                  label={t("Village")}
                  onChange={(e) => handleChangeVillage("village", Number(e.target.value))}
                  errorMessage={errors.village}
                  oneValue={
                    <>
                      {villages?.map((village: IVillage, index: number) => {
                        return (
                          <option key={index} value={village.id}>
                            {lang === "en" ? village?.en_name?.charAt(0).toUpperCase() +
                              village.en_name?.slice(1)! : village.ar_name}
                          </option>
                        );
                      })}
                    </>
                  }
                  value={expr.village?.id}
                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.remote
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `}
                />
              </div>
              <div className="lg:col-span-3 col-span-12">
                <Input
                  disabled={expr.remote}
                  className={`
                  w-full border rounded px-3 py-2.5 
                  focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}
                  ${expr.remote
                      ? (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500 cursor-not-allowed")
                      : (isDark ? "bg-gray-800 text-white" : "bg-white text-black")
                    }
                  `}
                  label={t("Additional address info")}
                  onChange={(e) => handleExprChange("address_info", e.target.value)}
                  errorMessage={errors.address_info}
                  value={expr.address_info}
                />
              </div>
              <div className="col-span-12 items-center">
                <CheckboxAdvanced
                  label={t("Remote")}
                  name="remote"
                  size="sm"
                  labelClassName={`px-1 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  checked={expr.remote}
                  onChange={(checked: boolean) => handleCheckRemote("remote", checked)} />
                <p className={`${isDark ? "text-gray-300" : "text-black"}`}>{errors.remote}</p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-3">
                <div className="col-span-12 py-5">
                  <h1>{t("Employment type")}</h1>
                </div>
                <RadioButton
                  name="employmentType"
                  value="true"
                  label={t("Full time")}
                  checked={expr.employmentType === true}
                  onChange={(e) => setExpr((prev) => ({
                    ...prev,
                    employmentType: e.target.value === "true",
                  }))} />

                <RadioButton
                  name="employmentType"
                  value="false"
                  label={t("Part time")}
                  checked={expr.employmentType === false}
                  onChange={(e) => setExpr((prev) => ({
                    ...prev,
                    employmentType: e.target.value === "true",
                  }))} />
              </div>
              <div className="col-span-12">
                <label htmlFor="desc" className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{t("Description")}</label>
                <textarea
                  id="desc"
                  rows={4}
                  value={expr.details || ""}
                  onChange={(e) => handleExprChange('details', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`} />
              </div>

              <div className="col-span-12 flex justify-end mb-10">
                <Button
                  onClick={addExperience}
                  title={expId == 0 ? t("Add") : t("Update")}
                  className={`rounded-full py-2 px-6 transition-all duration-300 ${isDark ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`} />
              </div>
            </form>
            {Array.isArray(resumeData?.work_History) &&
              resumeData?.work_History
                .filter((exp: IExperience) =>
                  !sampleResume.resume?.work_History?.some(
                    (sample) =>
                      JSON.stringify({ ...sample, id: undefined }) ===
                      JSON.stringify({ ...exp, id: undefined })
                  )
                )
                .map((exp: IExperience, index: number) => (
                  <div
                    key={index}
                    className={`w-full rounded-xl shadow-lg hover:shadow-xl mt-5 transition-all duration-300 mb-8 overflow-hidden group ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="flex flex-col lg:flex-row justify-between p-6 items-start gap-6">
                      <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-start sm:items-center gap-3 flex-wrap">
                          <div className="w-2 h-2 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#60a5fa" : "#3b82f6" }}></div>
                          <p className={`text-xl font-semibold group-hover:text-blue-600 transition-colors break-words ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                            <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Role")}:</span>
                            {lang === 'en' ? exp.role.en_name : exp.role.ar_name}
                          </p>
                        </div>

                        <div className="flex items-start sm:items-center gap-3 mx-0 sm:ml-5 flex-wrap">
                          <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                          <p className={`text-lg font-medium break-words ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                            <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Company")}:</span>
                            {exp.company}
                          </p>
                        </div>

                        <div className="flex items-start sm:items-center gap-3 ml-0 sm:ml-5 flex-wrap">
                          <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" 
                          style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                          <p className={`text-lg font-medium break-words ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                            <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Location")}:</span>
                            {exp.remote ? t("Remote") : `${lang === 'en' ? exp.country?.en_name : exp.country?.ar_name }, 
                            ${lang === 'en' ? exp.city?.en_name : exp.city.ar_name}, 
                            ${lang === 'en' ? exp.province?.en_name : exp.province.ar_name},
                            ${exp.village && "," + lang === 'en' ?  exp.village?.en_name : exp.village?.ar_name} 
                            ${exp.address_info && "," + exp.address_info}`}
                          </p>
                        </div>
                        <div className="flex items-start sm:items-center gap-3 mx-0 sm:ml-5 flex-wrap">
                          <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                          <p className={`text-lg font-medium break-words ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                            <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Employment type")}:</span>
                            {exp.employmentType ? t("Full time") : t("Part time")}
                          </p>
                        </div>
                        <div className="flex items-start sm:items-center gap-3 ml-0 sm:ml-5 flex-wrap">
                          <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                          <div className="flex flex-wrap items-start sm:items-center gap-4">
                            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              <span className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("From")}:</span>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {exp.from_month}, {exp.from_year}
                              </span>
                            </p>
                            <span className="text-gray-400 hidden sm:inline">{lang === "en" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</span>

                            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              <span className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("To")}:</span>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {exp.to_year === "Present" || exp.to_month === "Present" ? t("present") : `${exp.to_month}, ${exp.to_year}`}
                              </span>
                            </p>
                          </div>
                        </div>

                        {exp.details && <div className="ml-0 sm:ml-5 mt-4">
                          <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Description")}:</p>
                          <p className={`leading-relaxed p-4 rounded-lg border-l-4 text-sm break-words ${isDark ? "bg-gray-900 border-blue-400 text-gray-200" : "bg-gray-50 border-blue-200 text-gray-700"}`}>
                            {exp.details}
                          </p>
                        </div>}
                      </div>

                      <span className="flex gap-3 self-end sm:self-start flex-shrink-0">
                        <Button
                          btnContentClassname="hover:bg-red-50 rounded-lg transition-all duration-200"
                          onClick={() => deleteExp(exp.id!)}
                          buttonContent={
                            <div className={`text-center w-full items-center border p-3 group/btn rounded-md 
                          ${isDark ? "border-red-700 bg-red-700 text-white" : "border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50"}`}>
                              <Trash2

                                size={18}
                                onClick={() => deleteExp(exp.id!)}
                                className="group-hover/btn:scale-110 transition-transform text-center"
                              />
                            </div>
                          }
                        />
                        <Button
                          btnContentClassname="hover:bg-green-50 rounded-lg transition-all duration-200 group/btn"
                          onClick={() => getExpById(exp.id!)}
                          buttonContent={
                            <div className={`items-center border p-3 group/btn rounded-md ${isDark ? "border-green-700 bg-green-700 text-white" :
                              "border-green-200 text-green-500 hover:border-green-300 hover:bg-green-50"}`}>
                              <Pen
                                onClick={() => getExpById(exp.id!)}
                                size={18}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </div>
                          }
                        />
                      </span>
                    </div>
                  </div>
                ))}


          </> : <Volunteers />}



        </div>

        {showPreview ? (
          <div
            onClick={() => setShowPreview(!showPreview)}
            className="fixed inset-0 bg-gray-900/75 z-50 flex justify-center animate__animated animate__fadeIn"
          >

            <div className={`lg:scale-100 scale-60 w-180 mt-4 animate__animated animate__fadeInUp max-h-180 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end p-5">
                <X className={`${isDark ? "text-sky-400" : "text-sky-700"} hover:text-red-500`} onClick={() => setShowPreview(!showPreview)} />
              </div>
              <div className="py-5 max-h-150 overflow-y-auto hide-scrollbar rounded">
                <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} color={resumeColor} />
              </div>
            </div>
          </div>
        ) : null}

        <div className={`col-span-12 fixed bottom-0 right-0 p-2 w-full shadow-md transition-colors duration-300 ${isDark ? "bg-gray-800 border-t border-gray-700 text-white" : "bg-white border border-gray-200 text-black"}`}>
          <div className="flex justify-center lg:justify-end">
            <div className="flex lg:gap-5 gap-10 text-lg font-bold">
              <Button
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"}`}
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
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"}`}
                buttonContent={<div className="flex items-center w-32 justify-center gap-1"><Eye /> <p className="text-sm">{t("Preview")}</p></div>}
              />
              <Button
                onClick={handleNext}
                btnTitle="Go Next"
                buttonContent={<div className="text-sm flex items-center justify-center w-20">
                <p className="text-sm">{t("Next")}</p>
                {lang === "en" ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </div>}
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"}`}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default History;