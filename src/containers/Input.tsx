import { forwardRef } from "react";



interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  type?: string;
  id?: string;
  label?: string;
  htmlContent?: React.ReactNode;
  iconClass?: string;
  labelClass?: string;
  errorMessage?: string;
  placeholderType?: string;
  value?: string | number;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  onKeyPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void; 
  onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void; // Changed to MouseEvent

}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      id,
      label,
      htmlContent,
      labelClass,
      iconClass,
      placeholderType,
      onKeyPressEnter,
      className,
      disabled,
      required = false,
      errorMessage,
      name,
      value,
      onChange,
    },
    ref
  ) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
        onChange(event);
    }
};
  return (
    <div className="lg:px-0 ">
    <div className="flex justify-between  lg:px-0 px-1"> 
    <label htmlFor="some" className={labelClass}>{label}</label>
    {htmlContent}
    </div>
    <i className={iconClass}></i>
<input
  ref={ref}
  id={id}
  name={name}
  {...(value !== undefined ? { value } : {})}
  disabled={disabled}
  required={required}
  type={typeof type !== "undefined" ? type : ""}
  className={className || "text-black hidden"}
  placeholder={placeholderType || ""}
  onKeyDown={onKeyPressEnter}
  onChange={handleChange}
/>

<p
        className={`text-red-500 text-sm transition-opacity duration-700 mt-1 ease-in-out ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {errorMessage}
      </p>      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
