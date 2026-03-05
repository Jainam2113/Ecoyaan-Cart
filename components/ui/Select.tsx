import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, required, ...props }, ref) => {
    const uid = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={uid} className="text-sm font-semibold text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={uid}
            required={required}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none rounded-xl border px-4 py-2.5 text-sm text-gray-900 bg-gray-50/70 pr-10 cursor-pointer transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[#1a472a]/30 focus:border-[#1a472a]/50 focus:bg-white",
              error ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-gray-300",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" />
            </svg>
          </div>
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-600 flex items-center gap-1 animate-fade-in">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
