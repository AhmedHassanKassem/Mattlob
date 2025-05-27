;


interface InputProps {
  type?: string;
  id?: string;
  buttonName?: string;
  buttonNameClass?: string;
  label?: string;
  htmlContent?: React.ReactNode;
  iconClass?: string;
  labelClass?: string;
  placeholderType?: string;
  value?: string | number;
  name?: string;
  mode?: any;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectedFileName?: string;
  onChange?: (file: File | null) => void;
  onClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const File: React.FC<InputProps> = ({
  id,
  label,
  labelClass,
  buttonName,
  buttonNameClass,
  disabled = false,
  required = true,
  selectedFileName,
  className,
  name,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (onChange) {
      onChange(file); // Pass the file (or null) up to the parent component
    }
  };

  return (
    <div className="lg:px-0 px-3">
      <div className="flex flex-col justify-between">
        <label htmlFor={id} className={labelClass || "mb-3"}>
          {label}
        </label>
        <input
        accept="application/pdf"
          disabled={disabled}
          id={id}
          name={name}
          required={required}
          type="file" // Ensure it's a file input
          className={className || "hidden mt-10"}
          onChange={handleChange} // Correctly handle file change
        />
        
        <label
          htmlFor={id}
          className={`border p-1 rounded flex`}
        >
          <p className={`cursor-pointer ${
            buttonNameClass ||
            " bg-[#718096] max-w-[130px] text-center text-sm rounded text-white p-2 border"
          } `}>{buttonName}</p>
          <p className="text-xs flex items-center pl-2">
          {selectedFileName || "No selected file"}
        </p>
        </label>
      </div>
    </div>
  );
};

export default File;
