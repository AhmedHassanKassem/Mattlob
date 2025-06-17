import React, { useEffect, useState } from 'react';
import { FileText, User, GraduationCap, Award, FileCheck, Settings, Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface SidebarProps {
  currentStep?: number;
  completionPercentage?: number;
}

const SideBar: React.FC<SidebarProps> = ({ 
  currentStep = 1, 
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [percent, setPercent] = useState("20%");

useEffect(() => {
  const path = window.location.pathname;

  const stepMap: Record<string, number> = {
    '/build-resume/fill-data': 1,
    '/build-resume/work-history': 2,
    '/build-resume/add-educ': 3,
    '/build-resume/add-skills': 4,
    '/build-resume/add-summary': 5,
    '/build-resume/finalize': 6,
  };

  const currentStep = stepMap[path] || 1;
  setActiveStep(currentStep)
  const percentage: Record<string, string> = {
    '/build-resume/fill-data': "20%",
    '/build-resume/work-history': "45%",
    '/build-resume/add-educ': "60%",
    '/build-resume/add-skills': "75%",
    '/build-resume/add-summary': "85%",
    '/build-resume/finalize': "95%",

  };

  const currentPer = percentage[path] || "20%";
  setPercent(currentPer);
}, []);


  const steps: Step[] = [
    {
      id: 1,
      title: 'Heading',
      icon: <User size={16} />,
      completed: activeStep > 1
    },
    {
      id: 2,
      title: 'Work history',
      icon: <FileText size={16} />,
      completed: activeStep > 2
    },
    {
      id: 3,
      title: 'Education',
      icon: <GraduationCap size={16} />,
      completed: activeStep > 3
    },
    {
      id: 4,
      title: 'Skills',
      icon: <Award size={16} />,
      completed: activeStep > 4
    },
    {
      id: 5,
      title: 'Summary',
      icon: <FileCheck size={16} />,
      completed: activeStep > 5
    },
    {
      id: 6,
      title: 'Finalize',
      icon: <Settings size={16} />,
      completed: activeStep > 6
    }
  ];



  return (
    <div className="w-60 h-screen fixed border-r border-gray-200 flex flex-col text-sm">
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex justify-center items-center gap-3">
         <img src="/logoBlack.png" className='mix-blend-multiply w-32' alt="" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 px-6 pt-6">
        <div className="space-y-0">
  {steps.map((step , index) => {
    const isActive = activeStep === step.id;
     const isLastStep = index === steps.length - 1;
     const isCompleted = activeStep > step.id;
    return (
      <div
        key={step.id}
        className={`relative z-10 flex  gap-3 px-5 group`}
      >
        {/* Circle */}
     <div className="flex flex-col items-center ">
        <div className={`w-6 h-6 rounded-full border-2  text-sm   font-bold flex items-center justify-center
          ${isActive ? 'border-sky-600 text-sky-600' : 'border-gray-300 text-gray-500'}
          ${isCompleted ? 'border-sky-600 text-sky-600 bg-sky-600' : 'bg-white border-gray-300 text-gray-500'}
        `}>
          {isCompleted ? <Check size={12} className="text-white" strokeWidth={4}/> : step.id}
          
        </div>

        {/* Vertical dotted line */}
      {!isLastStep && (
  <div className={`h-8 border-l-2 ${isCompleted ? "border-sky-600" :"border-dashed"} border-gray-400 `}></div>
)}

      </div>
  
        {/* Title */}
        <span
          className={`text-sm truncate  ${
            isActive
              ? 'font-bold text-sky-900'
              : isCompleted
              ? 'text-gray-700'
              : 'text-gray-600'
          }`}
        >
          {step.title}
        </span>
        
      </div>
    );
  })}
</div>

        </div>

        {/* Progress Section */}
        <div className="p-4 mx-1  rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Resume Completeness:
            </span>
          </div>
          
          <div className="relative flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percent}` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-right">
                <span className="text-sm font-bold text-sky-600">
                  {percent}
                </span>
              </div>
            </div>
          </div>
        </div>
     
      <div className="p-6 border-t border-gray-100 space-y-3">
        <a href="#" className="block text-sm text-sky-600 hover:text-sky-800 transition-colors">
          Terms and Conditions
        </a>
        <a href="#" className="block text-sm text-sky-600 hover:text-sky-800 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="block text-sm text-sky-600 hover:text-sky-800 transition-colors">
          Accessibility
        </a>
        <a href="#" className="block text-sm text-sky-600 hover:text-sky-800 transition-colors">
          Contact Us
        </a>
        
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            © 2025, Mattlob Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
