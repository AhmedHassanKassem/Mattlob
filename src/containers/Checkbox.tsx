


import { CSSProperties,  forwardRef } from "react";

interface CheckboxProps {
  value?: string;
  label?: string[] | any;
  label2?: string[] | any;
  checkBoxContent?: string | React.ReactNode;
  name?: string;
  style? : CSSProperties
  checked?: boolean;
  hideElement?: boolean;
  isLast?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelClassName?: string;
  labelClassName2?: string;
}

const CheckBoxInput= forwardRef<HTMLInputElement, CheckboxProps>(({
  value,
  className,
  checked=false,
  checkBoxContent,
  onChange,
  name,
  label,
  label2,
  labelClassName,
  labelClassName2,
  style,
}, ref) => {
  return (
    <>
  <div className={className ||"flex items-center lg:justify-evenly justify-center" }>
 
      {/* <div className="relative flex items-center justify-center">  */}
        <label htmlFor={name} className={labelClassName || "cursor-pointer"} style={style}>
        {label || checkBoxContent}
      </label>
        <input
          name={name}
          type="checkbox"
          value={value}
          defaultChecked={checked}
          className={ "text-blue-600 bg-blue-100 border-blue-300 rounded dark:bg-blue-700 dark:border-blue-600"}
          onChange={onChange}
          ref={ref}
        />
 <label htmlFor={name} className={labelClassName2 || "cursor-pointer"} style={style}>
        {label2}
      </label>
      {/* </div>  */}
     
    </div>







    
    </>
  );
});
CheckBoxInput.displayName = 'CheckBoxInput';

export default CheckBoxInput;
