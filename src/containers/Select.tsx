

import React, { ReactNode, forwardRef } from 'react';
import { t } from 'i18next';

interface SelectProps {
  className?: string;
  labelClassname?: string;
  labelDivClassname?: string;
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
  labelDivClassname,
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
  <div className="w-full">
    <div className={labelDivClassname || "h-[1.5rem]"}>
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
      className={
        className ||
        'w-full border border-gray-300 rounded px-2.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
      }
      ref={ref}
    >
      <option value="">{forSelect || t('Choose')}</option>
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
);

});
Select.displayName = 'Select';
export default Select;

