// RadioButton.tsx
import React from 'react';

interface RadioButtonProps {
  id?: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ id, name, value, checked, onChange, label }) => {
  return (
    <div className="flex items-center mb-4 mt-4">
      <input
        id={id}
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
      />
      <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
