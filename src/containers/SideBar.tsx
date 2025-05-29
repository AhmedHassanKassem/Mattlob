import React, { useState } from 'react';
import { CheckCircle2, FileText, User, GraduationCap, Award, FileCheck, Settings, Check } from 'lucide-react';

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
  completionPercentage = 20 
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);

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

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
  };

  return (
    <div className="w-72 h-screen bg-white shadow-md border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-center items-center gap-3">
         <img src="/logoBlack.png" className='mix-blend-multiply w-32' alt="" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 px-6 ">
        <div className="space-y-0">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`flex flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                activeStep === step.id
                  ? 'bg-sky-50 border border-sky-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Step Number/Check Circle */}
              <div className="flex-shrink-0">
                {step.completed ? (
                  <>
<div className="flex flex-col items-center gap-2 mt">
  <Check size={24} className="text-sky-600" />
 
</div>
</>

                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    activeStep === step.id
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {step.id}
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 ${
                  activeStep === step.id ? 'text-sky-600' : 'text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className={`font-medium truncate ${
                  activeStep === step.id 
                    ? 'text-sky-900' 
                    : step.completed 
                      ? 'text-gray-700'
                      : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                
              </div>
       
            </div>
             
          ))}
        </div>

        {/* Progress Section */}
        <div className="mt-8 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Resume Completeness:
            </span>
          </div>
          
          <div className="relative flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-right">
                <span className="text-sm font-bold text-sky-600">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
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
            © 2025, Hloom Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
