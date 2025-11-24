
import { CSSProperties, forwardRef } from "react";

// Checkbox Component
interface CheckboxProps {
  value?: string;
  label?: string[] | any;
  label2?: string[] | any;
  checkBoxContent?: string | React.ReactNode;
  name?: string;
  style?: CSSProperties;
  checked?: boolean;
  hideElement?: boolean;
  isLast?: boolean;
  onChange?: (e: any) => void;
  className?: string;
  labelClassName?: string;
  labelClassName2?: string;
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string; // Background color when checked
  checkColor?: string; // Color of the checkmark
  borderColor?: string; // Border color
}

const CheckboxAdvanced = forwardRef<HTMLInputElement, CheckboxProps>(({

  className,
  checked = false,
  checkBoxContent,
  onChange,
  name,
  label,
  label2,
  labelClassName,
  labelClassName2,
  style,
  size = 'md',
  bgColor = '#3b82f6',
  checkColor = '#ffffff',
//   borderColor = '#d1d5db',
}, ref) => {

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={className || "flex items-center gap-1 py-1"} style={style}>


      <div className="relative">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
           onChange={(e) => {
    if (onChange) onChange(e.target.checked); // ✅ pass boolean to parent
  }}
          readOnly
          ref={ref}
          className="sr-only"
        />
        <div 
          className={`
            ${sizeClasses[size]} 
             border cursor-pointer 
            flex items-center justify-center
            transition-colors duration-200
          `}
          style={{
            backgroundColor: checked ? bgColor : '#ffffff',
            borderColor: checked ? bgColor : "#000000",
          }}
          onClick={() => {
            const input = document.getElementById(name!) as HTMLInputElement;
            input?.click();
          }}
        >
          {checked && (
            <svg 
              className={iconSizes[size]}
              style={{ color: checkColor }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label 
          htmlFor={name} 
          className={labelClassName || `cursor-pointer ${textSizeClasses[size]} text-gray-700 font-medium`}
        >
          {label}
        </label>
      )}
      {label2 && (
        <label 
          htmlFor={name} 
          className={labelClassName2 || `cursor-pointer ${textSizeClasses[size]} text-gray-700 font-medium`}
        >
          {label2}
        </label>
      )}
      
      {checkBoxContent && !label && !label2 && (
        <label 
          htmlFor={name} 
          className={`cursor-pointer ${textSizeClasses[size]} text-gray-700 font-medium`}
        >
          {checkBoxContent}
        </label>
      )}
    </div>
  );
});

CheckboxAdvanced.displayName = 'CheckBoxInput';

export default CheckboxAdvanced;