import React, { createContext, useContext } from "react";

// Create a "Context" to share the Open/Closed state
const DialogContext = createContext({
  open: false,
  onOpenChange: () => {},
});

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children, asChild }) => {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <div onClick={() => onOpenChange(true)} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
};

export const DialogContent = ({ children, className }) => {
  const { open, onOpenChange } = useContext(DialogContext);
  
  // CRITICAL FIX: If 'open' is false, render NOTHING.
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
      {/* Clicking the dark background also closes the modal */}
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        {/* Close 'X' Button */}
        <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
            ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="mb-6 border-b pb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);