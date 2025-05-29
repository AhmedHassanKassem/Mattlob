import { Key, useState, ReactElement, ReactNode, ReactPortal, JSXElementConstructor } from 'react';
import Button from '../../../containers/Button';
import CheckBoxInput from '../../../containers/Checkbox';
import SelectBar from '../../../containers/SelectBar';

interface IExperience {
  role: string;
  company: string;
  duration: string;
  details: string;
}

interface IEducation {
  degree: string;
  institution: string;
  year: string;
}

interface IResume {
  name: string;
  title: string;
  contact: string;
  experience: IExperience[];
  skills: string[];
  education: IEducation[];
}

const resumeTemplates = [
  { id: 1, name: 'Template 1', color: 'border-blue-700', preview: '/template1.png' },
  { id: 2, name: 'Template 2', color: 'border-gray-700', preview: '/template2.png' },
  { id: 3, name: 'Template 3', color: 'border-indigo-800', preview: '/template3.png' },
];

const colorOptions = [
  'bg-blue-900',
  'bg-gray-600',
  'bg-teal-700',
  'bg-red-500',
  'bg-purple-700',
  'bg-orange-400',
  'bg-rose-300',
  'bg-slate-800',
];

const resumeSamples: Record<1 | 2 | 3, IResume> = {
  1: {
    name: 'Ahmed Hassan',
    title: 'Full Stack Developer',
    contact: 'ahmed.hassan@example.com | +20 123 456 7890',
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Tech Solutions Ltd.',
        duration: 'Jan 2020 - Present',
        details: 'Leading a team developing scalable web applications using React and .NET Core.',
      },
      {
        role: 'Frontend Developer',
        company: 'WebWorks',
        duration: 'Jun 2017 - Dec 2019',
        details: 'Built responsive UI components and improved site accessibility.',
      },
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', '.NET Core', 'SQL Server'],
    education: [
      {
        degree: 'B.Sc. in Computer Science',
        institution: 'Cairo University',
        year: '2013 - 2017',
      },
    ],
  },
  2: {
    name: 'Sara Ali',
    title: 'UI/UX Designer',
    contact: 'sara.ali@example.com | +20 987 654 3210',
    experience: [
      {
        role: 'Lead Designer',
        company: 'Creative Minds',
        duration: 'Mar 2018 - Present',
        details: 'Designing user-friendly interfaces and improving user experience for mobile apps.',
      },
      {
        role: 'Graphic Designer',
        company: 'Design Hub',
        duration: 'Jan 2015 - Feb 2018',
        details: 'Created brand identities and marketing materials for clients.',
      },
    ],
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping'],
    education: [
      {
        degree: 'B.A. in Graphic Design',
        institution: 'Alexandria University',
        year: '2010 - 2014',
      },
    ],
  },
  3: {
    name: 'Mohamed Salah',
    title: 'Data Scientist',
    contact: 'mohamed.salah@example.com | +20 111 222 3333',
    experience: [
      {
        role: 'Data Scientist',
        company: 'Data Insights',
        duration: 'Feb 2019 - Present',
        details: 'Developed predictive models to optimize business decisions using Python and ML.',
      },
      {
        role: 'Data Analyst',
        company: 'Analytics Pro',
        duration: 'Jul 2016 - Jan 2019',
        details: 'Analyzed large datasets and presented actionable insights to stakeholders.',
      },
    ],
    skills: ['Python', 'Machine Learning', 'SQL', 'R', 'Data Visualization', 'Statistics'],
    education: [
      {
        degree: 'B.Sc. in Mathematics',
        institution: 'Cairo University',
        year: '2010 - 2014',
      },
    ],
  },
};

const Choose = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [colors, setColors] = useState<Record<number, string>>({
    1: 'bg-blue-900',
    2: 'bg-gray-600',
    3: 'bg-teal-700',
  });

  return (
    <div className="grid grid-cols-12 gap-6 text-sm">
      {/* Sidebar Filters */}
      <div className="col-span-3 py-5">
        <div className="flex justify-between font-bold mb-3">
          <p>Filters</p>
          <Button className="text-sky-500" titleClassname="underline" title="Clear filters" />
        </div>
        <div className="mb-3">
          <p className="py-2">Headout</p>
          <CheckBoxInput label2="With photo" labelClassName="pl-1 p-0" className="p-0" />
          <CheckBoxInput label2="Without photo" labelClassName="pl-1 p-0" className="p-0" />
        </div>
        <div className="mb-3">
          <p className="py-2">Columns</p>
          <CheckBoxInput label2="1 column" labelClassName="pl-1 p-0" className="p-0" />
          <CheckBoxInput label2="2 columns" labelClassName="pl-1 p-0" className="p-0" />
        </div>
      </div>

      {/* Resume Previews */}
      <div className="col-span-9">
        <div className="grid grid-cols-3 gap-4">
          {resumeTemplates.map((template) => {
           const resume = resumeSamples[template.id as 1 | 2 | 3]!;
            const selectedColor = colors[template.id];

            return (
              <><div
                    key={template.id}
                    className={`rounded-lg cursor-pointer p-3 transition-all `}
                    onClick={() => setSelectedTemplate(template.id)}
                >
                    <div className={`border-4 rounded p-3 shadow-lg bg-white ${selectedTemplate === template.id ? template.color : 'border-transparent'}`}>
                        <h1 className={`text-2xl font-bold mb-1 ${selectedColor} text-white p-2 rounded`}>
                            {resume.name}
                        </h1>
                        <h2 className="text-md italic mb-1">{resume.title}</h2>
                        <p className="text-xs text-gray-600 mb-2">{resume.contact}</p>

                        <section className="mb-3">
                            <h3 className={`font-semibold ${selectedColor} text-white p-1 rounded`}>Experience</h3>
                            {resume.experience.map((exp: { role: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; company: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; duration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; details: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: Key | null | undefined) => (
                                <div key={i} className="text-xs mb-1">
                                    <p>
                                        <strong>{exp.role}</strong> - <em>{exp.company}</em>
                                    </p>
                                    <p>{exp.duration}</p>
                                    <p>{exp.details}</p>
                                </div>
                            ))}
                        </section>

                        <section className="mb-3">
                            <h3 className={`font-semibold ${selectedColor} text-white p-1 rounded`}>Skills</h3>
                            <ul className="flex flex-wrap gap-2 text-xs">
                                {resume.skills.map((skill: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                    <li key={i} className="bg-gray-100 px-2 py-1 rounded">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className={`font-semibold ${selectedColor} text-white p-1 rounded`}>Education</h3>
                            {resume.education.map((edu: { degree: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; institution: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; year: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: Key | null | undefined) => (
                                <div key={i} className="text-xs mb-1">
                                    <p className="font-semibold">{edu.degree}</p>
                                    <p className="italic">{edu.institution}</p>
                                    <p>{edu.year}</p>
                                </div>
                            ))}
                        </section>


                    </div>
<div className="mt-3">
                        <div className="flex gap-2 flex-wrap">
                            {colorOptions.map((color) => (
                                <div
                                    key={color}
                                    className={`w-7 h-7 rounded-full cursor-pointer border-2 border-white shadow-md ${color} ${selectedColor === color ? 'ring-2 ring-black ring-offset-1' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setColors((prev) => ({ ...prev, [template.id]: color }));
                                    } }
                                ></div>
                            ))}
                        </div>
                    </div>
                </div></>
            );
          })}
        </div>
      </div>
      <SelectBar selected={selectedTemplate !== 0}/>
    </div>
  );
};

export default Choose;