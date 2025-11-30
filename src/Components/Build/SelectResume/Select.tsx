import { ArrowLeft, ArrowRight, CloudUpload, Globe, PenLine, TriangleAlert } from "lucide-react";
import { BounceLoader } from "react-spinners";
import Button from "../../../Containers/Button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createWorker } from "tesseract.js";
import * as pdfjs from "pdfjs-dist";
import { PSM } from 'tesseract.js';
import { AppDispatch, RootState } from "../../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getSkillsAction } from "../../../Redux/Skills/skillsAction";
import { ICountry, IResume, ISkills } from "../../../Interfaces/interface";
import { axiosInst } from "../../../axios/axios";
import { useTranslation } from "react-i18next";
import { setResumeLangSlice } from "../../../Redux/Slices/resumeLang";
// import { setResumeLangSlice } from "../../../Redux/Slices/resumeLang";
pdfjs.GlobalWorkerOptions.workerPort = null;
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const SelectResume = () => {
  const [loading, setLoading] = useState(false);
  const [showChangeLangModal, setShowChangeLangModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  const lang = useSelector((state: RootState) => state.lang.lang);
  const refSkills = useSelector((state: RootState) => state.skills.skills);
  const isDark = useSelector((state: RootState) => state.isDark.isDark); // ✅ أضفت السطر هنا
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const {t} = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const getCountries = async () => {
    await axiosInst.get('/api/Common/GetAllCountries').then((res) => {
      setCountries(res.data.data);
    });
  };

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {}, [loading]);

  const getFilteredSkills = async (search: string = "") => {
    dispatch(getSkillsAction(search, token));
  };

  useEffect(() => {
    const rawTempId = Number(localStorage.getItem("tempId"));
    localStorage.setItem("tempId", JSON.stringify(rawTempId));
    getFilteredSkills();
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

 const extractName = (text: string): { full_name: string } => {
  const firstLine = text.split("\n").map(l => l.trim()).find(l => l.length > 0);
  if (!firstLine) return { full_name: "" };
  const nameWords = firstLine
    .split(/\s+/)
    .filter((w: string) => /^[A-Za-z]+$/.test(w)); 
  if (nameWords.length === 0) return { full_name: "" };
  return { full_name: nameWords.join(" ") };
};


  const extractLocation = (text: string, countries: ICountry[]): { city: {}; country: {} } => {
    let city = "";
    let country = "";
    const loweredText = text.toLowerCase();
    let foundCountryObj: ICountry | undefined = undefined;

    for (const countryObj of countries) {
      const enNameLower = countryObj.en_name?.toLowerCase();
      const arNameLower = countryObj.ar_name?.toLowerCase();

      if (enNameLower && loweredText.includes(enNameLower)) {
        foundCountryObj = countryObj;
        break;
      }
      if (arNameLower && loweredText.includes(arNameLower)) {
        foundCountryObj = countryObj;
        break;
      }
    }

    if (foundCountryObj) {
      country = foundCountryObj.en_name!;
      const lines = text.split("\n").map(line => line.trim());
      for (const line of lines) {
        const loweredLine = line.toLowerCase();
        if (
          loweredLine.includes(foundCountryObj.en_name!.toLowerCase()) ||
          loweredLine.includes(foundCountryObj.ar_name!.toLowerCase())
        ) {
          let cleanedLine = line
            .replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, "")
            .replace(/(\+?\d{1,3})?[\s\-.]?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/g, "")
            .replace(new RegExp(foundCountryObj.en_name!, "gi"), "")
            .replace(new RegExp(foundCountryObj.ar_name!, "gi"), "")
            .replace(/[,\-]/g, "")
            .trim();

          if (cleanedLine && cleanedLine.length <= 50 && !/\d/.test(cleanedLine)) {
            city = cleanedLine;
          }
          break;
        }
      }
    }
    return { city, country };
  };

  const extractSkills = (text: string, referenceSkills: ISkills[]): ISkills[] => {
    const loweredText = text.toLowerCase();
    const matchedSkills = referenceSkills
      .map(s => s.en_Name?.toLowerCase().trim())
      .filter(Boolean)
      .filter(skill => {
        const pattern = new RegExp(`\\b${skill?.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return pattern.test(loweredText);
      });
    return [...new Set(matchedSkills as ISkills[])];
  };

  const extractDate = (text: string): string => {
    const dobRegexes = [
      /(?:date of birth|dob|born on|birth)[^\w]{0,3}(\d{1,2}[-/ ]\d{1,2}[-/ ]\d{2,4})/i,
      /(?:date of birth|dob|born on|birth)[^\w]{0,3}(\d{4}[-/ ]\d{1,2}[-/ ]\d{1,2})/i,
      /(?:date of birth|dob|born on|birth)[^\w]{0,3}(\d{1,2} (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{2,4})/i,
    ];

    for (const regex of dobRegexes) {
      const match = text.match(regex);
      if (match && match[1]) {
        const dateStr = match[1].trim();
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          const yyyy = parsedDate.getFullYear();
          const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const dd = String(parsedDate.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
      }
    }
    return "";
  };

  const extractMarital = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (/married|متزوج/.test(lowerText)) return "Married";
    if (/single|أعزب/.test(lowerText)) return "Single";
    if (/divorced|مطلق/.test(lowerText)) return "Divorced";
    if (/widowed|أرمل/.test(lowerText)) return "Widowed";
    return "";
  };



  const extractSummary = (text: string): string => {
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => !!line && line.length > 1);

    const sectionKeywords = [
      "education", "experience", "projects", "skills", "languages",
      "contact", "certificates", "personal information", "achievements"
    ];

    const summaryKeywords = ["professional summary", "summary", "objective"];
    let summaryStart = -1;

    for (let i = 0; i < lines.length; i++) {
      if (summaryKeywords.some(keyword => lines[i].toLowerCase().includes(keyword))) {
        summaryStart = i;
        break;
      }
    }

    let summaryLines: string[] = [];

    if (summaryStart !== -1) {
      for (let i = summaryStart + 1; i < lines.length; i++) {
        const line = lines[i];
        if (sectionKeywords.some(k => line.toLowerCase().includes(k))) break;
        if (!/^(skills?|languages?|marital|dob|date of birth|single|married|phone|email|contact)/i.test(line)) {
          summaryLines.push(line);
        }
      }
    } else {
      for (let i = 0; i < lines.length && summaryLines.length < 5; i++) {
        const line = lines[i];
        if (sectionKeywords.some(k => line.toLowerCase().includes(k))) break;
        if (
          !/^(skills?|languages?|marital|dob|date of birth|single|married|phone|email|contact)/i.test(line) &&
          line.length >= 20 && line.length <= 300
        ) {
          summaryLines.push(line);
        }
      }
    }

    return summaryLines.join(" ").trim();
  };

  const parsedResume = (text: string, countries: ICountry[], refSkills: ISkills[]): IResume => {
    const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "";
    const phone = text.match(/(\+?\d{1,3})?[\s\-.]?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/)?.[0]?.replace(/\D/g, "") || "";
    const { full_name } = extractName(text);
    const { city, country } = extractLocation(text, countries);
    const birth_date = extractDate(text);
    const marital_status = extractMarital(text);
    const skills = extractSkills(text, refSkills);
    const summary = extractSummary(text);

    return {
      full_name,
      city,
      country,
      birth_date,
      marital_status,
      phone,
      email,
      summary,
      skills,
      work_History: [],
      education: [],
    };
  };

  const extractTextFromPDF = async (buffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjs.getDocument({
        data: buffer,
        standardFontDataUrl: undefined,
        cMapUrl: undefined,
        cMapPacked: false,
        verbosity: 0,
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true
      }).promise;

      let fullText = "";
      const totalPages = pdf.numPages;

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        try {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          let pageText = "";
          let lastY = null;
          for (const item of textContent.items) {
            if (item.hasOwnProperty('str')) {
              const textItem = item as any;
              if (lastY !== null && Math.abs(lastY - textItem.transform[5]) > 5) {
                pageText += "\n";
              }
              pageText += textItem.str;
              if (textItem.hasEOL) {
                pageText += "\n";
              } else if (textItem.str && !textItem.str.endsWith(" ")) {
                pageText += " ";
              }
              lastY = textItem.transform[5];
            }
          }
          pageText = pageText
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();

          if (pageText) {
            fullText += pageText + "\n";
          }
          page.cleanup();
        } catch (pageError) {
          console.warn(`Error processing page ${pageNumber}:`, pageError);
          continue;
        }
      }

      fullText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim();

      return fullText;
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const extractTextWithOCR = async (buffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjs.getDocument({
        data: buffer,
        verbosity: 0
      }).promise;

      let fullText = "";
      const totalPages = Math.min(pdf.numPages, 3);

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        try {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 2.5 });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          await page.render({
            canvasContext: ctx,
            viewport,
            background: 'white'
          }).promise;

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
          });

          if (blob) {
            const worker = await createWorker("eng+ara");
            await worker.setParameters({
              tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.-+() \n\t',
              tessedit_pageseg_mode: PSM.SINGLE_COLUMN
            });

            const { data: { text, confidence } } = await worker.recognize(blob);
            if (confidence > 60) {
              fullText += text + "\n";
            }
            await worker.terminate();
          }

          page.cleanup();
        } catch (pageError) {
          console.warn(`OCR error on page ${pageNumber}:`, pageError);
          continue;
        }
      }

      return fullText.trim();
    } catch (error) {
      console.error("OCR extraction error:", error);
      throw new Error("Failed to extract text using OCR");
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file only.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size should not exceed 10MB.");
      return;
    }

    if (file.size === 0) {
      toast.error("The uploaded file is empty.");
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bufferForOCR = arrayBuffer.slice(0);
      let extractedText = await extractTextFromPDF(arrayBuffer);

      if (!extractedText || extractedText.trim().length < 20) {
        console.warn("Switching to OCR...");
        toast.info("Using OCR...");
        extractedText = await extractTextWithOCR(bufferForOCR);
        console.log(extractedText);
      }

      if (!extractedText || extractedText.trim().length < 10) {
        toast.error("No readable content found in the document.");
        return;
      }

      const resume = parsedResume(extractedText, countries, refSkills);
      if (!resume.full_name && !resume.email) {
        toast.warning("Couldn't detect basic details (name/email). You may need to fill them manually.");
      }

      localStorage.setItem("resumeData", JSON.stringify(resume));
      toast.success("CV uploaded and processed successfully!");
      setLoading(false);
      navigate("/build-resume/fill-data");

    } catch (error) {
      const errMsg = (error as any)?.message || "";
      console.error("CV processing failed:", error);

      if (errMsg.includes("No readable text")) {
        toast.error("Could not read text from the PDF. Please ensure it's not password protected or corrupted.");
      } else if (errMsg.includes("OCR")) {
        toast.error("OCR processing failed. Please try with a clearer document.");
      } else {
        toast.error("Failed to process CV. Please try again or use a different file.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBuildResume = () => {
    setLoading(true);
    localStorage.setItem("resumeData", JSON.stringify({}));
    setTimeout(() => {
      setLoading(false);
      navigate("/build-resume/fill-data");
    }, 3000);
  };
  const languages = [
    { code: 'en', name: t('English'), flag: '🇬🇧' },
    { code: 'ar', name: t('Arabic'), flag: '🇸🇦' },
    // { code: 'es', name: t('French'), flag: '🇫🇷' },
    // { code: 'fr', name: t('Dutch'), flag: ' 🇩🇪' },
  ];
const chooseLang = (code : string)=>{
 setSelectedLanguage(code)
 setShowChangeLangModal(!showChangeLangModal)
 dispatch(setResumeLangSlice(code))
 localStorage.setItem('resumeLang', code)
}

  return (
    <div className={`grid grid-cols-12 min-h-screen lg:pt-0 scrollbar-hide overflow-hidden ${isDark ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-black"}`}>
      {showChangeLangModal && (
  <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30">
    <div className="bg-white w-[90%] lg:max-w-lg max-w-sm rounded-3xl shadow-xl p-6 animate__animated animate__fadeIn animate__faster">

      <h3 className="text-center text-lg text-gray-800 font-semibold leading-6 flex">
       <TriangleAlert size={50} className="text-orange-400"/> {t("Changing the language will reset your resume and delete all entered data. Do you want to proceed?")}
      </h3>

      <div className="mt-6 flex  gap-2">
        <button
          onClick={goBuildResume}
          className="w-full py-3 bg-red-600 text-white rounded-2xl text-base font-medium active:opacity-70"
        >
          {t("Confirm")}
        </button>

        <button
          onClick={() => setShowChangeLangModal(false)}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl text-base font-medium active:bg-gray-200"
        >
          {t("Cancel")}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Header Section with Sky Gradient */}
      <div className={`col-span-12 ${isDark ? "text-white" : "text-sky-700"} flex justify-center relative`}>
        <div className="relative z-10">
          <p className="text-center lg:text-4xl text-3xl font-bold pt-5 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            {t("What do you want to do?")}
          </p>
          <p className="lg:text-sm text-xs text-center pt-2 text-sky-600/80">
            {t("Upload or build your resume and see it live in your selected template")}
          </p>
        </div>
        
        {/* Decorative Sky Elements */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-sky-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Language Selection Section */}
      <div className="col-span-12 flex justify-center items-center py-2 px-2  animate__animated animate__fadeInDown">
        <div className={`rounded-2xl shadow-lg p-4 w-full max-w-lg transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-slate-800 to-blue-900 border border-sky-500/20" 
            : "bg-white/80 backdrop-blur-sm border-2 border-sky-100"
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-2 rounded-full">
              <Globe size={24} className="text-white" />
            </div>
            <p className={`font-bold text-sm bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent`}>
              {t("Select Resume Language")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={()=>chooseLang(language.code)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedLanguage === language.code
                    ? isDark
                      ? "bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg"
                      : "bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg"
                    : isDark
                    ? "bg-slate-700/50 hover:bg-slate-700"
                    : "bg-sky-50 hover:bg-sky-100"
                }`}
              >
                <span className="text-3xl mb-2">{language.flag}</span>
                <span className={`text-sm font-medium ${
                  selectedLanguage === language.code 
                    ? "text-white" 
                    : isDark ? "text-sky-200" : "text-sky-700"
                }`}>
                  {language.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Resume Card */}
      <div className="lg:col-span-6 col-span-12 lg:py-0 py-5 flex justify-center items-center lg:pt-0 pt-15 animate__animated animate__fadeInUp">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />

        <Button
          onClick={handleClick}
          btnContentClassname="p-0"
          buttonContent={
            <div className={`w-90 flex flex-col justify-center items-center text-center rounded-2xl shadow-lg lg:px-20 lg:py-15 py-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
              isDark 
                ? "bg-gradient-to-br from-slate-800 to-blue-900 border border-sky-500/20" 
                : "bg-white/80 backdrop-blur-sm border-2 border-sky-100"
            }`}>
              <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-4 rounded-full mb-5 shadow-lg">
                <CloudUpload size={40} strokeWidth={1.5} className="text-white" />
              </div>
              <p className={`font-bold text-2xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent`}>
                {t("uploadResume")}
              </p>
            </div>
          }
        />
      </div>

      {/* Build Resume Card */}
      <div className="lg:col-span-6 col-span-12 flex justify-center items-center animate__animated animate__fadeInUp">
        <Button
          onClick={goBuildResume}
          buttonContent={
            <div className={`w-90 flex flex-col justify-center items-center text-center rounded-2xl shadow-lg lg:px-20 lg:py-15 py-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
              isDark 
                ? "bg-gradient-to-br from-slate-800 to-blue-900 border border-sky-500/20" 
                : "bg-white/80 backdrop-blur-sm border-2 border-sky-100"
            }`}>
              <div className="bg-gradient-to-br from-blue-400 to-sky-500 p-4 rounded-full mb-5 shadow-lg">
                <PenLine size={40} strokeWidth={1.5} className="text-white" />
              </div>
              <p className={`font-bold text-2xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent`}>
                {t("buildFrom")}
              </p>
            </div>
          }
        />
      </div>

      {/* Back Button */}
      <div className="flex justify-start items-center font-bold">
        <Button
          onClick={() => navigate(-1)}
          buttonContent={
            <div className={`flex gap-1 lg:mx-30 ${isDark ? "text-white" : "text-sky-400"} p-3 rounded-full px-10 hover:bg-sky-100/50 transition-all duration-300`}>
              {lang === "en" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
              <p>{t("previous")}</p>
            </div>
          }
        />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/90 text-black z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <BounceLoader color="#0069a8" size={40} />
            <p className="text-sm">{t("Preparing your template....")}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SelectResume;
