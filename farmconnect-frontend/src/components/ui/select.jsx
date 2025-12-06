import React, { useState, createContext, useContext } from "react";

const SelectContext = createContext();

export const Select = ({ children, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (newValue) => {
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value, handleSelect }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className }) => {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span className="block truncate">{value || placeholder}</span>;
};

export const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, className }) => {
  const { handleSelect } = useContext(SelectContext);
  return (
    <div
      onClick={() => handleSelect(value)}
      className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-green-100 hover:text-green-900 ${className}`}
    >
      <span className="block truncate font-normal">{children}</span>
    </div>
  );
};
