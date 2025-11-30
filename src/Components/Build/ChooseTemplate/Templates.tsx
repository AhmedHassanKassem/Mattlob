import React, { FC, useEffect, useState } from 'react';
import { setFoundCv } from '../../../Redux/Slices/foundCv';
import { ICertification, ICourse, IEducation, IExperience, ILanguage, IResume, ISkills, IVolunteer, tempProps } from '../../../Interfaces/interface';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import SelectBar from '../../../Containers/SelectBar';
import { useTranslation } from 'react-i18next';

// Sample resume data used by all templates
export const sampleResume: tempProps = {
  color: '',
  image: {},
  resume: {
    full_name: 'FATIMA',
    city: {},
    country: {},
    village: {},
    province: {},
    phone: '+1 (555) 123-4567',
    marital_status: 'Single',
    military_status: 'Completed',
    email: 'fatima.hassan@email.com',
    summary: 'write some words about yourself , tell employers more',
    work_History: [
      {
        role: {},
        company: 'TechCorp Solutions',
        from_year: '2020',
        to_year: '2021',
        from_month: '',
        to_month: '',
        address_info: '',
        remote: false,
        employmentType: false,
        present: true,
        country: {},
        city: {},
        province: {},
        village: {},
        details: 'Led cross-functional team of 12 marketing professionals. Increased lead generation by 85% through targeted digital campaigns.'
      },
      {
        role: {},
        company: 'Digital Innovations Inc.',
        from_year: '2018',
        to_year: '2018',
        from_month: '',
        to_month: '',
        address_info: '',
        remote: false,
        employmentType: false,
        present: false,
        country: {},
        city: {},
        province: {},
        village: {},
        details: 'Developed content marketing strategy increasing organic traffic by 200%. Managed social media accounts with 50K+ followers.',
      },
    ],
    volunteers: [
      {
        role: 'Senior Marketing Manager',
        company: 'TechCorp Solutions',
        from_year: '2020',
        to_year: '2021',
        from_month: '',
        to_month: '',
        country: {},
        city: {},
        details: 'Led cross-functional team of 12 marketing professionals. Increased lead generation by 85% through targeted digital campaigns.'
      },

    ],
    skills: [{}],
    education: [
      {
        edu_type: true, edu_level: 'Columbia Business School', university: {}, specialty: {}, college: {}, institute: {}, country: {}, city: {}, from_year: '',
        to_year: ''
      },
      {
        edu_type: true, edu_level: 'New York University', university: {}, specialty: {}, college: {}, institute: {}, country: {}, city: {}, from_year: '',
        to_year: ''
      },
    ],

  }
};

const colorOptions = [
  { label: 'Slate', css: 'bg-gray-700', code: '#374151' },
  { label: 'Emerald', css: 'bg-green-600', code: '#16a34a' },
  { label: 'Blue', css: 'bg-blue-600', code: '#2563eb' },
  { label: 'Red', css: 'bg-red-600', code: '#dc2626' },
  { label: 'Purple', css: 'bg-purple-600', code: '#7c3aed' },
  { label: 'Indigo', css: 'bg-indigo-600', code: '#4338ca' },
  { label: 'Amber', css: 'bg-amber-500', code: '#f59e0b' },
  { label: 'Teal', css: 'bg-teal-600', code: '#14b8a6' },
  { label: 'Pink', css: 'bg-pink-600', code: '#db2777' },
  { label: 'Orange', css: 'bg-orange-600', code: '#ea580c' },
];

// Choose component:
const Templates: FC<any> = (props) => {
  const {
    withCol = false,
    withImg = false,
  } = props;
  const lang = useSelector((state: RootState) => state.resumeLang.resumeLang) || useSelector((state: RootState) => state.lang.lang);
  const { t } = useTranslation("cv");
  const dispatch: AppDispatch = useDispatch();
  const findCv = useSelector((state: RootState) => state.foundCv.localStorageCv);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const selectedTempId = selectedTemplate;
  const ref = React.useRef<HTMLDivElement>(null);

  const ExperienceList: React.FC<{ experience?: IExperience[], accentColor: string }> = ({ experience }) => (
    <div className="space-y-4">
      {(Array.isArray(experience) ? experience : []).map((item, i) => (
        <div key={i}>
          <h3 className="text-gray-800 font-bold">{lang === 'en' ? item.role.en_name : item.role.ar_name}</h3>

          {item.company && item.from_year && (
            <p className="text-sm ">
              {item.company} | {item.from_year} -
              {" " + item.to_year}
            </p>
          )}

          <p className="text-sm text-gray-700 mt-1 font-bold">
            {[item.address_info ? item.address_info : null,
            item.village ? (lang === "en" ? item.village.en_name : item.village.ar_name) : null,
            item.province ? (lang === "en" ? item.province.en_name : item.province.ar_name) : null,
            item.city ? (lang === "en" ? item.city.en_name : item.city.ar_name) : null,
            item.country ? (lang === "en" ? item.country.en_name : item.country.ar_name) : null,

            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="text-sm  text-black text-justify break-words whitespace-normal">{item.details}</p>
        </div>
      ))}
    </div>
  );

  const CourseList: React.FC<{ course?: ICourse[], accentColor: string }> = ({ course: course }) => (
    <div className="space-y-4">
      {(Array.isArray(course) ? course : []).map((item, i) => (
        <div key={i}>
          <div className='flex justify-between'>
            <h3 className="text-black font-bold">{item.course_name}</h3>

            {item.from_year && (
              <p className="text-xs text-gray-700">
                {monthNames[Number(item.from_month) - 1] + ", " + item.from_year} -
                {" " + (item.to_month === "Present" ? "Present" : monthNames[Number(item.to_month) - 1] + ", " + item.to_year)}
              </p>

            )}

          </div>
          {item.institution && <p className="text-sm">
            {item.institution} </p>}
          <p className="text-sm font-bold">
            {lang === 'en' ? item.city.en_name : item.city.ar_name} -  {lang === 'en' ? item.country.en_name : item.country.ar_name}</p>
          <p className="text-sm text-gray-700">{item.details}</p>
        </div>
      ))}
    </div>
  );

  const VolunteersList: React.FC<{ volunteers?: IVolunteer[], accentColor: string }> = ({ volunteers: volunteers }) => (
    <div className="space-y-4">
      {(Array.isArray(volunteers) ? volunteers : []).map((item, i) => (
        <div key={i}>
          <h3 className="text-black font-bold">{item.role}</h3>

          {item.company && item.from_year && (
            <p className="text-sm ">
              {item.company} | {item.from_year} -
              {" " + item.to_year}
            </p>
          )}

          <p className="text-sm text-gray-700 mt-1 font-bold">
            {[
              item.city ? (lang === "en" ? item.city.en_name : item.city.ar_name) : null,
              item.country ? (lang === "en" ? item.country.en_name : item.country.ar_name) : null,

            ]
              .filter(Boolean) // يشيل أي null أو undefined
              .join(" - ")}
          </p>          <p className="text-sm text-gray-700 text-justify break-words whitespace-normal">{item.details}</p>
        </div>
      ))}
    </div>
  );

  const EducationList: React.FC<{ education?: IEducation[], accentColor: string }> = ({ education }) => (
    <div className="space-y-3">
      {(Array.isArray(education) ? education : []).map((item, i) => (
        <div key={i}>
          <h3 className="text-gray-800">{item.edu_type}</h3>
          <div className='flex justify-between'>
            <div className='font-bold'>
              <p className="text-sm">{lang === 'en' ? item.university.en_name : item.university.ar_name} - {item.edu_level === "1" && lang === 'en' ? item.college.en_name : item.college.ar_name}
                {item.edu_level === "2" && lang === 'en' ? item.institute.en_name : item.institute.ar_name} - {lang === 'en' ? item.specialty.en_name : item.specialty.ar_name}</p>
              <p className="text-sm">
                {lang === 'en' ? item.city.en_name : item.city.ar_name} - {lang === 'en' ? item.country.en_name : item.country.ar_name}</p>
            </div>
            <p className='text-xs'>{item.from_year} - {item.to_year}</p>

          </div>
        </div>
      ))}
    </div>
  );

  const Languages: React.FC<{ languages?: ILanguage[], accentColor: string }> = ({ languages }) => (
    <div className="space-y-3">
      {(Array.isArray(languages) ? languages : []).map((item, i) => (
        <div key={i} className='flex items-center gap-2'>
          <h3 className="text-gray-800">{t(`${item.language}`, { lng: lang })}</h3>
          <p className="text-xs  mt-1">{t(`${item.proficiency}`, { lng: lang })}</p>
        </div>
      ))}
    </div>
  );

  const SkillsList: React.FC<{ skills?: ISkills[] }> = ({ skills }) => (
    <ul className="flex flex-wrap gap-2 text-xs">
      {(Array.isArray(skills) ? skills : []).map((skill, i) => (
        <li key={i} className="bg-gray-100 px-2 py-1 rounded" style={{ color: colorOptions[0].code }}>{lang === 'en' ? skill.en_Name : skill.ar_Name}</li>
      ))}
    </ul>
  );

  const formatDate = (date: string | number) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  };
  const normalizeLanguages = (languages: any): ILanguage[] => {
    if (!languages) return [];
    if (Array.isArray(languages)) return languages;
    try {
      if (typeof languages === "string") {
        const parsed = JSON.parse(languages);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      return [];
    }
    return [];
  };

  const Template1: React.FC<{ resume: IResume, accentColor: string }> = ({ resume, accentColor }) => (
    <div
      className='border p-5'
      dir={lang === "en" ? 'ltr' : 'rtl'}
    >
      {/* HEADER */}

      <header className="text-center pb-4 mb-4">
        <h1 className="text-2xl font-bold text-black">{resume.full_name && resume.full_name}</h1>
        <p className="text-sm text-gray-700 mt-1">
          {[resume.address_info ? resume.address_info : null,
          resume.village ? (lang === "en" ? resume.village.en_name : resume.village.ar_name) : null,
          resume.province ? (lang === "en" ? resume.province.en_name : resume.province.ar_name) : null,
          resume.city ? (lang === "en" ? resume.city.en_name : resume.city.ar_name) : null,
          resume.country ? (lang === "en" ? resume.country.en_name : resume.country.ar_name) : null,

          ]
            .filter(Boolean) // يشيل أي null أو undefined
            .join(", ")}
        </p>

        <div className="flex justify-center gap-6 text-xs text-gray-700 mt-2">
          <p>{resume.email && resume.email}</p>
          <p>{resume.phone && resume.phone + "+"}</p>

        </div>
      </header>

      {/* OBJECTIVE */}
      <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1" style={{ borderColor: "#000" }}>
          {t("objective", { lng: lang })}
        </h2>
        <p className="text-sm text-gray-800 text-justify break-words whitespace-normal leading-relaxed">{resume.summary}</p>
      </section>

      {/* EXPERIENCE */}
      <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("experience", { lng: lang })}</h2>
        <ExperienceList experience={resume.work_History} accentColor={accentColor} />
      </section>
      {resume.volunteers && resume.volunteers.length > 0 && <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("volunteers", { lng: lang })}</h2>
        <VolunteersList volunteers={resume.volunteers} accentColor={accentColor} />
      </section>}

      {/* EDUCATION */}
      {resume.education && resume.education.length > 0 && <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("education", { lng: lang })}</h2>
        <EducationList education={resume.education} accentColor={accentColor} />
      </section>}

      {resume.courses && resume.courses.length > 0 && <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("courses", { lng: lang })}</h2>
        <CourseList course={resume.courses!} accentColor={accentColor} />
      </section>}

      {normalizeLanguages(resume.languages).length > 0 && (
        <section className="mb-6">
          <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">
            {t("languages", { lng: lang })}
          </h2>
          <Languages languages={normalizeLanguages(resume.languages)} accentColor={accentColor} />
        </section>
      )}

      {/* Certifications Section */}
      {resume.certifications && resume.certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="font-extrabold mb-4 flex items-center">
            <span className="w-1 h-6 mr-3 rounded" style={{ backgroundColor: accentColor }}></span>
            {t("Certifications", { lng: lang })}
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert: ICertification, index: number) => (
              <div key={index} className="text-gray-700">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-gray-500"> - {cert.issuer}</span>}
                {cert.date && <span className="text-gray-500"> ({cert.date})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {resume.skills && resume.skills.length > 0 && <section className="mb-6">
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("skills", { lng: lang })}</h2>
        <SkillsList skills={resume.skills} />
      </section>}

      {/* PERSONAL INFO */}
      <section>
        <h2 className="font-extrabold text-black text-lg mb-1 border-b pb-1">{t("personal information", { lng: lang })}</h2>
        <ul className="text-sm text-gray-800 leading-relaxed list-disc mx-5">
          {resume.birth_date && <li>{t("Date of birth", { lng: lang })} :  {formatDate(resume.birth_date)}</li>}
          {resume.military_status && <li>{t("Military status", { lng: lang })} :  {t(resume.military_status, { lng: lang })}</li>}
          {resume.marital_status && <li>{t("Marital status", { lng: lang })} :  {t(resume.marital_status, { lng: lang })}</li>}
        </ul>
      </section>

    </div>

  );

  const templates = [
    { id: 1, type: Template1, withColumn: false, withImage: false },
  ];

  const findTemplate: any = templates.find((temp) => temp.id === Number(selectedTempId));

  const isWithColSet = Object.prototype.hasOwnProperty.call(props, "withCol");
  const isWithImgSet = Object.prototype.hasOwnProperty.call(props, "withImg");

  useEffect(() => {
    const tempId = Number(localStorage.getItem("tempId"))
    const color = localStorage.getItem("color")
    if (tempId) {
      setSelectedTemplate(tempId)
      setSelectedColor(color!)
    } else {
      setSelectedTemplate(selectedTempId!)
    }

  }, [findCv, selectedTempId])
  useEffect(() => {
    let matchedTemplate: any[] = [];

    if (!isWithColSet && !isWithImgSet) {
      setTemps(templates); // ✅ مفيش فلترة
      return;
    }

    if (withCol && withImg) {
      matchedTemplate = templates.filter(t => t.withColumn && t.withImage);
    } else if (withCol) {
      matchedTemplate = templates.filter(t => t.withColumn);
    } else if (withImg) {
      matchedTemplate = templates.filter(t => t.withImage);
    } else {
      matchedTemplate = templates;
    }

    setTemps(matchedTemplate);

  }, [selectedTempId, withCol, withImg, findCv]);

  const [temps, setTemps] = useState(templates);

  const baseWidth = 700;
  const scale = 0.3; // or tweak to 0.35 or 0.5 based on spacing

  const selectTemp = (template: any) => {
    const tryParseJSON = (data: string | null | undefined, fallback: any) => {
      try {
        if (typeof data === "string") {
          const parsed = JSON.parse(data);
          return parsed ?? fallback;
        }
        return fallback;
      } catch {
        return fallback;
      }
    };

    const heading = tryParseJSON(findCv?.heading, {});
    const experience = tryParseJSON(findCv?.work_History, []);
    const education = tryParseJSON(findCv?.education, []);
    const skills = tryParseJSON(findCv?.skills, []);
    const languages = tryParseJSON(findCv?.languages, []);

    // ✅ split الاسم بشكل آمن
    const fullName = heading?.name?.trim?.().split(" ") ?? [];
    const first_name = fullName[0] || "";

    const fullResume: IResume = {
      full_name: first_name,
      city: heading?.city || "",
      country: heading?.country || "",
      phone: heading?.phone || "",
      email: heading?.email || "",
      summary: heading?.summary || "",
      work_History: Array.isArray(experience) ? experience : [],
      skills: Array.isArray(skills) ? skills : [],
      languages: Array.isArray(languages) ? languages : [],
      education: Array.isArray(education) ? education : [],
    };

    dispatch(setFoundCv(findCv || {}));
    localStorage.setItem("resumeData", JSON.stringify(fullResume));
    localStorage.setItem("tempId", template.id);

    setSelectedTemplate(template.id);
    setSelectedColor(findCv?.color || selectedColor);
    localStorage.setItem("color", findCv?.color || selectedColor);

    // ✅ الشرط اتظبط
    if (selectedTempId! > 0) {
      setSelectedTemplate(template.id);
    }
  };

  const setColor = (id?: number, colorCode?: string) => {
    setSelectedTemplate(id!);
    setSelectedColor(colorCode!);
    localStorage.setItem('color', colorCode!.toString());

  }
  const path = window.location.pathname;
  return (
    <>
      {path === "/build-resume/choose-temp" ? <div className='grid grid-cols-12'>
        {temps?.map((Template, index) => (
          <div
            dir={lang === "en" ? '' : 'ltr'}
            key={index}
            className={`lg:col-span-4 sm:col-span-6 md:col-span-6 col-span-12 ${temps.length <= 3 ? "h-[450px]" : "h-full"} border-4 rounded-xl p-2 mb-20 hover:border-sky-700 transition cursor-pointer w-full flex flex-col items-center ${selectedTemplate == Template.id ? "border-dashed border-sky-700" : "border-transparent"
              }`}
            onClick={() => selectTemp(Template)}
          >
            {/* Fixed preview box with overflow hidden */}
            <div
              className="relative bg-white shadow-md overflow-auto scrollbar-hide"
              style={{
                width: `${baseWidth * scale}px`,
                height: `${900 * scale}px`,
              }}
            >

              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${baseWidth}px`,
                  height: "100%"
                }}
              >

                <div style={{
                  maxHeight: `${900 / scale}px`,
                  overflowY: "auto",
                }}>
                  {Template && (
                    <Template.type
                      resume={sampleResume.resume! || props.resume!}
                      accentColor={selectedTemplate === Template.id ? selectedColor : "#000"}
                    />
                  )}
                </div>

              </div>
            </div>

            {/* Color dots */}
            <div className="flex gap-2 justify-center mt-3">
              {colorOptions.map(({ css, code }) => (
                <div
                  key={code}
                  className={`w-5 h-5 rounded-full cursor-pointer border border-white shadow ${css} ${selectedColor === code && selectedTemplate === Template.id ? "ring-2 ring-black" : ""
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setColor(Template.id, code)
                  }}
                />
              ))}
            </div>

          </div>
        ))}
        <SelectBar selected={selectedTemplate! > 0} selectedTemp={selectedTemplate} />

      </div> :


        <div
          style={{
            width: '100%',
          }}
          className="flex justify-center"

        >
          <div
            ref={ref}
            style={{
              width: "700px",
              margin: "0px",
              padding: "20px",
              background: "white",
            }}
          >

            {findTemplate ? (
              <findTemplate.type

                resume={props.resume}
                accentColor={props.color}
              />
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No template selected
              </p>
            )}
          </div>
        </div>



      }

    </>
  );
};

export default Templates;