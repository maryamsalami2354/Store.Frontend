// src/components/common/customSelect/customSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'react-feather';

const CustomSelect = ({
                          options = [],
                          value,
                          onChange,
                          placeholder = 'انتخاب کنید',
                          disabled = false,
                          className = ''
                      }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || null;

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-between py-2.5 px-4 rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-900
          text-sm text-right
          focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6]
          focus:border-transparent focus:outline-none
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
            >
        <span className={selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
                <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400 dark:text-gray-500`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    <div ref={menuRef} className="overflow-y-auto py-1 max-h-52" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                                        isSelected
                                            ? 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {option.label}
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-[#002874] dark:text-[#4C6FB6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;