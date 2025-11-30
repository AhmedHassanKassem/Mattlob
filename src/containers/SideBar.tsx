import React, { useEffect, useState } from 'react';
import { FileText, User, GraduationCap, Award, Settings, Check, Download } from 'lucide-react';
import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import { t } from 'i18next';

interface Step {
  id: number;
  title: string;
  link: string;
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
  const isDark = useSelector((state: RootState) => state.isDark.isDark);
  const lang = useSelector((state : RootState)=> state.resumeLang.resumeLang)

useEffect(() => {
  const path = window.location.pathname;

  const stepMap: Record<string, number> = {
    '/build-resume/fill-data': 1,
    '/build-resume/work-history': 2,
    '/build-resume/add-educ': 3,
    '/build-resume/add-skills': 4,
    '/build-resume/add-links': 5,
    '/build-resume/pdf-download': 6,
  };

  const currentStep = stepMap[path] || 1;
  setActiveStep(currentStep)
  const percentage: Record<string, string> = {
    '/build-resume/fill-data': "20%",
    '/build-resume/work-history': "45%",
    '/build-resume/add-educ': "65%",
    '/build-resume/add-skills': "80%",
    '/build-resume/add-links': "95%",

  };

  const currentPer = percentage[path] || "20%";
  setPercent(currentPer);
}, []);


  const steps: Step[] = [
    {
      id: 1,
      title: t('heading' , {lng : lang}),
      link : '/build-resume/fill-data',
      icon: <User size={16} />,
      completed: activeStep > 1
    },
    {
      id: 2,
      title: t('workHistory' , {lng : lang}),
      link : '/build-resume/work-history',
      icon: <FileText size={16} />,
      completed: activeStep > 2
    },
    {
      id: 3,
      title: t('education' , {lng : lang}),
      link : '/build-resume/add-educ',
      icon: <GraduationCap size={16} />,
      completed: activeStep > 3
    },
    {
      id: 4,
      title: t('skills' , {lng : lang}),
      link : '/build-resume/add-skills',
      icon: <Award size={16} />,
      completed: activeStep > 4
    },
  {
      id: 5,
      title: t('links' , {lng : lang}),
      link : '/build-resume/add-links',
      icon: <Download size={16} />,
      completed: activeStep > 6
    },
    {
      id: 6,
      title: t('finalize' , {lng : lang}),
      link : '/build-resume/pdf-download',
      icon: <Settings size={16} />,
      completed: activeStep > 6
    }
  
  ];



return (
      <div
      className={`
        fixed z-50 text-sm transition-all duration-300
        flex flex-row lg:flex-col
        w-full lg:w-60
        lg:h-screen
        top-0 ${lang === "en" ? "left-0" : ""}
        border-b md:border-b-0 md:border-r
        ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-black"}
      `}
    >
      {/* Header */}
      <div className={`p-3 lg:border-b lg:mb-5 ${isDark ? "lg:border-gray-700" : "lg:border-gray-100"}`}>
        <div className="flex justify-center items-center gap-2">
          <img
            src={isDark ? "../../logoWhite.png" : "../../logoBlue.png"}
            alt=""
            className="w-10 md:w-14 lg:w-[60px]"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full md:w-full lg:block flex mx-10 lg:flex-col items-center">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isLastStep = index === steps.length - 1;
          const isCompleted = activeStep > step.id;

          return (
            <div key={step.id} className="flex-1 flex items-center lg:items-start group relative z-10">
              <div className="flex w-full md:w-full lg:w-10 lg:flex-col items-center">
                {/* Circle */}
                <div
                  className={`lg:w-5 lg:h-5 lg:p-0 p-1 w-5 rounded-full lg:border-2 text-xs font-bold flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? "border-sky-600 text-sky-600 shadow-sm shadow-sky-100"
                        : isDark
                        ? "border-gray-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }
                    ${
                      isCompleted
                        ? "border-sky-600 text-white bg-sky-600 scale-110"
                        : isDark
                        ? "bg-gray-800"
                        : "bg-white"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={10} className="text-white" strokeWidth={4} />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Line */}
                {!isLastStep && (
                  <div
                    className={`w-full lg:w-0 lg:h-10 border-t-2 lg:border-l-2 transition-colors duration-300
                      ${
                        isCompleted
                          ? "border-sky-600 border-solid"
                          : isDark
                          ? "border-dashed border-gray-600"
                          : "border-dashed border-gray-400"
                      }
                    `}
                  ></div>
                )}
              </div>

              {/* Title */}
              <div

                className={`hidden lg:block text-sm truncate transition-all duration-200
                  ${
                    isActive
                      ? "font-bold text-sky-500"
                      : isCompleted
                      ? isDark
                        ? "text-gray-300"
                        : "text-gray-700"
                      : isDark
                      ? "text-gray-500"
                      : "text-gray-600"
                  }
                `}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="p-3 mx-2 rounded-lg hidden lg:block">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-medium uppercase tracking-wide hidden md:block ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("resumeComplete" , {lng : lang})}:
          </span>
          <span
            className={`md:hidden text-xs font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {percent}
          </span>
        </div>
        <div className="relative flex items-center gap-2">
          <div
            className={`w-full rounded-full h-1 overflow-hidden ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${percent}` }}
            ></div>
          </div>
          <span className="hidden md:inline-block text-sm font-bold text-sky-500">
            {percent}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`p-3 md:p-6 border-t space-y-2 hidden lg:block ${
          isDark ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="space-y-4">
          {["Terms and Conditions", "Privacy Policy","Contact Us"].map((label, i) => (
            <a
              key={i}
              href="#"
              className={`block text-sm transition-colors duration-200 hover:underline ${
                isDark ? "text-sky-400 hover:text-sky-300" : "text-sky-600 hover:text-sky-800"
              }`}
            >
              {t(label , {lng : lang})}
            </a>
          ))}
        </div>
        <div
          className={`mt-15 text-center ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            {t("© 2025 CV Shop Limited. All rights reserved." , {lng : lang})}
          </p>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="p-2 flex flex-col items-center space-y-1 hidden">
        {[
          { title: "Terms", iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586..." },
          { title: "Contact", iconPath: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0..." },
        ].map((link, i) => (
          <a
            key={i}
            href="#"
            className={`transition-colors duration-200 ${
              isDark ? "text-sky-400 hover:text-sky-300" : "text-sky-600 hover:text-sky-800"
            }`}
            title={link.title}
          ></a>
        ))}
      </div>
    </div>
);
}

export default SideBar;
