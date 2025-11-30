import { useNavigate } from "react-router-dom"
import Button from "../../../Containers/Button"
import Input from "../../../Containers/Input"
import SideBar from "../../../Containers/SideBar"
import { ChangeEvent, useEffect, useState } from "react"
import Templates, { sampleResume } from "../ChooseTemplate/Templates"
import { ICountry, ICVData, IDepartment, IGovernment, ILanguage, IResume, IVillage } from "../../../Interfaces/interface"
import { axiosInst } from "../../../axios/axios"
import Select from "../../../Containers/Select"
import { ChevronLeft, ChevronRight, Edit, Eye, Globe, LogOut, Pen, PlusCircle, Trash2, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../Redux/store"
import { toast } from "react-toastify"
import { clearFoundUser } from "../../../Redux/Slices/userSlice"
import { t } from "i18next"
import PhoneInput from 'react-phone-input-2';
import { removeCookie } from "../../../Utils/cookies"
import { setResumeLangSlice } from "../../../Redux/Slices/resumeLang"

const Fill = () => {
  const navigate = useNavigate()
  const [tempId, setTempId] = useState(0)
  const [langId, setLangId] = useState(0)
  // const [isTempWithImg, setIsTempWithImg] = useState(false)
  const [countries, setCountries] = useState<ICountry[]>([])
  const [provinces, setProvinces] = useState<IDepartment[]>([])
  const [governs, setGoverns] = useState<IGovernment[]>([])
  const [villages, setVillages] = useState<IVillage[]>([])
  const resumeColor = useSelector((state: RootState) => state.resumeColor.resumeColor)
  const temps = useSelector((state: RootState) => state.tempImg.isResumeWithImg)
  const foundCv = useSelector((state: RootState) => state.foundCv.localStorageCv)
  // const [resumeImage, setResumeImage] = useState<IImage>();
  const [showPreview, setShowPreview] = useState(false)
  const isDark = useSelector((state: RootState) => state.isDark.isDark)
  const lang = useSelector((state: RootState) => state.resumeLang.resumeLang)

  const [addLangs, setAddLangs] = useState<ILanguage>({
    language: '',
    proficiency: ''
  })
  const dispatch: AppDispatch = useDispatch()
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    full_name: "",
    last_name: "",
    city: {},
    country: {},
    province: {},
    village: {},
    address_info: "",
    birth_date: 0,
    birth_place: '',
    nationality: '',
    marital_status: '',
    military_status: '',
    proficiency: '',
    phone: "",
    email: "",
    title: "",
    summary: "",
    certifications: [],
    languages: [],
    work_History: [],
    skills: [],
    personal_Links: [],
    education: [],
    // image: resumeImage
    image: {}
  }));

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case t('Native' , {lng : lang}):
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case t('Fluent' , {lng : lang}):
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case t('Intermediate' , {lng : lang}):
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case t('Beginner' , {lng : lang}):
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getProficiencyIcon = (proficiency: string) => {
    const level = proficiency;
    if (level === t('Native' , {lng : lang})) return '★★★★★';
    if (level === t('Fluent' , {lng : lang})) return '★★★★☆';
    if (level === t('Intermediate' , {lng : lang})) return '★★★☆☆';
    if (level === t('Beginner' , {lng : lang})) return '★★☆☆☆';
    return '★☆☆☆☆';
  };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const maxSizeInMB = 2;
  //   const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  //   if (file.size > maxSizeInBytes) {
  //     alert(`Image is too large. Max size is ${formatFileSize(maxSizeInBytes)}, but your file is ${formatFileSize(file.size)}`);
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64 = reader.result?.toString().split(',')[1];

  //     setResumeImage({
  //       title: file.name,
  //       description: '',
  //       base64Image: base64,
  //       fileExtension: `.${file.name.split('.').pop() || 'webp'}`
  //     });

  //     const updatedResume = {
  //       ...resumeData,
  //       image: {
  //         title: file.name,
  //         description: '',
  //         base64Image: base64,
  //         fileExtension: `.${file.name.split('.').pop() || 'webp'}`
  //       }
  //     }
  //     setResumeData(updatedResume)
  //     localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  //   };

  //   reader.readAsDataURL(file);
  // };

  const getCountries = async () => {
    try {
      const res = await axiosInst.get('/api/Common/GetAllCountries');
      setCountries(res.data.data || []);
    } catch (err) {
      console.error("Failed to load countries", err);
      setCountries([]);
    }
  };

  const getGoverns = async (counId: number) => {
    try {
      const res = await axiosInst.get(`/api/Common/GetAllGovernmentByCountryId?countryId=${counId}`);
      setGoverns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load governments", err);
      setGoverns([]);
    }
  };
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


  // ✅ لما تختار الدولة
  const handleChangeCountry = async (field: keyof IResume, value: number) => {
    const findCountry = countries.find((country: ICountry) => country.id === value);

    const updatedResume = {
      ...resumeData,
      [field]: findCountry,
    };

    await getGoverns(value || 0);
    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };

  useEffect(() => {
    getCountries();
  }, [temps]);

  useEffect(() => {
    if (foundCv) {
      const resume = JSON.parse(localStorage.getItem('resumeData')!)
      setResumeData(resume)
    }
  }, [foundCv]);

  useEffect(() => {
    const storedLang = localStorage.getItem('resumeLang');
    if (storedLang) {
      dispatch(setResumeLangSlice(storedLang));
    }
  }, []);



  const Marital = [t("Married" , {lng : lang}), t("Single" , {lng : lang}), t("Divorced" , {lng : lang}), t("Widowed")]
  const Military = [t("Completed" , {lng : lang}), t("Not Completed" , {lng : lang}), t("Exempt" , {lng : lang}), t("Postponed" , {lng : lang}), t("Currently Serving")]
  const langProfs = [t("Beginner" , {lng : lang}), t("Intermediate" , {lng : lang}), t("Fluent" , {lng : lang}), t("Native")]
  const languages = [
    t("English" , {lng : lang}),
    t("Arabic" , {lng : lang}),
    t("French" , {lng : lang}),
    t("Chinese" , {lng : lang}),
    t("Japanese" , {lng : lang}),
    t("Dutch" , {lng : lang}),
  ];

  const [summaryError, setSummaryError] = useState(false);
  const [langErrors, setLangErros] = useState<Partial<Record<keyof ILanguage, string>>>({});


  const isValidSummary = (text: string) => {
    const letters = text.match(/[a-zA-Z]/g);
    return letters && letters.length >= 200;
  };
  const handleChangeSummary = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const isValid = isValidSummary(value);
    setSummaryError(!isValid);
    const resume = JSON.parse(localStorage.getItem('resumeData') || "null");
    if (name === "summary") {
      const updatedResume = {
        ...resume,
        summary: value,
      };

      setResumeData(updatedResume);
      localStorage.setItem('resumeData', JSON.stringify(updatedResume));
    }
  };


  const [errors, setErrors] = useState<Partial<Record<keyof IResume, string>>>({});
  const mapResumeToICVData = (): ICVData => {
    const tempId = Number(localStorage.getItem('tempId'))
    const color = (localStorage.getItem('color')!)
    return {
      temp_id: tempId,
      color: color!,
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
      languages: JSON.stringify(resumeData.languages || []),
      courses: JSON.stringify(resumeData.courses || []),
      work_History: JSON.stringify(resumeData.work_History || []),
      education: JSON.stringify(resumeData.education || []),
      skills: Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : '',
      personal_Links: Array.isArray(resumeData.personal_Links) ? resumeData.personal_Links?.join(', ') : '',
      image: resumeData.image || null!,
      is_paid: false
    };
  };

  const handleNext = async () => {

    const token = localStorage.getItem("token")
    const res = await axiosInst.post('api/CV_Users/AddUserDateToTemplate', mapResumeToICVData(), {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.status === 200) {
      addHeadingValues()
    }
  }
  const handleChangeLang = (field: keyof ILanguage, value: any) => {
    setAddLangs((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }


  const handleChange = (field: keyof IResume, value: any) => {
    const updatedResume = {
      ...resumeData,
      [field]: value,
    };

    setResumeData(updatedResume);
    localStorage.setItem('resumeData', JSON.stringify(updatedResume));

  };
  const addHeadingValues = () => {
    const newErrors: Partial<Record<keyof IResume, string>> = {};
    const requiredFields: (keyof IResume)[] = [
      "full_name",
      "village",
      "province",
      "city",
      "country",
      "phone",
      "email",
      "summary",
      "marital_status",
      "military_status",
      "birth_date",
    ];

    requiredFields.forEach((key) => {
      const value = resumeData[key];
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "");

      if (isEmpty) {
        newErrors[key] = t("Required");
      }
      if ((key === "city" || key === "country") && (value === 0 || value === "0" || !value)) {
        newErrors[key] = t(`Required`);
      }
      if (key === "phone" && value && !/^\d+$/.test(value.toString())) {
        newErrors[key] = t("Phone must contain only numbers");
      }
      if (key === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
        newErrors[key] = t("Invalid email address");
      }
      if (key === "birth_date" && value) {
        const year = parseInt(value.toString().slice(0, 4));

        if (isNaN(year) || year > 2008) {
          newErrors[key] = t("Invalid dob" , {lng : lang});
        }
      }

    });
    if (Object.keys(newErrors).length > 0) {
      console.log("Errors found:", newErrors);
      setErrors(newErrors);
      toast.error(t("Please fill all required fields correctly"));
      return;
    }
    const langs = resumeData.languages;
    if (
      !Array.isArray(langs) ||
      langs.length < 1 ||
      langs.every((lang) => !lang.language?.trim())
    ) {
      toast.warn(t("Please add at least 1 or 2 languages"));
      return;
    }
    navigate("/build-resume/work-history");
  };

  const addLang = () => {
    const newErrors: Partial<Record<keyof ILanguage, string>> = {};

    try {
      const currentLangs = resumeData.languages || [];

      const isDefaultOnly =
        currentLangs.length === 2 &&
        currentLangs.every((lang) =>
          sampleResume.resume?.languages?.some(
            (sample) =>
              JSON.stringify({ ...sample, id: undefined }) ===
              JSON.stringify({ ...lang, id: undefined })
          )
        );

      let cleanedLangs = isDefaultOnly ? [] : currentLangs;

      let updatedLanguages;

      if (langId > 0) {
        // update existing
        updatedLanguages = cleanedLangs.map((lang) =>
          lang.id === langId ? { ...addLangs, id: langId } : lang
        );
      } else {
        // add new
        const maxId = cleanedLangs.reduce((max, lang) => {
          return lang.id && lang.id > max ? lang.id : max;
        }, 0);
        const newLang = { ...addLangs, id: maxId + 1 };
        updatedLanguages = [...cleanedLangs, newLang];
      }

      // Validate required fields
      (Object.keys(addLangs) as (keyof ILanguage)[]).forEach((key) => {
        const value = addLangs[key];
        const isEmpty =
          value === null || value === undefined || String(value).trim() === "";
        if (isEmpty) {
          newErrors[key] = t(`Required`);
        }
      });
      setLangErros(newErrors);
      if (Object.keys(newErrors).length === 0) {

        const updatedResume: IResume = {
          ...resumeData,
          languages: updatedLanguages,
        };

        setResumeData(updatedResume);
        localStorage.setItem("resumeData", JSON.stringify(updatedResume));

        setAddLangs({
          id: 0,
          language: '',
          proficiency: ''
        });

        setLangId(0); // Reset editing mode
      }

    } catch (error) {
      console.error("Failed to add language:", error);
    }
  };



  const getLangById = (langId: number) => {
    setLangId(langId)

    const findLang: ILanguage = resumeData.languages?.find((lang: ILanguage) => lang.id == langId)!
    if (findLang) {
      setAddLangs({
        language: findLang.language,
        proficiency: findLang.proficiency,
      })
    }
  }
  const deleteEdu = (langId: number) => {
    const updatedLang = resumeData.languages?.filter(
      (lang) => lang.id !== langId
    );

    const updatedResume: IResume = {
      ...resumeData,
      languages: updatedLang,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };

  useEffect(() => {
    const tempId = JSON.parse(localStorage.getItem('tempId') || "null");
    if (tempId) setTempId(tempId);
  }, [countries]);
  useEffect(() => {
    // const tempId = JSON.parse(localStorage.getItem('tempId') || "null");

    // const findTemp = templates.find((temp: any) => temp.id == tempId)
    // if (findTemp) {
    //   if (!findTemp.withImage) {
    //     setIsTempWithImg(true);

    //   } else {
    //     console.log(false);

    //   }
    //   setIsTempWithImg(findTemp?.withImage)
    // }
  }, []);
  const handleLogout = () => {
    removeCookie('token')
    dispatch(clearFoundUser());
    navigate('/login')
  }
  const handleChangeCity = async (field: keyof IResume, value: number) => {
    const findCity = governs.find((city) => city.id === value);
    await getProvinces(value || 0)
    const updatedResume = {
      ...resumeData,
      [field]: findCity,
    };
    await getProvinces(findCity?.id!)
    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume)); // ✅ الكائن كله مش الاسم بس
  };
  const handleChangeProvince = async (field: keyof IResume, value: number) => {
    const findProv = provinces.find((prov) => prov.id === value);

    const updatedResume = {
      ...resumeData,
      [field]: findProv,
    };
    await getVillages(findProv?.id!)
    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };
  const handleChangeVillage = (field: keyof IResume, value: number) => {
    const findVillage = villages.find((prov) => prov.id === value);
    const updatedResume = {
      ...resumeData,
      [field]: findVillage,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };


  return (
    <div
      className={`overflow-y-auto hide-scrollbar h-screen w-full transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >

      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <SideBar />
        </div>

        <div className="lg:col-span-10 col-span-12 p-10">
          <div className="flex justify-between lg:mt-0 mt-10">
            <div className="mb-6">
              <h1
                className={`lg:text-4xl font-bold mb-1 ${isDark ? "text-white" : "text-sky-700"
                  }`}
              >
                {t("Start filling your data" , {lng : lang})}
              </h1>
              <p
                className={`lg:text-sm text-xs lg:w-full w-45 ${isDark ? "text-gray-300" : "text-gray-600 text-sky-700"
                  }`}
              >
                {t("Enter your data below to make your resume more reachable..." , {lng : lang})}
              </p>
              <p className="text-xs text-red-500 pt-6">
                {t("* these fields are mandatory" , {lng : lang})}
              </p>
            </div>
            <div>
              <Button
                onClick={handleLogout}
                buttonContent={
                  <div
                    className={`flex gap-1 lg:text-sm text-xs p-2 shadow-md transition-all transform hover:shadow-lg duration-500 ${isDark
                      ? "bg-gray-800 text-sky-400"
                      : "text-[#0069a8] bg-white-300"
                      }`}
                  >
                    <LogOut size={18} />
                    <p>{t("signOut" , {lng : lang})} </p>
                  </div>
                }
              />
            </div>
          </div>

          <form className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-4 col-span-12">
              <Input
                className={`w-full border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-black"
                  }`}
                label={t("Full name" , {lng : lang})}
                onChange={(e) => handleChange("full_name", e.target.value)}
                errorMessage={errors.full_name}
                value={resumeData?.full_name}
              />
            </div>

            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Select Country" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChangeCountry("country", Number(e.target.value))}
                errorMessage={errors.country}
                value={resumeData.country?.id}
                oneValue={
                  <>
                    {countries?.map((country: ICountry, index: number) => {
                      return (
                        <option key={index} value={country.id}>
                          {lang === "en" ? country?.en_name?.charAt(0).toUpperCase() +
                            country.en_name?.slice(1)! : country.ar_name}
                        </option>
                      );
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Select City" , {lng : lang})}
                onChange={(e) => handleChangeCity("city", Number(e.target.value))}
                errorMessage={errors.city}
                forSelect={t("Choose" , {lng : lang})}
                value={resumeData.city?.id}
                oneValue={
                  <>
                    {governs?.map((city: IGovernment, index: number) => {
                      return (
                        <option key={index} value={city.id}>
                          {lang === "en" ? city?.en_name?.charAt(0).toUpperCase() +
                            city.en_name?.slice(1)! : city.ar_name}
                        </option>
                      );
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Province" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChangeProvince("province", Number(e.target.value))}
                errorMessage={errors.province}
                value={resumeData.province?.id}
                oneValue={
                  <>
                    {provinces?.map((city: IGovernment, index: number) => {
                      return (
                        <option key={index} value={city.id}>
                          {lang === "en" ? city?.en_name?.charAt(0).toUpperCase() +
                            city.en_name?.slice(1)! : city.ar_name}
                        </option>
                      );
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Village" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
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
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <Input
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-black"
                  }`}
                label={t("Additional address info" , {lng : lang})}
                onChange={(e) => handleChange("address_info", e.target.value)}
                errorMessage={errors.address_info}
                value={resumeData?.address_info}
              />
            </div>

            <div className="lg:col-span-4 col-span-12"> <label htmlFor="phone">{t("Phone" , {lng : lang})}</label>
              <div dir={"ltr"} className="w-full">

                <PhoneInput
                  country={"eg"}
                  value={resumeData.phone || ""}
                  onChange={(phone) => handleChange("phone", phone)}
                  containerClass="w-full"
                  inputClass={`
                              !w-full !h-auto !text-base
                              border rounded  py-2 
                              focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                              ${isDark
                      ? "!border-gray-700 !bg-gray-800 !text-white"
                      : "!border-gray-300 !bg-white !text-black"
                    }
                            `}
                  buttonClass={`
                      !border !rounded-l 
                      ${isDark
                      ? "!border-gray-700 !bg-gray-800"
                      : "!border-gray-300 !bg-white"
                    }
                    `}
                  dropdownClass={`
                        ${isDark
                      ? "!bg-gray-800 !text-white"
                      : "!bg-white !text-black"
                    }
                        !border !border-gray-300
                      `}
                  enableSearch
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12">
              <Input
                type="email"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-black"
                  }`}
                onChange={(e) => handleChange("email", e.target.value)}
                errorMessage={errors.email}
                value={resumeData?.email}
                label={t("Email" , {lng : lang})}
              />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <Input
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-black"
                  }`}
                onChange={(e) => handleChange("birth_date", e.target.value)}
                errorMessage={errors.birth_date}
                value={resumeData?.birth_date}
                type="date"
                label={t("Date of birth" , {lng : lang})}
              />
            </div>

            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Marital status" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChange("marital_status", e.target.value)}
                errorMessage={errors.marital_status}
                value={resumeData?.marital_status}
                oneValue={
                  <>
                    {Marital.map((state, index) => {
                      return <option key={index}>{t(state)}</option>;
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            {/* {isTempWithImg ? ( */}
            {/* <div className="lg:col-span-4 col-span-12">
                <div className="relative">
                  <label htmlFor="">Add Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`block w-64 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium hover:file:bg-blue-100 file:cursor-pointer cursor-pointer transition-all duration-200 ${isDark
                      ? "text-gray-300 file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
                      : "text-gray-500 file:bg-blue-50 file:text-blue-700"
                      }`}
                  />
                </div>
              </div> */}
            {/* ) : null} */}

            <div className="lg:col-span-4 col-span-12">
              <Select
                label={t("Military status" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChange("military_status", e.target.value)}
                errorMessage={errors.military_status}
                value={resumeData?.military_status}
                oneValue={
                  <>
                    {Military.map((state, index) => {
                      return <option key={index}>{t(state)}</option>;
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>

            <div className="col-span-12 mb-10">
              <div className="w-full ">
                <label
                  htmlFor="summary"
                  className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  {t("Objective or summary" , {lng : lang})}
                </label>
                <textarea
                  name="summary"
                  onChange={handleChangeSummary}
                  className={`w-full h-40 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${isDark
                    ? "border-gray-700 bg-gray-800 text-white"
                    : "border-gray-400 bg-white text-black"
                    }`}
                  placeholder={t("Write a brief summary about yourself..." , {lng : lang})}
                  value={resumeData?.summary}
                />
                {summaryError && (
                  <p className="text-sm text-red-500 mt-1">
                    {t("Summary must contain at least 200 letters." , {lng : lang})}
                  </p>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 col-span-12">
              <Select
                label={t("Select languages")}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChangeLang("language", e.target.value)}
                errorMessage={langErrors.language}
                value={addLangs.language}
                oneValue={
                  <>
                    {languages.map((state, index) => {
                      return <option key={index}>{state}</option>;
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-5 col-span-12">
              <Select
                label={t("Language proficiency" , {lng : lang})}
                forSelect={t("Choose" , {lng : lang})}
                onChange={(e) => handleChangeLang("proficiency", e.target.value)}
                errorMessage={langErrors.proficiency}
                value={addLangs.proficiency}
                oneValue={
                  <>
                    {langProfs.map((state, index) => {
                      return <option key={index}>{t(state)}</option>;
                    })}
                  </>
                }
                className={`w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-black"
                  }`}
              />
            </div>
            <div className="lg:col-span-2 col-span-12 flex justify-center items-center lg:py-5">
              <Button
                btnContentClassname="p-0"
                onClick={addLang}
                buttonContent={
                  <div
                    title={langId > 0 ? "Update Language" : "Add Language"}
                    className="bg-indigo-600 hover:scale-110 hover:shadow-md transition-all duration-700 p-2 flex justify-center rounded-full text-center text-white"
                  >
                    <p>{langId > 0 ? <Edit /> : <PlusCircle />}</p>
                  </div>
                }
              />
            </div>
            <div className="col-span-12 grid grid-cols-12 py-10 gap-5">
              {resumeData?.languages
                ?.filter((lang) =>
                  !sampleResume.resume?.languages?.some(
                    (sample) =>
                      JSON.stringify({ ...sample, id: undefined }) ===
                      JSON.stringify({ ...lang, id: undefined })
                  )
                )
                .map((lang, index) => {
                  return (
                    <div key={index} className="group lg:col-span-4 col-span-12">
                      <div
                        className={`rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 p-6 ${isDark
                          ? "bg-gray-800 border-gray-700 hover:border-sky-700"
                          : "bg-white border-gray-100 hover:border-gray-200"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Globe className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1">
                              <h3
                                className={`font-semibold text-lg mb-1 ${isDark ? "text-gray-100" : "text-gray-800"
                                  }`}
                              >
                                {t(`${lang.language}`)}
                              </h3>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(
                                    t(lang.proficiency!)
                                  )}`}
                                >
                                  {t(lang.proficiency!)}
                                </span>
                                <span
                                  className="text-amber-400 text-sm"
                                  title={`${t(lang.proficiency!)} level`}
                                >
                                  {getProficiencyIcon(t(lang.proficiency!))}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              btnContentClassname="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              className="flex items-center justify-center"
                              buttonContent={
                                <Pen
                                  onClick={() => getLangById(lang.id!)}
                                  className="text-green-600 hover:text-green-700 cursor-pointer"
                                  size={16}
                                />
                              }
                            />
                            <Button
                              btnContentClassname="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              className="flex items-center justify-center"
                              buttonContent={
                                <Trash2
                                  color="#dc2626"
                                  size={16}
                                  onClick={() => deleteEdu(lang.id!)}
                                  className="hover:text-red-700 cursor-pointer"
                                />
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </form>
        </div>

        {showPreview ? (
          <div
            onClick={() => setShowPreview(!showPreview)}
            className="fixed inset-0 bg-gray-900/75 z-50 flex justify-center animate__animated animate__fadeIn"
          >
            <div
              className={`lg:scale-100 scale-60 w-180 mt-4 animate__animated animate__fadeInUp max-h-180 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-5">
                <X
                  className={`${isDark ? "text-sky-400" : "text-sky-700"} hover:text-red-500`}
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
        ) : null}

        <div
          className={`col-span-12 fixed bottom-0 right-0 p-2 w-full border shadow-md transition-colors duration-300 z-50 ${isDark
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
            }`}
        >
          <div className="flex justify-center lg:justify-end">
            <div className="flex lg:gap-5 gap-10 text-lg font-bold">
              <Button
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"
                  }`}
                onClick={() => navigate(-1)}
                btnTitle="Go Previous"
                buttonContent={<div className="text-sm flex items-center justify-center w-20">
                  {lang === "en" ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                  <p className="text-sm">{t("Previous" , {lng : lang})}</p>
                </div>}
              />{" "}
              <Button
                onClick={() => setShowPreview(true)}
                btnTitle="Show Preview"
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"
                  }`}
                buttonContent={<div className="flex items-center w-32 justify-center gap-1"><Eye />
                 <p className="text-sm">{t("Preview" , {lng : lang})}</p></div>}
              />
              <Button
                onClick={handleNext}
                btnTitle="Go Next"
                buttonContent={<div className="text-sm flex items-center justify-center w-20">
                  <p className="text-sm">{t("Next" , {lng : lang})}</p>
                  {lang === "en" ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </div>}
                className={`rounded-md p-2 transition-all duration-300 border shadow-sm hover:shadow-md hover:bg-sky-100 ${isDark ? "text-white border-white shadow-white" : "border-sky-200 text-sky-600"
                  }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fill
