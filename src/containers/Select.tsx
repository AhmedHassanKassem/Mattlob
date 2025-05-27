

import React, { ReactNode, forwardRef } from 'react';

interface SelectProps {
  className?: string;
  labelClassname?: string;
  forSelectClassName?: string;
  value?: string | number;
  errorMessage?: string;
  name?: string;
  oneValue?: ReactNode;
  value1?: string;
  value2?: string;
  value3?: string;
  label?: string;
  disabled?: boolean;
  id?: string;
  forSelectLabel?: string;
  forSelect?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Use React.forwardRef to forward refs to the underlying <select> element
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  labelClassname,
  value,
  name,
  oneValue,
  value1,
  value2,
  value3,
  disabled = false,
  errorMessage,
  label,
  forSelectLabel,
  forSelect,
  onChange,
}, ref) => {
  return (
    <div className="lg:px-0 px-3">
      {label && (
        <label
          htmlFor={forSelectLabel}
          className={labelClassname || 'block lg:px-0 px-1 text-sm font-bold'}
        >
          {label}
        </label>
      )}
      <select
      disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        // id={"options"}
        className={className || 'option bg-gray-50 border border-gray-900 text-gray-200 text-xs rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'}
        ref={ref}
      >
<option 
  value="" 
  id='option'
  className=" text-sm" 
>
  {forSelect || "choose"}
</option>

        {oneValue || (
          <>
            {value1 && <option value={value1}>{value1}</option>}
            {value2 && <option value={value2}>{value2}</option>}
            {value3 && <option value={value3}>{value3}</option>}
          </>
        )}
      </select>
      <p
        className={`text-red-500 text-sm transition-opacity duration-700 mt-1 ease-in-out ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {errorMessage}
      </p>
    </div>
  );
});
Select.displayName = 'Select';
export default Select;

