
import React, { CSSProperties, FC } from "react";
import {useEffect, useState , ReactNode} from "react";

interface Accordion {
  keys?: number;
  divId?: string;
  divDataAccordion?: string;
  accordionBodyClassName?: string;
  titleClassName?: string;
  accordionContent?: string | ReactNode  ;
  accordionContent1?: string | ReactNode | any ;
  divActiveClass?: string;
  ariaLabel?: string;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  accordionTitle?: string | any[] ;
  dataAccordionTarget?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  titleId?: string;
  hideElement?: boolean;
  btnType?: any;
  btnClassName?: string;
  iconClassName?: string;
  iconClassName1?: string;
  clickEvent?: Function;
  isChild?: boolean;
  isSplitted?: boolean;
}

const Accordion: FC<Accordion> = ({
  keys: key,
  divId,
  divDataAccordion,
  accordionTitle,
  accordionContent,
  accordionContent1,
  divActiveClass,
  btnClassName,
  hideElement,
  titleClassName,
  accordionBodyClassName,
  btnType,
  style,
  titleStyle,
  isSplitted = false,
  dataAccordionTarget,
  ariaExpanded = false,
  ariaControls,
  ariaLabel,
  titleId,
  iconClassName,
  iconClassName1,
  clickEvent,
  isChild,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleAccordion = () => {
    console.log("Accordion clicked");
    setExpanded(!expanded);
    clickEvent && clickEvent();
  };


  useEffect(() => {
    setExpanded(ariaExpanded);
  }, [ariaExpanded]);
  return (
    <div
    key={key}
    id={divId || "accordion-color"}
    data-accordion={divDataAccordion || "expanded"}
    className={divActiveClass || `relative ${isSplitted ? " " : "ml-2" } ` }
  >

    <div className={`absolute h-full top-3 ${isChild ? "border-s border-gray-300" : ""}`} style={{ width: "1px" , left:"6px" }}></div>

    <h2 id={titleId || "accordion-color-heading-1"} >
     <div className={"flex flex-items"}>
     <div className="relative ">
            {accordionContent1}
            </div>
     <button
     style={style}
        onClick={toggleAccordion}
        type="button"
        className={btnClassName || "flex items-center justify-between w-full"}
        data-accordion-target={
          dataAccordionTarget || "#accordion-color-body-1"
        }
        aria-expanded={ expanded }
        aria-controls={ariaControls || "accordion-color-body-1"}
      >
        <div className={`flex items-center  ${isSplitted ? " " : "px-2" }`} >
          <span className={titleClassName || "font-bold"} style={titleStyle}>{accordionTitle || "Accordion-1"}</span>
        </div>

        <span hidden={hideElement} className={`px-2`}>
          <i
       
            data-accordion-icon
            aria-hidden="false"
            className={
              expanded
                ? iconClassName || ` fas fa-minus bg-stone-100 text-xs  p-0.5  text-gray-700    `
                : iconClassName1  || `fas fa-plus  bg-stone-100  p-0.5 text-xs   text-gray-700 `
            }
          ></i>
        </span>
      </button>
     
     </div>
    </h2>

    <div
      id={divId || "accordion-color-body-1"}
      className={`relative z-10  overflow-hidden ${
        expanded
          ? "max-h-full opacity-100 transition-all duration-500 ease-out"
          : "max-h-0 opacity-0 transition-all duration-300 ease-in"
      }`}
      aria-labelledby={ariaLabel || "accordion-color-heading-1"}
    >
      <div className={accordionBodyClassName || "block   pl-2"} >      
           {accordionContent}
      </div>
    </div>
  </div>
  );
};

export default Accordion;
