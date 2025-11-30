import { FC, useEffect, useState } from "react";
import { ICountry, ICourse, ICVData, IGovernment, IResume } from "../../../Interfaces/interface";
import Button from "../../../Containers/Button";
import { ArrowLeft, ArrowRight, Pen, Trash2 } from "lucide-react";
import Input from "../../../Containers/Input";
import Select from "../../../Containers/Select";
import { axiosInst } from "../../../axios/axios";
import { sampleResume } from "../ChooseTemplate/Templates";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useTranslation } from "react-i18next";
import RadioButton from "../../../Containers/Radiobutton";
interface coursesProps {
  lang?: string
}
const Courses: FC<coursesProps> = ({ lang }) => {
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i)
  const token = useSelector((state: RootState) => state.token.token)
  const workMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [errors, setErrors] = useState<Partial<Record<keyof ICourse, string>>>({});
  const [countries, setCountries] = useState<ICountry[]>([])
  const [governs, setGoverns] = useState<IGovernment[]>([])
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    courses: [],
  }));
  const { t } = useTranslation()
  const isDark = useSelector((state: RootState) => state.isDark.isDark)

  const [courId, setCourId] = useState(0)
  const [cour, setCour] = useState<ICourse>(() => ({
    course_name: '',
    institution: '',
    course_type: true,
    from_year: '',
    to_year: '',
    from_month: '',
    to_month: '',
    remote: false,
    present: false,
    details: '',
    country: {},
    city: {},
  }));
  const mapResumeToICVData = (): ICVData => {
    const tempId = Number(localStorage.getItem('tempId'))
    return {
      temp_id: tempId, // dynamic if needed
      heading: JSON.stringify({
        summary: resumeData.summary || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        country: resumeData.country || '',
        city: resumeData.city || '',
        name: `${resumeData.full_name || ''}`.trim()
      }),
      work_History: JSON.stringify(resumeData.work_History || []),
      education: JSON.stringify(resumeData.education || []),
      languages: JSON.stringify(resumeData.languages || []),
      courses: JSON.stringify(resumeData.courses || []),

    };
  };
  const SubmitCourse = async () => {
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
        console.log(mapResumeToICVData());

        toast.success("Course added successfully")
      }
    }


  };

  const addCourse = () => {
    try {
      const newErrors: Partial<Record<keyof ICourse, string>> = {};

      const currentCour = resumeData.courses || [];
      const isDefaultOnly = currentCour.length === 2 &&
        currentCour.every((exp) =>
          sampleResume.resume?.courses?.some((sample) =>
            JSON.stringify({ ...sample, id: undefined }) ===
            JSON.stringify({ ...exp, id: undefined })
          )
        );

      let cleanedCourses = isDefaultOnly ? [] : currentCour;

      let updatedCourses;

      if (courId > 0) {
        updatedCourses = cleanedCourses.map((course) =>
          course.id === courId ? { ...cour, id: courId } : course
        );

      } else {
        const maxId = cleanedCourses.reduce((max, course) => {
          return course.id && course.id > max ? course.id : max;
        }, 0);
        const newCour = { ...cour, id: maxId + 1, workTo: cour.to_year };
        updatedCourses = [...cleanedCourses, newCour];
      }
      (Object.keys(cour!) as (keyof ICourse)[]).forEach((key) => {
        const value = cour![key]
        const isEmpty = value === null || value === undefined || String(value).trim() === "";
        if (isEmpty) {
          newErrors[key] = t(`Required`);
        }
      });
      if (
        cour.from_year &&
        cour.to_year &&
        Number(cour.from_year) > Number(cour.to_year)
      ) {
        newErrors.from_year = t("Start date cannot be after end date");
      }
      if (cour.from_year === cour.to_year) {
        if (
          cour.from_month &&
          cour.to_month &&
          Number(cour.from_month) > Number(cour.to_month)
        ) {
          newErrors.from_year = t("Start month cannot be after end month");
        }
      }
      if (cour.from_year === cour.to_year && cour.from_month === cour.to_month) {
        newErrors.from_year = t("Start month cannot equals end month");

      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        const updatedResume: IResume = {
          ...resumeData,
          courses: updatedCourses,
        };
        setResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));
        SubmitCourse()

        setCour({
          course_name: '',
          course_type: true,
          institution: '',
          from_year: '',
          to_year: '',
          from_month: '',
          to_month: '',
          details: '',
          country: {},
          city: {},
        });

        setCourId(0); // Reset editing mode
      }
    } catch (error) {
      console.error("Error in addExperience:", error);
    }
  };
  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = JSON.parse(localStorage.getItem('resumeData')!)
    if (myTempId)
      setResumeData(storedResume)
  }, []);
  const getCourById = (courId: number) => {
    setCourId(courId)

    const findCour: ICourse = resumeData.courses?.find((cour: ICourse) => cour.id == courId)!
    if (findCour) {
      setCour({
        course_name: findCour.course_name,
        course_type: findCour.course_type,
        institution: findCour.institution,
        from_year: findCour.from_year,
        to_year: findCour.to_year,
        from_month: findCour.from_month,
        to_month: findCour.to_month,
        details: findCour.details,
        country: findCour.country,
        city: findCour.city,
      })
    }
  }
  const deleteCourse = (courId: number) => {
    const updatedCourse = resumeData.courses?.filter(
      (cour) => cour.id !== courId
    );

    const updatedResume: IResume = {
      ...resumeData,
      courses: updatedCourse,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };
  const handleCourChange = (field: keyof ICourse, value: any) => {
    setCour((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  const handleChangeCountry = async (field: keyof ICourse, value: number) => {
    let findObj;
    if (field === "country") {
      findObj = countries.find((c: ICountry) => c.id === value)
      await getGoverns(findObj?.id!)
    } else {
      findObj = governs.find((c: ICountry) => c.id === value)
    }
    setCour({
      ...cour,
      [field]: findObj
    })

  };

  const getGoverns = async (counId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllGovernmentByCountryId?countryId=${counId}`, {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`
        }
      });
      setGoverns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setGoverns([]);
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

  useEffect(() => {
    getCountries();
  }, []);




  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDark ? "bg-gray-900 text-white" : "text-black"
        }`}
    >
      <div className="mb-8">
        <p
          className={`lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-sky-700"
            }`}
        >
          {t("Do you have any courses? ,Tell us")}
        </p>
        <p
          className={`text-sm mt-1 max-w-lg ${isDark ? "text-gray-300" : "text-gray-600"
            }`}
        >
          {t("Enter your intern name and date even if you are a current student or did not graduate.")}
        </p>
        <p className="text-xs pt-8 font-semibold text-red-500">
          * these fields are mandatory
        </p>
      </div>

      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="lg:col-span-6 col-span-12 px-2">
          <Input
            className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border border-gray-300"
              }`}
            label={t("Institution")}
            value={cour?.institution}
            onChange={(e) => handleCourChange("institution", e.target.value)}
            errorMessage={errors.institution}
          />
        </div>

        <div className="lg:col-span-6 col-span-12 px-2">
          <Input
            className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border border-gray-300"
              }`}
            label={t("Course name")}
            value={cour?.course_name}
            onChange={(e) => handleCourChange("course_name", e.target.value)}
            errorMessage={errors.course_name}
          />
        </div>

        <div className="lg:col-span-6 col-span-12 px-2">
          <Select
            label={t("Country")}
            onChange={(e) => handleChangeCountry("country", Number(e.target.value))}
            errorMessage={errors.country}
            value={cour.country?.id}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border border-gray-300"
              }`}
            oneValue={
              <>
                {countries?.map((country, index) => (
                  <option key={index} value={country.id}>{lang === "en" ? country.en_name : country.ar_name}</option>
                ))}
              </>
            }
          />
        </div>

        <div className="lg:col-span-6 col-span-12 px-2">
          <Select
            label={t("City")}

            onChange={(e) => handleChangeCountry("city", Number(e.target.value))}
            errorMessage={errors.city}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border border-gray-300"
              }`}
            value={cour.city?.id}
            oneValue={
              <>
                {governs?.map((city, index) => (
                  <option key={index} value={city.id}>{lang === "en" ? city.en_name : city.ar_name}</option>
                ))}
              </>
            }
          />
        </div>

        {/* التاريخ */}
        <div className="col-span-12 px-2">
          <div className="grid lg:grid-cols-4 grid-cols-12 gap-3">

            {/* Start Month */}
            <div className="lg:col-span-1 col-span-6">
              <Select
                className={`w-full rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
                  }`}
                forSelect={t("Month")}
                label={t("Start Date")}
                oneValue={
                  <>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>
                }
                value={cour.from_month}
                onChange={(e) => handleCourChange("from_month", e.target.value)}
              />
              <div>
                <p className="text-sm text-red-500">{errors.from_year}</p>
              </div>
            </div>

            {/* Start Year */}
            <div className="lg:col-span-1 col-span-6">
              <Select
                className={`w-full rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
                  }`}
                forSelect={t("Year")}
                oneValue={
                  <>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>
                }
                value={cour.from_year}
                onChange={(e) => handleCourChange("from_year", e.target.value)}
              />
            </div>

            {/* End Month */}
            <div className="lg:col-span-1 col-span-6">
              <Select
                forSelect={t("Month")}
                className={`w-full rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
                  }`}
                oneValue={
                  <>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>
                }
                value={cour.to_month}
                onChange={(e) => handleCourChange("to_month", e.target.value)}
                label={t("End Date")}
              />
              <div>
                <p className="text-sm text-red-500">{errors.to_year}</p>
              </div>
            </div>

            {/* End Year */}
            <div className="lg:col-span-1 col-span-6">
              <Select
                forSelect={t("Year")}
                className={`w-full rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
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
                value={cour.to_year}
                onChange={(e) => handleCourChange("to_year", e.target.value)}
              />
            </div>

          </div>
        </div>
        <div className="lg:col-span-6 grid grid-cols-3 px-3">
          <div className="col-span-12 mb-2">
            <h1>{t("Study type")}</h1>
          </div>
          <RadioButton
            name="courseType"
            value="true"
            label={t("Remotely")}
            checked={cour.course_type === true}
            onChange={(e) => setCour((prev) => ({
              ...prev,
              course_type: e.target.value === "true",
            }))} />

          <RadioButton
            name="courseType"
            value="false"
            label={t("Onsite")}
            checked={cour.course_type === false}
            onChange={(e) => setCour((prev) => ({
              ...prev,
              course_type: e.target.value === "true",
            }))} />
        </div>

        <div className="col-span-12">
          <label
            htmlFor="desc"
            className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"
              }`}
          >
            {t("Description")}
          </label>
          <textarea
            id="desc"
            rows={4}
            value={cour.details}
            onChange={(e) => handleCourChange("details", e.target.value)}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none ${isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border border-gray-300"
              }`}
          />
          <div>
            <p className="text-sm text-red-500">{errors.details}</p>
          </div>
        </div>

        <div className="col-span-12 flex justify-end mb-10">
          <Button
            onClick={addCourse}
            title={courId == 0 ? t("Add") : t("Update")}
            className={`rounded-full py-2 px-6 transition-all duration-300 ${isDark
              ? "bg-sky-700 hover:bg-sky-600 text-white"
              : "bg-sky-600 hover:bg-sky-700 text-white"
              }`}
          />
        </div>
      </form>

      {/* Courses list */}
      <div className="mb-20">
        {resumeData?.courses
          ?.filter(
            (edu) =>
              !sampleResume.resume?.courses?.some(
                (sample) =>
                  JSON.stringify({ ...sample, id: undefined }) ===
                  JSON.stringify({ ...edu, id: undefined })
              )
          )
          .map((cour, index) => (
            <div
              key={cour.id || index}
              className={`w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 overflow-hidden group border ${isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
                }`}
            >
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              <div className="flex flex-col lg:flex-row justify-between p-4 sm:p-6 items-start gap-6">
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-start sm:items-center gap-3 flex-wrap">
                    <p
                      className={`text-xl font-semibold break-words ${isDark
                        ? "text-gray-200"
                        : "text-gray-900 group-hover:text-indigo-600"
                        }`}
                    >
                      <span className="text-gray-500 text-sm font-normal mr-2">
                        {t("Institution")}:
                      </span>
                      {cour.institution}
                    </p>
                  </div>

                  <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                    <p
                      className={`text-lg font-medium break-words ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      <span className="text-gray-500 text-sm mr-2">
                        {t("Course name")}:
                      </span>
                      <span className="inline-flex items-center px-3 mx-2 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        📚 {cour.course_name}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                    <p
                      className={`break-words ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      <span className="text-gray-500 text-sm mr-2">
                        {t("Country")}:
                      </span>
                      <span className="inline-flex items-center px-2.5 mx-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        🌍 {lang === 'en' ? cour.city.en_name : cour.city.ar_name}, {lang === 'en' ? cour.country.en_name : cour.country.ar_name}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
                    <div className="flex flex-wrap items-start sm:items-center gap-4">
                      <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                        <span className="text-gray-500 text-sm mr-2">
                          {t("From")}:
                        </span>
                        <span className="inline-flex items-center px-3 mx-2 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                          📅 {cour.from_month + ", " + cour.from_year}
                        </span>
                      </p>
                      <span className="text-gray-400 hidden sm:inline">{lang === "en" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</span>
                      <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                        <span className="text-gray-500 text-sm mr-2">{t("To")}:</span>
                        <span className="inline-flex items-center px-3 mx-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          📅 {cour.to_month + ", " + cour.to_year}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start sm:items-center gap-3 sm:ml-5 ml-0 flex-wrap">
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
                      <span className="inline-flex items-center px-3 mx-2 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cour.course_type ? t("Remotely") : t("Onsite")}
                      </span>
                    </p>
                  </div>
                </div>

                <span className="flex gap-3 self-end sm:self-start w-full sm:w-auto justify-end sm:justify-start">
                  <Button
                    btnContentClassname="p-0"
                    className="items-center"
                    buttonContent={
                      <div className="p-3 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 text-center">
                        <Trash2
                          color="red"
                          size={18}
                          onClick={() => deleteCourse(cour.id!)}
                        />
                      </div>
                    }
                  />
                  <Button
                    btnContentClassname="p-0"
                    className="items-center"
                    buttonContent={
                      <div className="p-3 hover:bg-green-50 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300 text-center">
                        <Pen
                          onClick={() => getCourById(cour.id!)}
                          color="green"
                          size={18}
                        />
                      </div>
                    }
                  />
                </span>
              </div>
            </div>
          ))}
      </div>


    </div>
  )
}

export default Courses;
