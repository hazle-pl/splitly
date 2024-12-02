import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string, name: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, name, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
  };

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue, name);
    setSelectedValue(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className={`custom-dropdown ${selectedValue || isOpen ? 'not-empty' : ''}`} ref={dropdownRef}>
      <label>{label}</label>
      <div className={`dropdown ${isOpen ? 'open' : ''}`}>
        <div className={`selected-option ${isFocused ? 'focused' : ''}`} onClick={toggleDropdown}>
          {options.find((option) => option.value === selectedValue)?.label}
          <i className="fa-solid fa-chevron-down"/>
        </div>
        <ul className="dropdown-list">
          {options.map((option) => (
            <li key={option.value} onClick={() => handleSelectOption(option.value)}>
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomDropdown;
