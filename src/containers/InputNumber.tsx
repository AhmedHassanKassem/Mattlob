
;

interface InputProps {
  type?: 'number' | 'text';
  placeholderType?: string;
  onChange?: (value: number) => void; // Adjusted type to expect a number
  value?: number;
  name? : string;
  label? : string;
  className?: string;
  labelClassName?: string;
}

const InputNumber: React.FC<InputProps> = ({
  type = 'number',
  placeholderType,
  onChange,
  value,
  className,
  labelClassName,
  label,
  name
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(event.target.value);
    if (!isNaN(inputValue) && onChange) {
      onChange(inputValue);
    }
  };

  // const inputType = type === 'number' ? 'number' : 'text';

  return (
    <><label className={labelClassName} htmlFor="">{label}</label><input
      type={type}
      name={name}
      className={className || "text-black"}
      placeholder={placeholderType || ""}
      onChange={handleChange}
      value={value} /></>
  );
};

export default InputNumber;
