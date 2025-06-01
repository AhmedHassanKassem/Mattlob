

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
  <div>
    <div className="min-h-[1.50rem] mb-1">
      {label && (
        <label htmlFor={forSelectLabel} className={labelClassname}>
          {label}
        </label>
      )}
    </div>

    <select
      disabled={disabled}
      name={name}
      value={value}
      onChange={onChange}
      className={className || '...default classes...'}
      ref={ref}
    >
      <option value="" id="option" className="text-sm">
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

    <p className={`text-red-500 text-sm mt-1 ${errorMessage ? 'opacity-100' : 'opacity-0'}`}>
      {errorMessage}
    </p>
  </div>
</div>

  );
});
Select.displayName = 'Select';
export default Select;

