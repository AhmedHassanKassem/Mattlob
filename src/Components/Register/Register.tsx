import  { type ChangeEvent, useEffect, useState } from "react";
import Input from "../../containers/Input.tsx";
import File from "../../containers/File.tsx";
import Select from "../../containers/Select.tsx";
import CheckBoxInput from "../../containers/Checkbox.tsx";
import Button from "../../containers/Button.tsx";
// import * as pdfjsLib from "pdfjs-dist";
import {  pdfjs } from "react-pdf";
import {  useForm } from "react-hook-form";

import { axiosInst } from "../../axios/axios.ts";
import { toast } from "react-toastify";

import {
  Briefcase,
  Building2,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import SuccessMessage from "../../containers/SuccessMessage.tsx";
import type {
  ICandidate,
  ICountry,
  ICVAttach,
  IEduType,
  IGrade,
  INotifyPeriod,
  IPreviousDesignation,
} from "../../Interfaces/interface";
import { Link } from "react-router-dom";
const Register = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = "http://mattlob1-001-site1.jtempurl.com/static/pdf.worker.mjs";
  const [phoneNumber, setPhoneNumber] = useState("+20");
  const [toYearDisabled, setToYearDisabled] = useState(false);
  const [success, setIsSuccess] = useState(false);
  const [notifyPeriod, setNotifyPeriod] = useState<INotifyPeriod[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [eduTypes, setEduTypes] = useState<IEduType[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [tab, setTab] = useState("personal");
  const [prevDes, setPrevDes] = useState(false);
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const workMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const years = Array.from({ length: 50 }, (_, i) => i + 1);
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
  const [fromDate] = useState<string>("");
  const [toDate] = useState<string>("");
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]); // For extracted skills
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [cvAttach] = useState<ICVAttach>();
  const [previousEmp , setPreviousEmp] = useState<IPreviousDesignation[]>([]);
  const [prevDesForm, setPrevDesForm] = useState<IPreviousDesignation[]>([
    {
      id_previous:0,
      previous_designation: "",
      previous_company: "",
      from_month: 0,
      from_year: 0,
      to_month: 0,
      to_year: 0,
    },
  ]);
  const [candiForm, setCandiForm] = useState<ICandidate>({
    full_name: "",
    userTypeId: 1,
    CV_Attach: cvAttach!,
    account_email: "",
    account_password: "",
    mobile: "",
    Working_From_Month: 0,
    Working_From_Year: 0,
    Working_To_Year: "",
    isPresent: false,
    country_id: 0,
    Experience_Year: 0,
    Experience_Month: 0,
    Is_Permentant: false,
    Is_Contract: false,
    Current_Designation: "",
    Current_Company: "",
    Current_Annual_Salary: 0,
    Current_Location: "",
    Preferred_Location: "",
    Notice_Period_ID: 0,
    Skills: "",
    Edu_Type_ID: 0,
    University_Name: "",
    FormDate: fromDate,
    ToDate: toDate,
    Subject: "",
    Grade_ID: 0,
    previousEmploymentData: previousEmp,
  });
  const [prevErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
    watch,
  } = useForm<ICandidate>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name == "Skills") {
      setSkills([value]);
    }

    if (name == "mobile") {
      setPhoneNumber(value);
      setValue("mobile", value);
    }
    setCandiForm({
      ...candiForm,
      [name]: value,
    });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCandiForm({
      ...candiForm,
      [name]: value,
    });
  };
  const handlePrevChange = (id_previous: number, field: string, value: any) => {
    setPrevDesForm((prev) =>
      prev.map((item) =>
        item.id_previous === id_previous
          ? { ...item, [field]: value }
          : item
      )
    );
  };
  
  const handleEdit = (id_previous: number) => {
    setPrevIndex(id_previous);
    if (!prevDes) {
      setPrevDes(!prevDes);
    }
  
    const selectedPrev = candiForm.previousEmploymentData.find((ele) => ele.id_previous === id_previous);
    setPrevDesForm([
      {
        id_previous: selectedPrev?.id_previous || 0,
        previous_designation: selectedPrev?.previous_designation || "",
        previous_company: selectedPrev?.previous_company || "",
        from_month: selectedPrev?.from_month || 0,
        from_year: selectedPrev?.from_year || 0,
        to_month: selectedPrev?.to_month || 0,
        to_year: selectedPrev?.to_year || 0,
      },
    ]);
    setPreviousEmp(candiForm.previousEmploymentData);
  };
  
  const handleDelete = (id_previous: number) => {
    const updatedForm = candiForm.previousEmploymentData.filter(
      (prev) => prev.id_previous !== id_previous
    );
    setCandiForm((prev) => ({
      ...prev,
      previousEmploymentData: updatedForm,
    }));
    setPrevIndex(0);
  };
  
  const submitPrevious = (id_previous: number) => {
    if (id_previous === 0) {
      // Find the next available id_previous (max id_previous + 1)
      const nextId = candiForm.previousEmploymentData.length > 0
        ? Math.max(...candiForm.previousEmploymentData.map((prev) => prev.id_previous!)) + 1
        : 1; // If no previous records, start with 1
  
      // Add new previous employment with the correct id_previous
      setCandiForm((prev) => ({
        ...prev,
        previousEmploymentData: [
          ...prev.previousEmploymentData,
          {
            ...prevDesForm[0],
            id_previous: nextId, // Assign the new id_previous
          },
        ],
      }));
    } else {
      // Update existing previous employment
      setCandiForm((prev) => ({
        ...prev,
        previousEmploymentData: prev.previousEmploymentData.map((prevEmployment) =>
          prevEmployment.id_previous === id_previous
            ? { ...prevEmployment, ...prevDesForm[0] }
            : prevEmployment
        ),
      }));
    }
  
    // Reset form state after submit
    setPrevDesForm([{
      id_previous: 0,
      previous_designation: "",
      previous_company: "",
      from_month: 0,
      from_year: 0,
      to_month: 0,
      to_year: 0,
    }]);
    setPrevDes(false);
  };
  
  
  // const validatePreviousForm = (index: number) => {
  //   const newErrors: Record<string, string> = {};
  //   const form = prevDesForm[index];
  
  //   // Validate each field
  //   if (!form.previous_designation) {
  //     newErrors[`previous_designation_${index}`] = "Previous Designation is required.";
  //   }
  //   if (!form.previous_company) {
  //     newErrors[`previous_company_${index}`] = "Previous Company is required.";
  //   }
  //   if (!form.from_year || !form.from_month) {
  //     newErrors[`from_date_${index}`] = "From date is required.";
  //   }
  //   if (form.from_year! > form.to_year!) {
  //     newErrors[`date_range_${index}`] = "From year cannot be greater than To year.";
  //   }
  
  //   setPrevErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
  
  //   // If no errors, return true, else false
  //   return Object.keys(newErrors).length === 0;
  // };


  
  
  
  useEffect(() => {
    console.log(previousEmp);
  }, [candiForm , previousEmp]);

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "isPresent") {
      setCandiForm((prevState) => ({
        ...prevState,
        Working_To_Year: checked ? prevState.Working_To_Year : "",
      }));
    }
    setCandiForm({
      ...candiForm,
      [name]: checked,
    });
  };
  const submit = async (data: ICandidate) => {
    try {
      data.userTypeId = 1;
      console.log(candiForm);
      const updatedPrev: IPreviousDesignation[] = prevDesForm.map(item => {
        const { id_previous, ...rest } = item;
        return rest;
      });
      setCandiForm({
        ...candiForm,
        previousEmploymentData : updatedPrev
      })
      const response = await axiosInst.post("api/APIUsers/Register", {
        ...candiForm,
        previousEmploymentData : updatedPrev
      });
      if (response) setIsSuccess(!success);
      // // router.push("/home");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.log(error);
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    if (file.size === 0) {
      toast.error("The uploaded file is empty. Please select a valid PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!(arrayBuffer instanceof ArrayBuffer)) {
        toast.error("Failed to read the file.");
        return;
      }

      // Prepare `CV_Attach` object
      const base64String = arrayBufferToBase64(arrayBuffer);

      // Prepare `CV_Attach` object
      const cvAttach: ICVAttach = {
        name: file.name,
        size: file.size.toString(),
        type: file.type,
        LastModifiedDate: file.lastModified?.toString() || "",
        FileAsBase64: base64String,
      };

      // Update `candiForm` with `CV_Attach`
      setCandiForm((prevForm) => ({
        ...prevForm,
        CV_Attach: cvAttach,
      }));

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(arrayBuffer);
      setExtractedText(extractedText);
      extractSkillsFromCV(extractedText);

      // Update selected file name for UI display
      setSelectedFileName(file.name);
    };

    reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
  };

  // Convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer);
    const binaryString = Array.from(uint8Array, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    return window.btoa(binaryString);
  };

  // Extract text from PDF using pdf.js
  const extractTextFromPDF = async (
    arrayBuffer: ArrayBuffer
  ): Promise<string> => {
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let extractedText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      extractedText += content.items.map((item: any) => item.str).join(" ");
    }
    return extractedText;
  };

  const extractSkillsFromCV = (text: string) => {
    const skillsSectionText = findSkillsSection(text);
    if (skillsSectionText) {
      const skills = extractSkillsFromSection(skillsSectionText);
      extractSkills(skills);
    } else {
      console.log("No skills section found in the document.");
    }
  };

  const findSkillsSection = (text: string): string | null => {
    const keywords = [
      "skills",
      "key skills",
      "technical skills",
      "expertise",
      "technologies",
    ];
    const lowerCaseText = text.toLowerCase();

    for (let keyword of keywords) {
      const startIndex = lowerCaseText.indexOf(keyword);
      if (startIndex !== -1) {
        const sectionStart = lowerCaseText.slice(startIndex);
        const sectionEndIndex = sectionStart.search(/\n/);
        const sectionText = sectionStart.slice(
          0,
          sectionEndIndex !== -1 ? sectionEndIndex : undefined
        );
        return sectionText.trim();
      }
    }

    return null;
  };

  const extractSkillsFromSection = (sectionText: string): string[] => {
    const skills = sectionText.split(/[\n,;]+/).map((skill) => skill.trim());
    return skills.filter((skill) => skill.length > 0);
  };

  const extractSkills = (skills: string[]) => {
    const predefinedSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "Java",
      "SQL",
      "HTML",
      "CSS",
      "Git",
      "C++",
      "Docker",
      "Kubernetes",
      "Machine Learning",
      "AWS",
      "Azure",
      "Data Analysis",
      "Testing",
      "Scrum",
    ];

    const foundSkills = predefinedSkills.filter((predefinedSkill) =>
      new RegExp(`\\b${predefinedSkill.replace("+", "\\+")}\\b`, "i").test(
        skills.join(", ")
      )
    );
    const dynamicSkills = extractDynamicSkills(skills.join(" "));
    const allSkills = Array.from(new Set([...foundSkills, ...dynamicSkills]));
    setSkills(allSkills);
  };
  const extractDynamicSkills = (text: string): string[] => {
    const potentialSkills = [
      "Docker",
      "Machine Learning",
      "AI",
      "Big Data",
      "Data Analysis",
      "Cloud",
      "DevOps",
      "Agile",
      "CI/CD",
      "Automation",
      "Business Intelligence",
      "React Native",
      "GraphQL",
      "REST APIs",
      "TensorFlow",
      "Kubernetes",
      "Deep Learning",
      "Data Science",
      "Cybersecurity",
      "Blockchain",
      "Salesforce",
      "C++",
    ];

    return potentialSkills.filter(
      (skill) =>
        new RegExp(`\\b${skill.replace("+", "\\+")}\\b`, "i").test(text) // Correctly escape `+` in C++
    );
  };

  // const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
  //   setPhoneNumber(e.target.value);
  // };

  const goToNext = async (e?: ChangeEvent<HTMLFormElement>, tabs?: string) => {
    e?.preventDefault(); // Properly call the method
    const isValid = await trigger();

    if (isValid) {
      // Store current tab data
      setCandiForm((prev) => ({
        ...prev,
        [tab]: getValues(),
      }));

      // Move to the next tab
      setTab(tabs!);
    } else {
      toast.error("Fix errors before proceeding.");
    }
  };

  // const test = (data: ICandidate) => {
  //   console.log("Form submitted successfully:", data);
  // };

  // const handleInvalid = () => {
  //   console.log("Validation errors:", errors);
  // };
  const getEduTypes = async () => {
    const res = await axiosInst.get(`/api/EducationType/GetEducationTypes`);
    if (res) {
      setEduTypes(res.data);
    }
  };
  const getNotifyPeriod = async () => {
    const res = await axiosInst.get(`/api/NoticePeriod/GetNoticePeriod`);
    if (res) {
      setNotifyPeriod(res.data);
    }
  };
  const getCountries = async () => {
    const res = await axiosInst.get(`/api/Country/GetAllCountries`);
    if (res) {
      setCountries(res.data);
    }
  };
  const getGrades = async () => {
    const res = await axiosInst.get(`/api/Grad/GetAllGrades`);
    if (res) {
      setGrades(res.data);
    }
  };
  useEffect(() => {
    getEduTypes();
    getNotifyPeriod();
    getCountries();
    getGrades();
  }, [skills]);
  // const addPrevDes = () => {
  //   setPrevDes(!prevDes);
  // };
  return (
    <>
      {success && (
        <SuccessMessage visibled={success} userName={candiForm.full_name} />
      )}
      <div className="grid grid-cols-12 overflow-hidden">
        <div className="lg:col-span-6 col-span-12 lg:min-h-screen h-full bg-sky-700">
          <div className="flex justify-center p-4">
            <img src="../../logo.png" alt="" />
          </div>
          {tab == "personal" ? null : (
            <div className="lg:flex hidden flex-wrap justify-center gap-4 px-4">
              <div className="flex">
                <div className="bg-white rounded-xl py-4 px-6 flex flex-col items-center w-60 h-40 hover:scale-105 transition-all transform duration-500">
                  <span className="flex w-full relative ">
                    <div className="bg-sky-700 w-8 h-8 text-white text-sm flex justify-center items-center rounded-full">
                      <p>1</p>
                    </div>
                  </span>
                  <i className="fa-regular fa-user mb-2 text-4xl text-sky-700"></i>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Create your FREE account
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="bg-white rounded-xl py-4 px-6 flex flex-col items-center w-60 h-40 hover:scale-105 transition-all transform duration-500">
                  <div className="flex w-full relative right-0">
                    <div className="bg-sky-700 w-8 h-8 text-white text-sm flex justify-center items-center rounded-full ">
                      <p>2</p>
                    </div>
                  </div>
                  <i className="fas fa-magnifying-glass mb-2 text-4xl text-sky-700"></i>
                  <p className="text-center text-xs text-gray-500 mt-4 w-40">
                    Search jobs
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="bg-white rounded-xl py-4 px-6 flex flex-col items-center w-60 h-40 hover:scale-105 transition-all transform duration-500">
                  <div className="flex w-full relative">
                    <div className="bg-sky-700 w-8 h-8 text-white text-sm flex justify-center items-center rounded-full">
                      <p>3</p>
                    </div>
                  </div>
                  <i className="far fa-bell mb-2 text-4xl text-sky-700"></i>
                  <p className="text-center text-xs text-gray-500 mt-4 w-40">
                    Get Job Alerts
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="bg-white rounded-xl py-4 px-6 flex flex-col items-center w-60 h-40 hover:scale-105 transition-all transform duration-500">
                  <div className="flex w-full relative right-0 ">
                    <div className="bg-sky-700 w-8 h-8 text-white text-sm flex justify-center items-center rounded-full">
                      <p>4</p>
                    </div>
                  </div>
                  <i className="fas fa-people-group mb-2 text-4xl text-sky-700"></i>

                  <p className="text-center text-[10px] text-gray-500 mt-4 w-40">
                    Our recruitment specialists are looking for you | Sign up
                    now
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-6 col-span-12 bg-[#f9f9f9]">
          <div className="lg:px-4">
            <div className="flex justify-end items-center mt-6 lg:mx-3">
              <p className="text-base font-bold text-[#575555] pr-1">
                Already have an Account ?
              </p>
              <div className="flex items-center pr-1">
                <Link to={'/login'} className="text-base text-sky-700 font-bold underline decoration-solid">Sign in</Link>
                

                
                <p className="text-base text-[#575555] font-bold px-1">or</p>
                <p className="text-base text-sky-700 font-bold underline decoration-solid">
                  Search Jobs
                </p>
              </div>
            </div>
            <div className="py-2">
              <p className="text-2xl font-bold lg:text-start text-center">
                {tab == "personal"
                  ? "Want Recruiters to Contact You?"
                  : "Candidate Login - Find your dream job"}
              </p>
            </div>

            <div className="">
              <p className="text-sky-700 font-bold text-sm lg:text-start text-center">
                {tab == "personal" ? "Candidate 2 Minutes Sign up" : ""}
              </p>
            </div>

            <div className="flex flex-col items-center lg:px-28 px-16 mt-3">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex justify-center items-center rounded-full ${
                      tab == "personal" ? "bg-sky-700" : "bg-sky-700"
                    } text-white font-bold`}
                  >
                    {tab == "personal" ? "✓" : "✓"}
                  </div>
                </div>
                <div className="flex-grow h-0.5 bg-sky-500"></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex justify-center items-center rounded-full ${
                      tab == "employment" || tab == "education"
                        ? "bg-sky-700 text-white"
                        : "bg-gray-300 text-white"
                    }   font-bold`}
                  >
                    {tab == "employment" || tab == "education" ? "✓" : "2"}
                  </div>
                </div>
                <div
                  className={`flex-grow h-0.5 ${
                    tab == "employment" || tab == "education"
                      ? "bg-sky-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex justify-center items-center rounded-full ${
                      tab == "education"
                        ? "bg-sky-700 text-white"
                        : "bg-gray-300 text-white"
                    }  font-bold`}
                  >
                    {tab == "education" ? "✓" : "3"}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mx-12 w-full mt-2">
                <div className="relative right-3 text-sm text-gray-500 text-center pr-6">
                  Personal
                </div>
                <div className="relative right-1 text-sm text-gray-500 text-center">
                  Employment
                </div>
                <div className="relative left-5 text-sm text-gray-500">
                  Education
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit(submit)}>
                {tab == "personal" ? (
                  <div className="animate__animated animate__fadeIn">
                    <div className="mt-3 animate__animated animate__fadeIn">
                      <File
                        id="file-upload"
                        label="Upload CV"
                        buttonName="Choose file"
                        buttonNameClass=" bg-[#718096] max-w-[130px] text-center text-sm rounded text-white p-2 border w-28 text-xs"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        selectedFileName={selectedFileName}
                        onChange={handleFileChange}
                      />
                    </div>
                    <div>
                      <Input
                        label="Full Name"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        type="text"
                        className={` w-full px-3 text-black focus:outline-none focus:ring-1 
                        ${
                          errors.full_name
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                        placeholderType="Full Name"
                        {...register("full_name", {
                          required: "Firstname is required",
                          // pattern: {
                          //   value: /^[a-zA-Z\u0600-\u06FF]+$/,
                          //   message:
                          //     "Firstname can only contain letters (spaces not allowed!)",
                          // },
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 letters!",
                          },
                          onChange: (e) => {
                            handleChange(e);
                            setValue("full_name", e.target.value);
                          },
                        })}
                        errorMessage={
                          errors.full_name && errors.full_name?.message
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Email"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        type="email"
                        className={` w-full px-3 text-black focus:outline-none focus:ring-1 
                        ${
                          errors.account_email
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                        placeholderType="Write your email here"
                        {...register("account_email", {
                          required: "Email is required",
                          onChange: (e) => {
                            handleChange(e);
                            setValue("account_email", e.target.value);
                          },
                        })}
                        errorMessage={
                          errors.account_email && errors.account_email?.message
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Password"
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        placeholderType="Create Password"
                        type="password"
                        {...register("account_password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                          pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, // At least one letter and one number
                            message:
                              "Password must contain both letters and numbers",
                          },
                          onChange: (e) => {
                            handleChange(e);
                            setValue("account_password", e.target.value);
                          },
                        })}
                        className={`bg-white border  w-full px-3 text-black focus:outline-none focus:ring-1 ${
                          errors.account_password
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 rounded shadow-inner border border-gray-300 py-1`}
                        errorMessage={errors.account_password?.message}
                      />
                    </div>
                    <div className="mt-2">
                      <Select
                        label="Country"
                        labelClassname="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        forSelect="Select Country"
                        className={`bg-white py-1.5  w-full px-3 text-black focus:outline-none focus:ring-1 
                          focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.3)]]
                        border rounded shadow-inner border border-gray-300`}
                        oneValue={
                          <>
                            {countries.map((country, index) => (
                              <option key={index} value={country.country_id}>
                                {country.country_en_name}
                              </option>
                            ))}
                          </>
                        }
                        {...register("country_id", {
                          onChange: (e) => {
                            handleSelectChange(e);
                            setValue("country_id", e.target.value);
                          },
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-6 mt-4">
                      <div className="col-span-3 pr-5">
                        <Select
                          label="Experience years"
                          labelClassname="font-bold text-sm lg:pl-0 pl-2 mb-1"
                          forSelect="Year"
                          className={`bg-white py-1.5  w-full px-3 text-black focus:outline-none focus:ring-1 
      focus:focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]]
    border rounded shadow-inner border border-gray-300`}
                          oneValue={
                            <>
                              {years.map((year: any, index: number) => (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              ))}
                            </>
                          }
                          {...register("Experience_Year", {
                            onChange: (e) => {
                              handleSelectChange(e);
                              setValue("Experience_Year", e.target.value);
                            },
                          })}
                        />
                      </div>
                      <div className="col-span-3">
                        <Select
                          label="In Months"
                          labelClassname="font-bold mb-1 text-sm lg:pl-0 pl-2 mb-1"
                          forSelect="Months"
                          className={`bg-white py-1.5  w-full px-3 text-black focus:outline-none focus:ring-1 
                            focus:focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]]
                          border rounded shadow-inner border border-gray-300`}
                          oneValue={
                            <>
                              {months.map((month: any, index: number) => (
                                <option key={index} value={month}>
                                  {month}
                                </option>
                              ))}
                            </>
                          }
                          {...register("Experience_Month", {
                            onChange: (e) => {
                              handleSelectChange(e);
                              setValue("Experience_Month", e.target.value);
                            },
                          })}
                        />
                      </div>
                    </div>
                    <div className=" mt-2">
                      <Input
                        label="Contact Number"
                        value={phoneNumber}
                        labelClass="font-bold mb-1 text-sm lg:pl-0 pl-2"
                        placeholderType="Write your mobile number here"
                        type="text" // Changed from "number" to "text" for better compatibility
                        className={`w-full px-3 text-black border py-1 rounded focus:outline-none focus:ring-1 
                        ${
                          errors.mobile
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 shadow-inner border border-gray-300`}
                        {...register("mobile", {
                          required: "Mobile number is required", // Always required
                          minLength: {
                            value: 4, // Minimum length of 4 characters
                            message: "Mobile number is required",
                          },
                          pattern: {
                            value: /^\+?\d+$/,
                            message: "Mobile number must be numbers only",
                          },
                          onChange: (e) => {
                            handleChange(e);
                            setValue("mobile", e.target.value); // Update react-hook-form state
                          },
                        })}
                        errorMessage={errors.mobile?.message}
                      />
                    </div>
                    <div className="mt-4 lg:px-0 px-3">
                      <p className="font-bold text-sm mb-1 lg:pl-0 pl-2">
                        Your full CV auto copied in box below
                      </p>
                      <textarea
                        value={extractedText}
                        rows={10}
                        cols={50}
                        readOnly
                        placeholder="Please also copy, paste your CV or if you are using mobile to register just type your name here"
                        className={`bg-white py-0.5 w-full px-3 text-black focus:outline-none focus:ring-1 
      focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.3)]]
  focus:ring-opacity-75 border rounded shadow-inner border border-gray-300`}
                      />
                    </div>
                    <div className="mt-4 lg:px-0 px-3">
                      <p className="font-bold text-sm mb-1">
                        Preferred Job Type (Please select at least one option)
                      </p>
                      <div className="bg-white flex justify-center w-full items-center">
                        <div className=" p-5">
                          <CheckBoxInput
                            label="Permanent"
                            labelClassName="text-sm lg:pr-40 pr-20  mx-2 w-full "
                            {...register("Is_Permentant", {
                              validate: (value) => {
                                return value || getValues("Is_Contract");
                              },
                            })}
                            checked={watch("Is_Permentant")}
                            onChange={(e) => {
                              handleCheckChange(e);
                              setValue("Is_Permentant", e.target.checked);
                              trigger("Is_Contract");
                            }}
                          />

                          <CheckBoxInput
                            label="Contract"
                            labelClassName="text-sm lg:pr-44 pr-24 mt-1 mx-2 w-full"
                            {...register("Is_Contract", {
                              validate: (value) => {
                                return value || getValues("Is_Permentant");
                              },
                            })}
                            checked={watch("Is_Contract")} // Use `watch` to track real-time value updates
                            onChange={(e) => {
                              handleCheckChange(e);
                              setValue("Is_Contract", e.target.checked); // Update the form value
                              trigger("Is_Permentant"); // Trigger validation for the other checkbox
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        {(errors.Is_Contract || errors.Is_Permentant) &&
                          !getValues("Is_Contract") &&
                          !getValues("Is_Permentant") && (
                            <p className="text-red-500 text-sm lg:pl-0 pl-2">
                              Please select at least one option
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Input
                        placeholderType="CAPTCHA - Enter the below Code"
                        className="bg-white py-0.5 w-full px-3 text-black py-1 shadow-inner border border-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border rounded"
                      />
                    </div>

                    <div className="mt-4 flex justify-center">
                      <div className="flex flex-col">
                        <p className="bg-lime-700 w-full px-4 rounded text-center text-white">
                          7356
                        </p>
                        {/* <div className="flex mt-2">
                        <CheckBoxInput />
                        <p className="text-xs pl-3">
                          I agree with terms and conds.
                        </p>
                      </div> */}

                        <Button
                          title="Save and Next"
                          onClick={(e) => goToNext(e, "employment")}
                          className="mt-3 mb-4"
                          titleClassname="bg-sky-700 text-xs text-white p-2 px-4 font-bold rounded"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {tab == "employment" ? (
                  <div className="animate__animated animate__fadeInRight">
                    <p className="text-sky-700 font-bold py-4 text-sm lg:text-start text-center">
                      Employment info (you are nearly there to complete
                      registration)
                    </p>
                    <div>
                      <Input
                        label="Current Designation"
                        labelClass="text-sm font-bold mb-2"
                        placeholderType="Current Destination"
                        className=' w-full px-3 text-black rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2 "'
                        {...register("Current_Designation", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Current_Designation", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Current_Designation"
                      />
                    </div>
                    <div>
                      <Input
                        placeholderType="Current Company"
                        label="Current Company"
                        labelClass="text-sm font-bold mb-2"
                        className=' w-full px-3 text-black rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2 "'
                        {...register("Current_Company", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Current_Company", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Current_Company"
                      />
                    </div>
                    <div>
                      <Input
                        label="Current Annual Salary"
                        labelClass="text-sm font-bold mb-2"
                        placeholderType="e.g 35000"
                        className=' w-52 px-3 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2 "'
                        {...register("Current_Annual_Salary", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Current_Annual_Salary", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Current_Annual_Salary"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-bold mb-2 lg:px-0 px-3">
                        Working Since
                      </p>
                      <div className="flex lg:gap-2 w-full">
                        <div className="w-full">
                          <Select
                            forSelect="Years"
                            className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border rounded"
                            oneValue={
                              <>
                                {workYears.map((year, index) => (
                                  <option key={index} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </>
                            }
                            {...register("Working_From_Year", {
                              onChange: (e) => {
                                handleSelectChange(e);
                                setValue("Working_From_Year", e.target.value);
                                trigger("Working_From_Year");
                              },
                            })}
                          />
                        </div>
                        <div className="w-full">
                          <Select
                            forSelect="Months"
                            className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border rounded"
                            oneValue={
                              <>
                                {workMonth.map((month, index) => (
                                  <option key={index} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </>
                            }
                            {...register("Working_From_Month", {
                              onChange: (e) => {
                                handleSelectChange(e);
                                setValue("Working_From_Month", e.target.value); // Set the checked value (boolean)
                              },
                            })}
                          />
                        </div>
                        <div className="w-full">
                          <Select
                            disabled={toYearDisabled}
                            forSelect="To"
                            className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border rounded"
                            oneValue={
                              <>
                                {workYears.map((year, index) => (
                                  <option key={index} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </>
                            }
                            {...register("Working_To_Year", {
                              validate: (value) => {
                                const fromYear = getValues("Working_From_Year");
                                if (fromYear && parseInt(value!) < fromYear) {
                                  return "To year must be equal to or greater than from year";
                                }
                                return true;
                              },
                              onChange: (e) => {
                                handleSelectChange(e);
                                setValue("Working_To_Year", e.target.value);
                                trigger("Working_To_Year");
                              },
                            })}
                          />
                        </div>
                        <div className="w-full mt-2 items-center">
                          <CheckBoxInput
                            label2="To Present"
                            labelClassName="text-sm pl-1"
                            className="flex items-center mt-1 "
                            checked={watch("isPresent")}
                            name="isPresent"
                            onChange={(e) => {
                              handleCheckChange(e);
                              setValue("isPresent", e.target.checked);
                              setToYearDisabled(!toYearDisabled);
                              trigger("isPresent");
                            }}
                          />
                        </div>
                      </div>{" "}
                      <div>
                        <p className="text-red-500 text-sm">
                          {errors.Working_To_Year
                            ? errors.Working_To_Year.message
                            : null}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Input
                        placeholderType="Current Location"
                        label="Current Location"
                        labelClass="text-sm font-bold mb-2"
                        className=' w-full px-3 text-black focus:outline-none shadow-inner border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2 "'
                        {...register("Current_Location", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Current_Location", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Current_Location"
                      />
                    </div>
                    <div>
                      <Input
                        placeholderType="Preferred Location"
                        label="Preferred Location"
                        labelClass="text-sm font-bold mb-2"
                        className=' w-full px-3 text-black focus:outline-none shadow-inner border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2 "'
                        {...register("Preferred_Location", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Preferred_Location", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Preferred_Location"
                      />
                    </div>
                    <div className="mt-4">
                      <Select
                        label="Duration of Notice Period"
                        // labelClassname="text-sm font-bold mb-5"
                        forSelect="Select the notice period"
                        className="bg-white w-full px-3 py-1 text-black focus:outline-none shadow-inner border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border rounded"
                        oneValue={
                          <>
                            {notifyPeriod.map((notify, index) => (
                              <option key={index} value={notify.id}>
                                {notify.NoticePeriod}
                              </option>
                            ))}
                          </>
                        }
                        {...register("Notice_Period_ID", {
                          onChange: (e) => {
                            handleSelectChange(e);
                            setValue("Notice_Period_ID", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Notice_Period_ID"
                      />
                    </div>
                    <div>
                      <Input
                        placeholderType="Enter Your Expertise/Specialisation"
                        label="Skills"
                        labelClass="text-sm font-bold mb-1"
                        className="w-full px-3 text-black focus:outline-none shadow-inner border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2"
                        type="text"
                        value={skills.join(", ")}
                        {...register("Skills", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Skills", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Skills"
                      />
                    </div>


              
                 
                    {/* add new Designation */}
                    {prevDesForm.map((form) => (
      <div key={form.id_previous}>
        {prevDes && (
          <>
            {/* Previous Designation */}
            <p className="mt-8 lg:px-0 px-4 font-bold">Add Previous Designation</p>
            <div>
              <Input
                label="Previous Designation"
                labelClass="text-sm font-bold mb-1"
                placeholderType="Current Designation"
                className="w-full px-3 text-black rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2"
                value={form.previous_designation || ""}
                onChange={(e) => handlePrevChange(form.id_previous!, "previous_designation", e.target.value)}
              />
              <p className="text-red-500 text-sm">
                {prevErrors[`previous_designation_${form.id_previous}`]}
              </p>
            </div>

            {/* Previous Company */}
            <div>
              <Input
                label="Previous Company"
                labelClass="text-sm font-bold mb-2"
                placeholderType="Previous Company"
                className="w-full px-3 text-black rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50 border p-2"
                value={form.previous_company || ""}
                onChange={(e) => handlePrevChange(form.id_previous!, "previous_company", e.target.value)}
              />
              <p className="text-red-500 text-sm">
                {prevErrors[`previous_company_${form.id_previous}`]}
              </p>
            </div>

            {/* From Date */}
            <div className="mt-4">
              <p className="text-sm font-bold mb-2 lg:px-0 px-3">From Date</p>
              <div className="flex lg:gap-2 w-full">
                <div className="w-full">
                  <Select
                    forSelect="Years"
                    className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50"
                    value={form.from_year || ""}
                    onChange={(e) => handlePrevChange(form.id_previous!, "from_year", e.target.value)}
                    oneValue={
                      <>
                        {workYears.map((year, idx) => (
                          <option key={idx} value={year}>
                            {year}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>
                <div className="w-full">
                  <Select
                    forSelect="Months"
                    className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50"
                    value={form.from_month || ""}
                    onChange={(e) => handlePrevChange(form.id_previous!, "from_month", e.target.value)}
                    oneValue={
                      <>
                        {workMonth.map((month, idx) => (
                          <option key={idx} value={month}>
                            {month}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>
              </div>
              <p className="text-red-500 text-sm">{prevErrors[`from_date_${form.id_previous}`]}</p>
            </div>

            {/* To Date */}
            <div className="mt-4">
              <p className="text-sm font-bold mb-2 lg:px-0 px-3">To Date</p>
              <div className="flex lg:gap-2 w-full">
                <div className="w-full">
                  <Select
                    forSelect="Years"
                    className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50"
                    value={form.to_year || ""}
                    onChange={(e) => handlePrevChange(form.id_previous!, "to_year", e.target.value)}
                    oneValue={
                      <>
                        {workYears.map((year, idx) => (
                          <option key={idx} value={year}>
                            {year}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>
                <div className="w-full">
                  <Select
                    forSelect="Months"
                    className="bg-white w-full px-1 py-2 text-black shadow-inner border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)] focus:ring-opacity-50"
                    value={form.to_month || ""}
                    onChange={(e) => handlePrevChange(form.id_previous!, "to_month", e.target.value)}
                    oneValue={
                      <>
                        {workMonth.map((month, idx) => (
                          <option key={idx} value={month}>
                            {month}
                          </option>
                        ))}
                      </>
                    }
                  />
                </div>
              </div>
              <p className="text-red-500 text-sm">{prevErrors[`date_range_${form.id_previous}`]}</p>
            </div>

            {/* Save Button */}
           <div className="flex lg:justify-start justify-center">
           <Button
              title={prevIndex > 0 ? "Update" : "Save"}
              onClick={() => submitPrevious(form.id_previous!)}
              className="mt-3 mb-4 bg-sky-700 text-md font-bold text-white p-2 hover:bg-sky-600 px-4 rounded"
            />
           </div>
          </>
        )}
      </div>
    ))}
    
    {candiForm.previousEmploymentData.length > 0 ? (
                      <div className="lg:px-0 px-3">
                        <p className="mt-4 mb-1 font-bold mb-4">
                          Added Designations
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {candiForm.previousEmploymentData.map(
                            (prev, index) => (
                              <div
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col"
                                key={index}
                              >
                                <div className="flex justify-end mt-1">
                                  <Button
                                    buttonContent={
                                      <>
                                        <Pencil size={15} />
                                      </>
                                    }
                                    onClick={() => handleEdit(prev.id_previous!)}
                                    className="text-sky-700 rounded-md text-sm font-medium hover:text-sky-600"
                                  />
                                  <Button
                                    buttonContent={
                                      <>
                                        <Trash2 size={15} />
                                      </>
                                    }
                                    onClick={() => handleDelete(prev.id_previous!)}
                                    className="pl-3 text-red-500 rounded-md text-sm font-medium hover:text-red-600"
                                  />
                                </div>
                                {/* Designation */}
                                <div className="flex items-center space-x-3 mb-1">
                                  <Briefcase className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                      {prev.previous_designation}
                                    </h3>
                                  </div>
                                </div>

                                {/* Company */}
                                <div className="flex items-center space-x-3 mb-1">
                                  <Building2
                                    size={20}
                                    className="h-5 w-5 text-gray-500"
                                  />
                                  <div>
                                    <h4 className="text-gray-700">
                                      {prev.previous_company}
                                    </h4>
                                  </div>
                                </div>

                                {/* Date Range */}
                                <div className="flex items-center space-x-3 mb-1">
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-5 w-5 text-gray-500" />
                                      <span className="text-sm text-gray-500 w-24 pl-2">
                                        From Date:
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {prev.from_month} {prev.from_year}
                                      </span>
                                    </div>
                                    <div className="flex items-center ">
                                      <Calendar className="h-5 w-5 text-gray-500" />
                                      <span className="text-sm text-gray-500 w-24 pl-2">
                                        To Date:
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {prev.to_month} {prev.to_year}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                      </div>) : null}
                      {prevDes ? null : <div className="flex lg:justify-start justify-center">
                          <Button
                            title="Add another previous employment"
                            onClick={()=>setPrevDes(!prevDes)}
                            className="mt-3 mb-4 bg-sky-700 text-md font-bold text-white p-2 hover:bg-sky-600 px-4 rounded"
                            iconClass={"fas fa-plus pr-1"}
                          />
                        </div>}
                        <div className="flex items-center justify-center gap-2 py-4">
                          <Button
                            title="Save and Next"
                            onClick={(e) => goToNext(e, "education")}
                            className="mt-3 mb-4"
                            titleClassname="bg-sky-700 text-xs text-white p-2 px-4 font-bold rounded"
                          />
                          <Button
                            title="Go back"
                            btnType="submit"
                            className="mt-3 mb-4"
                            onClick={() => setTab("personal")}
                            titleClassname="bg-gray-700 text-xs text-white p-2 font-bold rounded"
                          />
                        </div>
                   
                  </div>
                ) : null}
                {tab == "education" ? (
                  <div className="animate__animated animate__fadeInRight">
                    <p className="text-sky-700 text-sm font-semibold py-4 lg:px-0 px-2">
                      Enter your Educational info (final step to complete
                      registration)
                    </p>
                    <div className="mt-4">
                      
                      <Select
                        forSelect="Education Type"
                         label="Education Type"
                        labelClassname="font-bold text-sm px-1"
                        className={`bg-white w-full px-3 py-1 shadow-inner border border-gray-300 rounded text-black focus:outline-none focus:ring-1 ${
                          errors.Edu_Type_ID
                            ? "focus:ring-red-500 focus:shadow-[0_0_15px_5px_rgba(255,0,0,0.1)]"
                            : "focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]"
                        } focus:ring-opacity-50 border rounded`}
                        oneValue={
                          <>
                            {eduTypes.map((edu, index) => (
                              <option key={index} value={edu.id}>
                                {edu.En_Name}
                              </option>
                            ))}
                          </>
                        }
                        {...register("Edu_Type_ID", {
                          onChange: (e) => {
                            handleSelectChange(e);
                            setValue("Edu_Type_ID", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Input
                        className={` w-full px-3 text-black focus:outline-none focus:ring-1 
                          focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
                         focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                        placeholderType="School/College"
                        label="Name of university /College"
                        labelClass="font-bold text-sm mb-1"
                        {...register("University_Name", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("University_Name", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="University_Name"
                      />
                    </div>
                    <div className="lg:flex gap-4">
                      <div className="w-full">
                        <Input
                          placeholderType="Select a date"
                            label="From"
                          labelClass="font-bold mb-1 text-sm"
                          className="lg:w-[312px] w-[450px] px-3 text-black focus:outline-none focus:ring-1 
                          focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
                          focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 py-1 rounded"
                          type="date"
                          value={candiForm.FormDate?.toString().split("T")[0]}
                          {...register("FormDate", {
                            onChange: (e) => {
                              handleChange(e);
                              setValue("FormDate", e.target.value); // Set the checked value (boolean)
                            },
                          })}
                          name="FormDate"
                        />
                      </div>
                      <div className="w-full">
                        
                        <Input
                          value={candiForm.ToDate?.toString().split("T")[0]}
                          label="To"
                          labelClass="font-bold mb-1 text-sm"
                          placeholderType="Select a date"
                          className="lg:w-[312px] w-[450px] px-3 text-black focus:outline-none focus:ring-1 
                          focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
                          focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 py-1 rounded"
                          type="date"
                          {...register("ToDate", {
                            onChange: (e) => {
                              handleChange(e);
                              setValue("ToDate", e.target.value); // Set the checked value (boolean)
                            },
                          })}
                          name="ToDate"
                        />
                      </div>
                    </div>
                    {/* <div className="lg:flex gap-4">
                      <div className="w-full">
                        <p className="text-sm">From</p>
                        <ReactDatePicker
                          selected={fromDate}
                          onChange={(date: Date | null) => setFromDate(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Select a date"
                          className="lg:w-[312px] w-[450px] px-3 text-black focus:outline-none focus:ring-1 
        focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
        focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 py-1 rounded"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-sm">To</p>
                        <ReactDatePicker
                          selected={toDate}
                          onChange={(date: Date | null) => setToDate(date!)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Select a date"
                          className="lg:w-[312px] w-[450px] px-3 text-black focus:outline-none focus:ring-1 
        focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
        focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 py-1 rounded"
                        />
                      </div>
                    </div> */}

                    <div>
                      <Input
                        className={` w-full px-3 text-black focus:outline-none focus:ring-1 
                          focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]   
                         focus:ring-opacity-50 border py-1 shadow-inner border border-gray-300 rounded`}
                        placeholderType="Subject"
                        label="Subject"
                        labelClass="font-bold text-sm mb-1"
                        {...register("Subject", {
                          onChange: (e) => {
                            handleChange(e);
                            setValue("Subject", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Subject"
                      />
                    </div>
                    <div className="mt-4">
                      <Select
                        label="Grade"
                        labelClassname="font-bold text-sm mb-1 px-1"
                        className={`bg-white w-full px-3 py-1 shadow-inner border border-gray-300 rounded text-black focus:outline-none focus:ring-1
                             focus:ring-sky-500 focus:shadow-[0_0_15px_5px_rgba(3,105,161,0.2)]
                         focus:ring-opacity-50 border rounded`}
                        oneValue={
                          <>
                            {grades.map((grade, index) => (
                              <option key={index} value={grade.id}>
                                {grade.Grade_Name}
                              </option>
                            ))}
                          </>
                        }
                        {...register("Grade_ID", {
                          onChange: (e) => {
                            handleSelectChange(e);
                            setValue("Grade_ID", e.target.value); // Set the checked value (boolean)
                          },
                        })}
                        name="Grade_ID"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        title="Apply form"
                        btnType="submit"
                        className="mt-3 py-6"
                        titleClassname="bg-sky-700 text-xs text-white p-2 px-4 font-bold rounded"
                      />
                      <Button
                        title="Go back"
                        btnType="submit"
                        className="mt-3"
                        onClick={() => setTab("employment")}
                        titleClassname="bg-gray-700 text-xs text-white p-2 font-bold rounded"
                      />
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
