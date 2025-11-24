import { useState, useRef, useEffect, FC } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: (string | Option)[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  buttonClassName?: string;
  menuClassName?: string;
  errorMessage?: string;
}

const ButtonSelect: FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  buttonClassName = "",
  menuClassName = "",
  errorMessage,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 min-w-[150px]  border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-sky-500 transition-all ${buttonClassName}`}
      >
        <span className="truncate">
          {normalizedOptions.find((opt) => opt.value === value)?.label ||
            placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          className={`absolute left-0 mt-1 z-20 bg-white shadow-lg border border-gray-200 rounded-lg max-h-60 overflow-y-auto w-full ${menuClassName}`}
        >
          {normalizedOptions.length > 0 ? (
            normalizedOptions.map((option, i) => (
              <li
                key={i}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-sky-50 transition-colors ${
                  option.value === value ? "bg-sky-100 text-sky-700" : ""
                }`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-sm">
              No options available
            </li>
          )}
        </ul>
      )}

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default ButtonSelect;

