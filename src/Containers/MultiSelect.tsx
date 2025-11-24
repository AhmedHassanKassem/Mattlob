import { FC, ReactNode, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { ISkills } from "../Interfaces/interface";

interface MultiProps {
  label?: string;
  name?: string;
  value?: string;
  setValue: (val: string) => void;
  opened: boolean;
  divContent?: ReactNode;
  selectedValuesContent?: ReactNode;
  options?: ISkills[]; // ✅ allow dynamic key access
  labelKey?: string;
  selectedValues: ISkills[];
  loading?: boolean;
  onChange: (e: ISkills[]) => void;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}


const MultiSelectDropdown: FC<MultiProps> = ({
  label,
  selectedValues,
  selectedValuesContent,
  onChange,
  divContent,
  setValue,
  value,
  labelKey,
  options = [],
  loading,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

const handleSelect = (val: ISkills) => {
  const isSelected = safeSelectedValues.includes(val);
  const updatedValues = isSelected
    ? safeSelectedValues.filter((v) => v !== val)
    : [...safeSelectedValues, val];
  onChange(updatedValues);
};

const getDisplayValue = (option: any): string => {
  if (!labelKey) {
    // If no labelKey provided and option is string, return as is
    return typeof option === "string" ? option : "";
  }
  return option?.[labelKey] ?? "";
};

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleFocusOut = () => {
      timeoutId = setTimeout(() => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(document.activeElement)
        ) {
          setValue(""); // Close dropdown
        }
      }, 100);
    };

    const dropdown = dropdownRef.current;
    dropdown?.addEventListener("focusout", handleFocusOut);

    return () => {
      dropdown?.removeEventListener("focusout", handleFocusOut);
      clearTimeout(timeoutId);
    };
  }, [setValue]);

  return (
    <div className="relative font-sans" ref={dropdownRef} tabIndex={-1}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {divContent}

      {value && value.length > 0 && (
        <div className="absolute w-full bg-white text-black shadow-md border border-gray-200 rounded-md mt-1 z-10 max-h-64 overflow-y-auto">
          <div className="p-2">
            {loading ? (
              <div className="text-sm text-center font-semibold text-gray-500 py-2">
                <ScaleLoader color="#0069a8" width={2} height={20} />
              </div>
            ) : options.length > 0 ? (
              options.map((option, index) => {
                 const displayValue = getDisplayValue(option);
                return (
                  <label
                    key={index}
                    className="flex items-center p-2 rounded-md hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex items-center justify-center pl-2 mr-3 gap-2">
                      <input
                        type="checkbox"
                        checked={safeSelectedValues.includes(option)}
                        onChange={() => handleSelect(option)}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded border ${
                          safeSelectedValues.includes(option)
                            ? "bg-sky-700 border-sky-700"
                            : "border-gray-300"
                        }`}
                      >
                        {safeSelectedValues.includes(option) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-800 font-semibold">{displayValue}</span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-center font-bold text-gray-500 py-2">
                Skills not found
              </p>
            )}
          </div>
        </div>
      )}

      <span className="text-gray-800 truncate">
        {selectedValuesContent || "Select skills"}
      </span>
    </div>
  );
};

export default MultiSelectDropdown;

