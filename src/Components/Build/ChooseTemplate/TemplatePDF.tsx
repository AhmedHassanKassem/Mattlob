import { FC } from "react";
import { ICertification, ICourse, IEducation, IExperience, ILanguage, IResume, ISkills, IVolunteer, tempProps } from "../../../Interfaces/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useTranslation } from "react-i18next";


const TemplatePDF : FC<tempProps> = ({ref}) => {
    const resumeData = JSON.parse(localStorage.getItem("resumeData")!)
    const lang = useSelector((state : RootState)=> state.lang.lang)
    const {t} = useTranslation()
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
    // Reusable lists
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    
      const ExperienceList: React.FC<{ experience?: IExperience[], accentColor: string }> = ({ experience }) => (
        <div className="space-y-4">
          {(Array.isArray(experience) ? experience : []).map((item, i) => (
            <div key={i}>
              <h3 className="text-gray-800">{lang === 'en' ? item.role.en_name : item.role.ar_name}</h3>
    
              {item.company && item.from_year && (
                <p className="text-sm ">
                  {item.company} | {item.from_year} -
                  {" " + item.to_year}
                </p>
              )}
    
              <p className="text-sm ">{lang === "en" ? item.country.en_name : item.country.ar_name},
                {lang === "en" ? item.city.en_name : item.city.ar_name}</p>
              <p className="text-sm text-gray-700 text-justify break-words whitespace-normal">{item.details}</p>
            </div>
          ))}
        </div>
      );
      const CourseList: React.FC<{ course?: ICourse[], accentColor: string }> = ({ course: course }) => (
        <div className="space-y-4">
          {(Array.isArray(course) ? course : []).map((item, i) => (
            <div key={i}>
              <div className='flex justify-between'>
                <h3 className="text-gray-800">{item.course_name}</h3>
    
                {item.from_year && (
                  <p className="text-xs text-gray-700">
                    {monthNames[Number(item.from_month) - 1] + ", " + item.from_year} -
                    {" " + (item.to_month === "Present" ? "Present" : monthNames[Number(item.to_month) - 1] + ", " + item.to_year)}
                  </p>
    
                )}
    
              </div>           {item.institution && <p className="text-sm">
                {item.institution} </p>}
              <p className="text-sm ">{lang === 'en' ? item.country.en_name : item.country.ar_name}, {lang === 'en' ? item.city.en_name : item.city.ar_name}</p>
              <p className="text-sm text-gray-700">{item.details}</p>
            </div>
          ))}
        </div>
      );
      const VolunteersList: React.FC<{ volunteers?: IVolunteer[], accentColor: string }> = ({ volunteers: volunteers }) => (
        <div className="space-y-4">
          {(Array.isArray(volunteers) ? volunteers : []).map((item, i) => (
            <div key={i}>
              <h3 className="text-gray-800">{item.role}</h3>
    
              {item.company && item.from_year && (
                <p className="text-sm ">
                  {item.company} | {item.from_year} -
                  {" " + item.to_year}
                </p>
              )}
    
              <p className="text-sm ">{lang === 'en' ? item.country.en_name : item.country.ar_name}, {lang === 'en' ? item.city.en_name : item.city.ar_name}</p>
              <p className="text-sm text-gray-700 text-justify break-words whitespace-normal">{item.details}</p>
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
                <div>
                  <p className="text-sm">{lang === 'en' ? item.college.en_name : item.college.ar_name
                    || lang === 'en' ? item.institute.en_name : item.institute.ar_name} - {lang === 'en' ? item.specialty.en_name : item.specialty.ar_name}</p>
                  <p className="text-sm">{lang === 'en' ? item.university.en_name : item.university.ar_name} - {lang === 'en' ? item.city.en_name : item.city.ar_name}</p>
                </div>
                <p className='text-xs'>{item.from_year} - {item.to_year}</p>
    
              </div>
            </div>
          ))}
        </div>
      );
      // const Certifications: React.FC<{ cert?: ICertification[], accentColor: string }> = ({ cert }) => (
      //   <div className="space-y-3">
      //     {(Array.isArray(cert) ? cert : []).map((item, i) => (
      //       <div key={i}>
      //         <h3 className="text-gray-800">{item.name}</h3>
      //         <p className="text-sm ">{item.issuer}</p>
      //         <p className="text-sm ">{item.date}</p>
      //       </div>
      //     ))}
      //   </div>
      // );
      const Languages: React.FC<{ lang?: ILanguage[], accentColor: string }> = ({ lang }) => (
        <div className="space-y-3">
          {(Array.isArray(lang) ? lang : []).map((item, i) => (
            <div key={i} className='flex items-center gap-2'>
              <h3 className="text-gray-800">{t(`${item.language}`)}</h3>
              <p className="text-xs  mt-1">{t(`${item.proficiency}`)}</p>
            </div>
          ))}
        </div>
      );
      // const Links: React.FC<{ link?: string[] }> = ({ link }) => (
      //   <div className="space-y-3 flex">
      //     {(Array.isArray(link) ? link : []).map((item, i) => (
      //       <div key={i} className='flex items-center gap-2'>
      //         <p className="text-xs  mt-1 text-blue-400">{item}</p>
      //       </div>
      //     ))}
      //   </div>
      // );
    
      const SkillsList: React.FC<{ skills?: ISkills[] }> = ({ skills }) => (
        <ul className="flex flex-wrap gap-2 text-xs">
          {(Array.isArray(skills) ? skills : []).map((skill, i) => (
            <li key={i} className="bg-gray-100 px-2 py-1 rounded" style={{ color: colorOptions[0].code }}>{lang === 'en' ? skill.en_Name : skill.ar_Name}</li>
          ))}
        </ul>
      );
    
    
      // Template 1: Classic Professional (Simple two-column)
      // Template 1: Classic Layout
      // Template 1: Classic Professional
      // Template 1: Classic Professional Layout
    
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
      // const getImageSrc = () => {
      //   const location = useLocation()
      //   const path = location.pathname
      //   const resume: ICVData = JSON.parse(localStorage.getItem('resumeData')!);
      //   if (resume?.image?.base64Image) {
    
      //     return `data:image/${resume.image.fileExtension};base64,${resume.image?.base64Image}`;
    
    
      //   } else if (resume?.attach?.path) {
      //     if (path === '/build-resume/choose-temp') {
      //       return `/sample.webp`;
      //     } else {
      //       const baseUrl = 'http://magedzz-001-site4.anytempurl.com';
      //       return `${baseUrl}${resume.attach.path}`;
      //     }
    
      //   }
      //   return null; // ✅ بدل string فاضية
      // };
    
    
      const Template1: React.FC<{ resume: IResume, accentColor: string }> = ({ resume, accentColor }) => (
        <div
          className='border p-5'
          ref={ref}
        >
          {/* HEADER */}
    
          <header className="text-center pb-4 mb-4">
            <h1 className="text-2xl font-bold text-black">{resume.full_name}</h1>
            <p className="text-sm text-gray-700 mt-1">{lang === 'en' ? resume.country?.en_name : resume.country?.ar_name},
              {lang === 'en' ? resume.city?.en_name : resume.city?.ar_name + ","}
              {lang === 'en' ? resume.province?.en_name : resume.province?.ar_name}
              {lang === 'en' ? "," + resume.village?.en_name : resume.village?.ar_name}
              {resume.address_info && "," + resume.address_info}</p>
    
    
            <div className="flex justify-center gap-6 text-xs text-gray-700 mt-2">
              <p>{resume.email}</p>
              <p>{resume.phone}</p>
    
            </div>
          </header>
    
    
          {/* OBJECTIVE */}
          <section className="mb-6">
            <h2 className="font-bold text-black text-مل mb-1 border-b pb-1" style={{ borderColor: "#000" }}>
              {t("objective")}
            </h2>
            <p className="text-sm text-gray-800 text-justify break-words whitespace-normal leading-relaxed">{resume.summary}</p>
          </section>
    
    
          {/* EXPERIENCE */}
          <section className="mb-6">
            <h2 className="font-bold text-black text-lg mb-1 border-b pb-1">{t("experience")}</h2>
            <ExperienceList experience={resume.work_History} accentColor={accentColor} />
          </section>
          {resume.volunteers && resume.volunteers.length > 0 && <section className="mb-6">
            <h2 className="font-bold text-black text-lg mb-1 border-b pb-1">{t("volunteers")}</h2>
            <VolunteersList volunteers={resume.volunteers} accentColor={accentColor} />
          </section>}
    
          {/* EDUCATION */}
          {resume.education && resume.education.length > 0 && <section className="mb-6">
            <h2 className="font-bold text-black text-lg mb-1 border-b pb-1">{t("education")}</h2>
            <EducationList education={resume.education} accentColor={accentColor} />
          </section>}
    
    
          {resume.courses && resume.courses.length > 0 && <section className="mb-6">
            <h2 className="font-bold text-black text-lg mb-1 border-b pb-1">{t("courses")}</h2>
            <CourseList course={resume.courses!} accentColor={accentColor} />
          </section>}
    
    
          {normalizeLanguages(resume.languages).length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold mb-1 border-b pb-1 flex items-center" style={{ color: accentColor }}>
                {t("languages")}
              </h2>
              <Languages lang={normalizeLanguages(resume.languages)} accentColor={accentColor} />
            </section>
          )}
    
          {/* Certifications Section */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mt-5">
              <h2 className="font-bold mb-4 flex items-center" style={{ color: accentColor }}>
                <span className="w-1 h-6 mr-3 rounded" style={{ backgroundColor: accentColor }}></span>
                {t("Certifications")}
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
            <h2 className="font-bold text-black text-sm mb-1 border-b pb-1">{t("skills")}</h2>
            <SkillsList skills={resume.skills} />
          </section>}
    
    
          {/* PERSONAL INFO */}
          <section>
            <h2 className="font-bold text-black text-sm mb-1 border-b pb-1">{t("personal information")}</h2>
            <ul className="text-sm text-gray-800 leading-relaxed list-disc mx-5">
              {resume.birth_date && <li>{t("Date of birth")} :  {formatDate(resume.birth_date)}</li>}
              {resume.military_status && <li>{t("Military status")} :  {t(resume.military_status)}</li>}
              {resume.marital_status && <li>{t("Marital status")} :  {t(resume.marital_status)}</li>}
            </ul>
          </section>
    
        </div>
    
      );
    

  return (
    <div>
       <Template1  resume={resumeData} accentColor={"#000"}/>
    </div>
  )
}

export default TemplatePDF