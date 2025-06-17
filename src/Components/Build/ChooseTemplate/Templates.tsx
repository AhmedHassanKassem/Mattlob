import React, { FC, RefObject, useEffect, useState } from 'react';

export interface IExperience {
  id? : number
  role: string;
  company: string;
  from_year: string;
  to_year: string;
  remote: boolean;
  present: boolean;
  location: string;
  details: string;
}
export interface IEducation {
  id? : number
  degree: string;
  institution: string;
  field_of_Study: string;
  location: string;
  year: string;
}
export interface IResume {
  first_name: string;
  last_name: string;
  city: string;
  country : string
  phone : string
  email : string
  title: string;
  summary: string;
  experience: IExperience[];
  skills: string[];
  education: IEducation[];
}
export interface tempProps {
  ref?: RefObject<HTMLDivElement | null>;
  selectedTempId? : number
  resume? : IResume
}

// Sample resume data used by all templates
export const sampleResume: tempProps = {
resume : {
  first_name: 'FATIMA',
  last_name: 'HASSAN',
  title: 'Marketing Manager',
  city: 'New York, NY',
  country: 'USA',
  phone: '+1 (555) 123-4567',
  email: 'fatima.hassan@email.com',
  summary : 'write some words about yourself , tell employers more',
  experience: [
    {
      role: 'Senior Marketing Manager',
      company: 'TechCorp Solutions',
      from_year: '2020',
      to_year: '',
      remote: false,
      present: true,
      location: 'US',
      details: 'Led cross-functional team of 12 marketing professionals. Increased lead generation by 85% through targeted digital campaigns.'
    },
    {
      role: 'Marketing Specialist',
      company: 'Digital Innovations Inc.',
      from_year: '2018',
      to_year: '2018',
      remote: false,
      present : false,
      location: 'US',
      details: 'Developed content marketing strategy increasing organic traffic by 200%. Managed social media accounts with 50K+ followers.',
    },
  ],
  skills: ['Digital Marketing', 'Project Management', 'Data Analysis', 'Team Leadership'],
  education: [
    { degree: 'Master of Business Administration', institution: 'Columbia Business School', field_of_Study : "gghgsdfgdf" , location : "Columbia" , year: '2018' },
    { degree: 'Bachelor of Arts in Marketing', institution: 'New York University', field_of_Study : "gghgsdfgdf", location : "USA" ,year: '2016' },
  ],
 
}
};

// Color options with tailwind classes and hex codes for inline style
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
const ExperienceList: React.FC<{ experience: IExperience[], accentColor: string }> = ({ experience }) => (
  <div className="space-y-4">
    {experience.map((item, i) => (
      <div key={i}>
        <h3 className="font-semibold text-gray-800">{item.role}</h3>

        {item.company && item.from_year && (
          <p className="text-sm italic">
            {item.company} | {item.from_year}
            {item.present ? ' - present' : item.to_year ? ` - ${item.to_year}` : ''}
          </p>
        )}

        <p className="text-sm italic">{item.remote ? "Remotly" : "Not Remotly"}</p>
        <p className="text-sm text-gray-700">{item.details}</p>
      </div>
    ))}
  </div>
);

const EducationList: React.FC<{education: IEducation[]}> = ({education}) => (
  <div className="space-y-3">
    {education.map((item, i) => (
      <div key={i}>
        <h3 className="font-semibold text-gray-800">{item.degree}</h3>
        <p className="text-sm italic">{item.institution} - {item.location} • {item.year}</p>
        <p className="text-sm italic">{item.field_of_Study}</p>
      </div>
    ))}
  </div>
);

const SkillsList: React.FC<{skills: string[]}> = ({skills}) => (
  <ul className="flex flex-wrap gap-2 text-xs">
    {skills?.map((skill, i) => (
      <li key={i} className="bg-gray-100 px-2 py-1 rounded" style={{color : colorOptions[0].code}}>{skill}</li>
    ))}
  </ul>
);

// Template 1: Classic Professional (Simple two-column)
// Template 1: Classic Layout
// Template 1: Classic Professional
const Template1: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-4xl mx-auto bg-white p-12  border border-gray-100">
    <header className="border-b-2 pb-8 mb-8" style={{borderColor: accentColor}}>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{resume.first_name} {resume.last_name}</h1>
      <p className="text-gray-600 mb-4">{resume.title}</p>
      <div className="flex items-center text-sm text-gray-500 space-x-6">
        <span>{resume.email}</span>
        <span>{resume.phone}</span>
        <span>{resume.city}, {resume.country}</span>
      </div>
    </header>

    <section className="mb-8">
      <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
        <div className="w-1 h-6 mr-3 rounded" style={{backgroundColor: accentColor}}></div>
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed text-base">
        {resume.summary}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
        <div className="w-1 h-6 mr-3 rounded" style={{backgroundColor: accentColor}}></div>
        Professional Experience
      </h2>
      <ExperienceList experience={resume.experience} accentColor={accentColor} />
    </section>

    <section className="mb-8">
      <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
        <div className="w-1 h-6 mr-3 rounded" style={{backgroundColor: accentColor}}></div>
        Education
      </h2>
      <EducationList education={resume.education} />
    </section>

    <section className="mt-5">
      <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
        <div className="w-1 h-6 mr-3 rounded" style={{backgroundColor: accentColor}}></div>
        Core Skills
      </h2>
      <SkillsList skills={resume.skills} />
    </section>
  </div>
);

// Template 2: Executive Sidebar Layout
const Template2: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-5xl mx-auto  flex  overflow-hidden bg-white">
    <aside className="w-2/5 text-white p-10 flex flex-col" style={{backgroundColor: accentColor}}>
      <div className="mb-8">
        <h1 className="font-bold mb-1">{resume.first_name}</h1>
        <h1 className="font-bold mb-4">{resume.last_name}</h1>
        <p className="text-lg font-light opacity-90 mb-2">{resume.title}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-white border-opacity-30 pb-2">Contact</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center"><span className="opacity-75">📧</span> <span className="ml-2">{resume.email}</span></p>
          <p className="flex items-center"><span className="opacity-75">📱</span> <span className="ml-2">{resume.phone}</span></p>
          <p className="flex items-center"><span className="opacity-75">📍</span> <span className="ml-2">{resume.city}, {resume.country}</span></p>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-4 border-b border-white border-opacity-30 pb-2">Skills & Expertise</h3>
        <SkillsList skills={resume.skills} />
      </div>
    </aside>
    
    <main className="flex-grow p-10 bg-gray-50">
      <section className="mb-8">
        <h2 className="font-bold mb-2 text-gray-800" style={{color: accentColor}}>Professional Experience</h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>
      <section className="mt-5">
        <h2 className="font-bold mb-2 text-gray-800" style={{color: accentColor}}>Education</h2>
        <EducationList education={resume.education} />
      </section>
    </main>
  </div>
);

// Template 3: Modern Corporate Layout
const Template3: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-6xl mx-auto flex gap-8 p-12  bg-white">
    <div className="w-1/3 bg-gradient-to-b from-gray-50 to-gray-100 p-8 ">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: accentColor}}>
          {resume.first_name[0]}{resume.last_name[0]}
        </div>
        <h1 className="font-bold text-gray-900 mb-2">{resume.first_name} {resume.last_name}</h1>
        <p className="text-gray-600 font-medium">{resume.title}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4" style={{color: accentColor}}>Contact Information</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>{resume.email}</p>
          <p>{resume.phone}</p>
          <p>{resume.city}, {resume.country}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-4" style={{color: accentColor}}>Skills</h3>
        <SkillsList skills={resume.skills} />
      </div>
    </div>
    
    <div className="w-2/3">
      <section className="mb-8">
        <h2 className="font-bold mb-2 pb-2 border-b-2" style={{color: accentColor, borderColor: accentColor}}>Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">
          {resume.summary}
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="font-bold mb-2 pb-2 border-b-2" style={{color: accentColor, borderColor: accentColor}}>Experience</h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>
      
      <section className="mt-5">
        <h2 className="font-bold mb-2 pb-2 border-b-2" style={{color: accentColor, borderColor: accentColor}}>Education</h2>
        <EducationList education={resume.education} />
      </section>
    </div>
  </div>
);

// Template 4: Creative Header Design
const Template4: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-5xl mx-auto bg-white   overflow-hidden">
    <header className="relative p-12 text-white" style={{backgroundColor: accentColor}}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full resume-container shadow-xl h-full">
          <circle cx="50" cy="50" r="40" fill="currentColor"/>
        </svg>
      </div>
      <div className="relative z-10">
        <h1 className="font-bold mb-3">{resume.first_name} {resume.last_name}</h1>
        <p className="font-light mb-2 opacity-90">{resume.title}</p>
        <div className="flex items-center space-x-8 text-sm opacity-90">
          <span>{resume.email}</span>
          <span>{resume.phone}</span>
          <span>{resume.city}, {resume.country}</span>
        </div>
      </div>
    </header>
    
    <div className="p-12">
      <section className="mt-5">
        <h2 className="font-bold mb-2 text-gray-800">About Me</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {resume.summary}
        </p>
      </section>
      
      <section className="mt-5">
        <h2 className="font-bold mb-2 text-gray-800">Professional Experience</h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>
      
      <div className="grid grid-cols-2 gap-10">
        <section className="mt-5">
          <h2 className="font-bold mb-2 text-gray-800">Education</h2>
          <EducationList education={resume.education} />
        </section>
        <section className="mt-5">
          <h2 className="font-bold mb-2 text-gray-800">Skills</h2>
          <SkillsList skills={resume.skills} />
        </section>
      </div>
    </div>
  </div>
);

// Template 5: Minimalist Professional
const Template5: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-5xl mx-auto   flex bg-white overflow-hidden">
    <aside className="w-1/3 p-10 bg-gray-900 text-white flex flex-col">
      <div >
        <h1 className="font-light mb-2">{resume.first_name}</h1>
        <h1 className="font-bold mb-2" style={{color: accentColor}}>{resume.last_name}</h1>
        <p className="text-gray-300 font-medium tracking-wide">{resume.title}</p>
      </div>
      
      <div >
        <h3 className="text-lg font-semibold mb-4" style={{color: accentColor}}>Contact</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>{resume.email}</p>
          <p>{resume.phone}</p>
          <p>{resume.city}</p>
          <p>{resume.country}</p>
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-4" style={{color: accentColor}}>Skills</h3>
        <SkillsList skills={resume.skills} />
      </div>
    </aside>
    
    <main className="w-2/3 p-10">
      <section className="mt-5">
        <h2 className="font-light mb-2" style={{color: accentColor}}>Experience</h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>
      
      <section className="mt-5">
        <h2 className="font-light mb-2" style={{color: accentColor}}>Education</h2>
        <EducationList education={resume.education} />
      </section>
    </main>
  </div>
);

// Template 6: Card-Based Modern Design
const Template6: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-6xl mx-auto bg-gray-50 p-8 ">
    <header className="bg-white  shadow-md p-10 mb-8 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2" style={{backgroundColor: accentColor}}></div>
      <h1 className=" font-bold text-gray-900 mb-2">{resume.first_name} {resume.last_name}</h1>
      <p className=" text-gray-600 mb-2">{resume.title}</p>
      <div className="flex justify-center space-x-8 text-sm text-gray-500">
        <span>{resume.email}</span>
        <span>{resume.phone}</span>
        <span>{resume.city}, {resume.country}</span>
      </div>
    </header>
    
    <div className="grid grid-cols-2 gap-8 mb-8">
      <section className="bg-white  shadow-md p-8">
        <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
          <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: accentColor}}></div>
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {resume.summary}
        </p>
      </section>
      
      <section className="bg-white  shadow-md p-8">
        <h2 className="font-bold mb-4 flex items-center" style={{color: accentColor}}>
          <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: accentColor}}></div>
          Core Skills
        </h2>
        <SkillsList skills={resume.skills} />
      </section>
    </div>
    
    <section className="bg-white  shadow-md p-8 mb-8">
      <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
        <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: accentColor}}></div>
        Professional Experience
      </h2>
      <ExperienceList experience={resume.experience} accentColor={accentColor} />
    </section>
    
    <section className="bg-white  shadow-md p-8">
      <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
        <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: accentColor}}></div>
        Education
      </h2>
      <EducationList education={resume.education} />
    </section>
  </div>
);

// Template 7: Timeline Style
const Template7: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-4xl mx-auto bg-white  p-12">
    <header className="text-center mb-12 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded" style={{backgroundColor: accentColor}}></div>
      <h1 className="font-bold text-gray-900 mb-3">{resume.first_name} {resume.last_name}</h1>
      <p className="text-gray-600 mb-2" style={{color: accentColor}}>{resume.title}</p>
      <div className="flex justify-center space-x-6 text-sm text-gray-500">
        <span className="flex items-center">📧 {resume.email}</span>
        <span className="flex items-center">📱 {resume.phone}</span>
        <span className="flex items-center">📍 {resume.city}, {resume.country}</span>
      </div>
    </header>
    
    <section className="mb-6">
      <h2 className=" font-bold mb-2 relative" style={{color: accentColor}}>
        <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{backgroundColor: accentColor}}></div>
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed text-lg ml-4">
        {resume.summary}
      </p>
    </section>
    
    <section className="mb-6">
      <h2 className=" font-bold mb-2 relative" style={{color: accentColor}}>
        <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{backgroundColor: accentColor}}></div>
        Work Experience
      </h2>
      <div className="ml-4">
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </div>
    </section>
    
    <div className="grid grid-cols-2 gap-12">
      <section className="mt-5">
        <h2 className=" font-bold mb-2 relative" style={{color: accentColor}}>
          <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{backgroundColor: accentColor}}></div>
          Skills
        </h2>
        <div className="ml-4">
          <SkillsList skills={resume.skills} />
        </div>
      </section>
      
      <section className="mt-5">
        <h2 className=" font-bold mb-2 relative" style={{color: accentColor}}>
          <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{backgroundColor: accentColor}}></div>
          Education
        </h2>
        <div className="ml-4">
          <EducationList education={resume.education} />
        </div>
      </section>
    </div>
  </div>
);

// Template 8: Photo-Centric Professional
const Template8: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-5xl mx-auto  shadow-xl flex overflow-hidden bg-white">
    <aside className="w-2/5 bg-gradient-to-b from-gray-100 to-gray-200 p-10 flex flex-col items-center text-center">
      <div className="w-40 h-40 rounded-full mb-8 shadow-lg flex items-center justify-center text-white text-4xl font-bold" style={{backgroundColor: accentColor}}>
        {resume.first_name[0]}{resume.last_name[0]}
      </div>
      
      <h1 className=" font-bold mb-2 text-gray-900">{resume.first_name} {resume.last_name}</h1>
      <p className="text-lg font-medium mb-8" style={{color: accentColor}}>{resume.title}</p>
      
      <div className="mb-8">
        <h3 className="font-bold text-gray-800 mb-4">Contact Details</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p className="break-all">{resume.email}</p>
          <p>{resume.phone}</p>
          <p>{resume.city}, {resume.country}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-gray-800 mb-4">Skills</h3>
        <SkillsList skills={resume.skills} />
      </div>
    </aside>
    
    <main className="w-3/5 p-10">
      <section className="mt-5">
        <h2 className="font-bold mb-2 pb-3 border-b-2" style={{color: accentColor, borderColor: accentColor}}>
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {resume.summary}
        </p>
      </section>
      
      <section className="mt-5">
        <h2 className="font-bold mb-2 pb-3 border-b-2" style={{color: accentColor, borderColor: accentColor}}>
          Experience
        </h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>
      
      <section className="mt-5">
        <h2 className="font-bold mb-2 pb-3 border-b-2" style={{color: accentColor, borderColor: accentColor}}>
          Education
        </h2>
        <EducationList education={resume.education} />
      </section>
    </main>
  </div>
);

// Template 9: Clean Sectioned Layout
const Template9: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div className="w-full resume-container shadow-xl max-w-5xl mx-auto bg-white   p-12">
    <header className="mb-12 pb-8 border-b-4" style={{borderColor: accentColor}}>
      <h1 className=" font-bold text-gray-900 mb-3">{resume.first_name} {resume.last_name}</h1>
      <p className="font-light mb-2" style={{color: accentColor}}>{resume.title}</p>
      <div className="flex items-center space-x-8 text-gray-600">
        <span className="flex items-center"><span className="mr-2">✉</span>{resume.email}</span>
        <span className="flex items-center"><span className="mr-2">☎</span>{resume.phone}</span>
        <span className="flex items-center"><span className="mr-2">⌘</span>{resume.city}, {resume.country}</span>
      </div>
    </header>

    <section className="p-4 bg-gray-50 ">
      <h2 className="font-bold mb-2" style={{color: accentColor}}>Professional Summary</h2>
      <p className="text-gray-700 leading-relaxed text-lg">
        {resume.summary}
      </p>
    </section>

    <section className="p-4 bg-gray-50 ">
      <h2 className="font-bold mb-2" style={{color: accentColor}}>Professional Experience</h2>
      <ExperienceList experience={resume.experience} accentColor={accentColor} />
    </section>

    <div className="grid grid-cols-2 gap-8">
      <section className="p-8 bg-gray-50 ">
        <h2 className="font-bold mb-2" style={{color: accentColor}}>Skills</h2>
        <SkillsList skills={resume.skills} />
      </section>

      <section className="p-8 bg-gray-50 ">
        <h2 className="font-bold mb-2" style={{color: accentColor}}>Education</h2>
        <EducationList education={resume.education} />
      </section>
    </div>
  </div>
);

// Template 10: Executive Header with Accent Strip
const Template10: React.FC<{resume: IResume, accentColor: string}> = ({resume, accentColor}) => (
  <div
  className="w-full resume-container shadow-xl max-w-4xl mx-auto shadow-xl bg-white"
  style={{ breakInside: "avoid", pageBreakInside: "avoid", boxSizing: "border-box" }}
>
    <div className="relative">
      <div className="h-2" style={{backgroundColor: accentColor}}></div>
      <div className="bg-gray-900 text-white p-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{resume.first_name} {resume.last_name}</h1>
            <p className="font-light opacity-90">{resume.title}</p>
          </div>
          <div className="text-right text-sm opacity-75 space-y-1">
            <p>{resume.email}</p>
            <p>{resume.phone}</p>
            <p>{resume.city}, {resume.country}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="p-12">
      <section className="mt-5">
        <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
          <div className="w-8 h-1 mr-4 rounded" style={{backgroundColor: accentColor}}></div>
          About
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {resume.summary}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
          <div className="w-8 h-1 mr-4 rounded" style={{backgroundColor: accentColor}}></div>
          Professional Experience
        </h2>
        <ExperienceList experience={resume.experience} accentColor={accentColor} />
      </section>

      <div className="grid grid-cols-2 gap-12">
        <section className="mt-5">
          <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
            <div className="w-8 h-1 mr-4 rounded" style={{backgroundColor: accentColor}}></div>
            Education
          </h2>
          <EducationList education={resume.education} />
        </section>
        
        <section className="mt-5">
          <h2 className="font-bold mb-2 flex items-center" style={{color: accentColor}}>
            <div className="w-8 h-1 mr-4 rounded" style={{backgroundColor: accentColor}}></div>
            Skills
          </h2>
          <SkillsList skills={resume.skills} />
        </section>
      </div>
    </div>
  </div>
);

// Choose component:
const Templates :  FC<tempProps> = ({selectedTempId , resume , ref = null}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].code);


 
const templates = [
  { id: 1, type: Template1 },
  { id: 2, type: Template2 },
  { id: 3, type: Template3 },
  { id: 4, type: Template4 },
  { id: 5, type: Template5 },
  { id: 6, type: Template6 },
  { id: 7, type: Template7 },
  { id: 8, type: Template8 },
  { id: 9, type: Template9 },
  { id: 10, type: Template10 },
];
const findTemplate : any = templates.find((temp)=> temp.id == selectedTempId)


const selectTemplate = (template : any)=>{
   setSelectedTemplate(template.id);
      localStorage.setItem("tempId" , template.id)
}
useEffect(() => {

}, [selectedTempId])

const baseWidth = 700;
  const scale = 0.3; // or tweak to 0.35 or 0.5 based on spacing

  return (
    <>
      {window.location.pathname === "/build-resume/choose-temp" ? 
        templates.map((Template, index) => (
          <div
            key={index}
            className={`border-4 rounded-xl p-2 mb-20 hover:border-sky-700 transition cursor-pointer w-full flex flex-col items-center ${
              selectedTemplate === Template.id ? "border-dashed border-sky-700" : "border-transparent"
            }`}
            onClick={() => selectTemplate(Template)}
          >
            {/* Fixed preview box with overflow hidden */}
            <div
              className="relative"
              style={{
                width: `${baseWidth * scale}px`,
                height: `${1100 * scale}px`, // 990 = approx A4 height at 700px width
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${baseWidth}px`,
                }}
              >
                {Template && (
                  <Template.type
                    resume={sampleResume.resume!}
                    accentColor={selectedTemplate === Template.id ? selectedColor : "#000"}
                  />
                )}
              </div>
            </div>

            {/* Color dots */}
            <div className="flex gap-2 justify-center mt-3">
              {colorOptions.map(({ css, code }) => (
                <div
                  key={code}
                  className={`w-5 h-5 rounded-full cursor-pointer border border-white shadow ${css} ${
                    selectedColor === code && selectedTemplate === Template.id ? "ring-2 ring-black" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(Template.id);
                    setSelectedColor(code);
                  }}
                />
              ))}
            </div>
          </div>
        )) : <div className="w-full h-full flex justify-center overflow-auto hide-scrollbar">
  <div
    style={{
      width: `${700 * 0.85}px`,      // Adjust scale here if needed
      height: `${1100 * 0.85}px`,     // Height matches aspect ratio
      overflow: "hidden",
      position: "relative",
    }}
  >
  <div
    style={{
      overflow: "auto", // Let it scroll if content is tall
      transform: "scale(0.5)", // Scale it down to fit screen
      transformOrigin: "top left",
      width: "794px", // Base width (resume design width)
    }}
    ref={ref}
  >
    {findTemplate && (
      <findTemplate.type
        resume={resume}
        accentColor={selectedTemplate === findTemplate.id ? selectedColor : "#000"}
      />
    )}
  </div>
  </div>
</div>
}
    </>
  );
};

export default Templates;