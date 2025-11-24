import { ArrowLeft, ArrowRight, Pen, Trash2 } from "lucide-react"
import Button from "../../../Containers/Button"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "../../../Redux/store"
import Input from "../../../Containers/Input"
import Select from "../../../Containers/Select"

import { useEffect, useState } from "react"

import { sampleResume } from "../ChooseTemplate/Templates"
import { ICountry, ICVData, IGovernment, IResume, IVolunteer } from "../../../Interfaces/interface"
import { axiosInst } from "../../../axios/axios"
import { toast } from "react-toastify"


const Volunteers = () => {
  const { t } = useTranslation()
  const isDark = useSelector((state: RootState) => state.isDark.isDark)
  const token = useSelector((state: RootState) => state.token.token)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const [countries, setCountries] = useState<ICountry[]>([])
  const [governs, setGoverns] = useState<IGovernment[]>([])
  const [tempId, setTempId] = useState(0)
  const [volId, setVolId] = useState(0)
  const workMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
  const [errors, setErrors] = useState<Partial<Record<keyof IVolunteer, string>>>({});

  const [resumeData, setResumeData] = useState<IResume>(() => ({
    volunteers: [],
  }));
  const [vol, setVol] = useState<IVolunteer>({
    role: '',
    company: '',
    from_year: '',
    to_year: '',
    from_month: '',
    to_month: '',
    country: {},
    city: {},
    details: '',
  })
  const handleChangeCountry = async (field: keyof IVolunteer, value: number) => {
    let findObj;
    if (field === "country") {
      findObj = countries.find((c: ICountry) => c.id === value)
      await getGoverns(findObj?.id!)
    } else {
      findObj = governs.find((c: ICountry) => c.id === value)
    }
    setVol({
      ...vol,
      [field]: findObj
    })

  };
  const mapResumeToICVData = (): ICVData => {
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
  const handleVolChange = (field: keyof IVolunteer, value: any) => {
    setVol((prev) => ({
      ...prev,
      [field]: value,
    }));

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
    getCountries()
  }, [])

  const addVol = async () => {
    try {
      const newErrors: Partial<Record<keyof IVolunteer, string>> = {};

      const currentExp = resumeData.volunteers || [];
      const isDefaultOnly = currentExp.length === 2 &&
        currentExp.every((vol) =>
          sampleResume.resume?.volunteers?.some((sample: any) =>
            JSON.stringify({ ...sample, id: undefined }) ===
            JSON.stringify({ ...vol, id: undefined })
          )
        );

      let cleanedExperience = isDefaultOnly ? [] : currentExp;

      let updatedExperience;

      if (volId > 0) {
        updatedExperience = cleanedExperience.map((vol) =>
          vol.id === volId ? { ...vol, id: volId } : vol
        );

      } else {
        const maxId = cleanedExperience.reduce((max, vol) => {
          return vol.id && vol.id > max ? vol.id : max;
        }, 0);
        const newExp = { ...vol, id: maxId + 1, workTo: vol.to_year };
        updatedExperience = [...cleanedExperience, newExp];
      }
      (Object.keys(vol!) as (keyof IVolunteer)[]).forEach((key) => {
        const excludedKeys: (keyof IVolunteer)[] = ["details"];
        if (excludedKeys.includes(key)) return;
        const value = vol![key]
        const isEmpty = value === null || value === undefined || String(value).trim() === "";
        if (isEmpty) {
          newErrors[key] = t(`Required`);
        }
      });
      if (
        vol.from_year &&
        vol.to_year &&
        Number(vol.from_year) > Number(vol.to_year)
      ) {
        newErrors.from_year = t("Start date cannot be after end date");
      }
      if (vol.from_year === vol.to_year) {
        if (
          vol.from_month &&
          vol.to_month &&
          Number(vol.from_month) > Number(vol.to_month)
        ) {
          newErrors.from_year = t("Start month cannot be after end month");
        }
      }
      if (vol.from_year === vol.to_year && vol.from_month === vol.to_month) {
        newErrors.from_year = t("Start month cannot equals end month");

      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        if (resumeData.volunteers?.length === 0) {
          toast.warn("Please add at least one experience!")
        } else {
          const res = await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
            headers: {
              'Content-Type': `application/json`,
              'Authorization': `Bearer ${token}`
            }
          })
          if (res.status === 200) {
            toast.success("Volunteer added successfully")
          }
        }
        const updatedResume: IResume = {
          ...resumeData,
          volunteers: updatedExperience,
        };
        setResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));
        setVol({
          role: '',
          company: '',
          from_year: '',
          to_year: '',
          from_month: '',
          to_month: '',
          details: '',
          country: {},
          city: {}
        });
        setCountries([])
        setGoverns([])
        setVolId(0); // Reset editing mode
      }
    } catch (error) {
      console.error("Error in addExperience:", error);
    }
  };

  const getExpById = (volId: number) => {
    setVolId(volId)

    const findExp: IVolunteer = resumeData.volunteers?.find((exp: IVolunteer) => exp.id == volId)!
    if (findExp) {
      setVol({
        role: findExp.role,
        company: findExp.company,
        from_year: findExp.from_year,
        to_year: findExp.to_year,
        from_month: findExp.from_month,
        to_month: findExp.to_month,
        city: findExp.city,
        country: findExp.country,
        details: findExp.details,
      })
    }
  }
  const deleteExp = (volId: number) => {
    const updatedExperience = resumeData.volunteers?.filter(
      (exp) => exp.id !== volId
    );

    const updatedResume: IResume = {
      ...resumeData,
      volunteers: updatedExperience,
    };

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



  return (
    <>
      <div className="mb-2">
        <h1 className={`lg:text-4xl font-bold mb-1 lg:w-full w-45 ${isDark ? "text-white" : "text-sky-700"}`}>
          {t("Tell us about your volunteers")}</h1>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600 text-sky-700"} lg:text-sm text-xs lg:w-full w-45`}>
          {t("We’ll start there and work backward.")}</p>
        <p className="text-xs text-red-500 pt-6">{t("* these fields are mandatory")}</p>
      </div><form className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-6 col-span-12">
          <Input
            label={t("Title")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
            value={vol.role}
            onChange={(e) => handleVolChange('role', e.target.value)}
            errorMessage={errors.role} />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <Input
            label={t("Company")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
            value={vol.company}
            onChange={(e) => handleVolChange('company', e.target.value)}
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
            value={vol.from_month}
            onChange={(e) => handleVolChange('from_month', e.target.value)} />
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
            value={vol.from_year}
            onChange={(e) => handleVolChange('from_year', e.target.value)} />
        </div>

        <div className="lg:col-span-3 col-span-6">
          <Select
            forSelect={t("Month")}

            className={`${isDark ? "border-gray-700 text-white bg-gray-800" : "border-gray-300 bg-white text-black"} w-full border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}`}
            oneValue={<>
              {workMonth.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </>}
            value={vol.to_month}
            onChange={(e) => handleVolChange('to_month', e.target.value)}
            label={t("End Date")} />
          <div><p className="text-sm text-red-500">{errors.to_year}</p></div>
        </div>

        <div className="lg:col-span-3 col-span-6">
          <Select
            forSelect={t("Year")}
            className={` ${isDark ? "border-gray-700 text-white bg-gray-800" : "border-gray-300 bg-white text-black"} w-full border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark ? "border-gray-700 text-white" : "border-gray-300 text-black"}`}
            oneValue={<>
              {workYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </>}
            value={vol.to_year}
            onChange={(e) => handleVolChange('to_year', e.target.value)} />
        </div>
        <div className="lg:col-span-6 col-span-12">
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
            value={vol.country?.id}
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
        <div className="lg:col-span-6 col-span-12">
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
            value={vol.city?.id}
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
        <div className="col-span-12">
          <label htmlFor="desc" className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{t("Description")}</label>
          <textarea
            id="desc"
            rows={4}
            value={vol.details}
            onChange={(e) => handleVolChange('details', e.target.value)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`} />
        </div>

        <div className="col-span-12 flex justify-end mb-10">
          <Button
            onClick={addVol}
            title={volId == 0 ? t("Add") : t("Update")}
            className={`rounded-full py-2 px-6 transition-all duration-300 ${isDark ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`} />
        </div>
      </form>
      {Array.isArray(resumeData?.volunteers) &&
        resumeData?.volunteers
          .filter((vol: IVolunteer) =>
            !sampleResume.resume?.volunteers?.some(
              (sample) =>
                JSON.stringify({ ...sample, id: undefined }) ===
                JSON.stringify({ ...vol, id: undefined })
            )
          )
          .map((vol: IVolunteer, index: number) => (
            <div
              key={vol.id || index}
              className={`w-full rounded-xl shadow-lg hover:shadow-xl mt-5 transition-all duration-300 mb-8 overflow-hidden group ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <div className="flex flex-col lg:flex-row justify-between p-6 items-start gap-6">
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-start sm:items-center gap-3 flex-wrap">
                    <div className="w-2 h-2 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#60a5fa" : "#3b82f6" }}></div>
                    <p className={`text-xl font-semibold group-hover:text-blue-600 transition-colors break-words ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Role")}:</span>
                      {vol.role}
                    </p>
                  </div>

                  <div className="flex items-start sm:items-center gap-3 mx-0 sm:ml-5 flex-wrap">
                    <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                    <p className={`text-lg font-medium break-words ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      <span className={`text-sm font-normal mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Company")}:</span>
                      {vol.company}
                    </p>
                  </div>


                  <div className="flex items-start sm:items-center gap-3 ml-0 sm:ml-5 flex-wrap">
                    <div className="w-1.5 h-1.5 rounded-full mt-1 sm:mt-0" style={{ backgroundColor: isDark ? "#9ca3af" : "#9ca3af" }}></div>
                    <div className="flex flex-wrap items-start sm:items-center gap-4">
                      <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        <span className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("From")}:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          {vol.from_month}, {vol.from_year}
                        </span>
                      </p>
                      <span className="text-gray-400 hidden sm:inline">{lang === "en" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</span>

                      <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        <span className={`text-sm mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("To")}:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {vol.to_year === "Present" || vol.to_month === "Present" ? t("present") : `${vol.to_month}, ${vol.to_year}`}
                        </span>
                      </p>
                    </div>
                  </div>
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
                                📍 {vol.country.en_name}, {vol.city.en_name}
                              </span>
                            </p>
                          </div>
                  {vol.details && <div className="ml-0 sm:ml-5 mt-4">
                    <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("Description")}:</p>
                    <p className={`leading-relaxed p-4 rounded-lg border-l-4 text-sm break-words ${isDark ? "bg-gray-900 border-blue-400 text-gray-200" : "bg-gray-50 border-blue-200 text-gray-700"}`}>
                      {vol.details}
                    </p>
                  </div>}
                </div>

                <span className="flex gap-3 self-end sm:self-start flex-shrink-0">
                  <Button
                    btnContentClassname="hover:bg-red-50 rounded-lg transition-all duration-200"
                    onClick={() => deleteExp(vol.id!)}
                    buttonContent={
                      <div className={`text-center w-full items-center border p-3 group/btn rounded-md 
                          ${isDark ? "border-red-700 bg-red-700 text-white" : "border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50"}`}>
                        <Trash2

                          size={18}
                          onClick={() => deleteExp(vol.id!)}
                          className="group-hover/btn:scale-110 transition-transform text-center"
                        />
                      </div>
                    }
                  />
                  <Button
                    btnContentClassname="hover:bg-green-50 rounded-lg transition-all duration-200 group/btn"
                    onClick={() => getExpById(vol.id!)}
                    buttonContent={
                      <div className={`items-center border p-3 group/btn rounded-md ${isDark ? "border-green-700 bg-green-700 text-white" :
                        "border-green-200 text-green-500 hover:border-green-300 hover:bg-green-50"}`}>
                        <Pen
                          onClick={() => getExpById(vol.id!)}
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

    </>
  )
}

export default Volunteers