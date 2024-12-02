import React, { useState } from 'react';

interface CustomInputGroupProps {
  label: string;
  name: string;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  icon?: string;
  error?: string;
}

const CustomInput: React.FC<CustomInputGroupProps> = ({ label, name, value, onChange, type, icon, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`custom-input ${value !== '' || isFocused ? 'not-empty' : ''} ${error ? 'has-error' : ''}`}>
      <label>{label}</label>
      <div className="input">
        {icon && (
          <i className={`fa-solid ${icon}`} />
        )}
        <input
          type={type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {type === 'password' && (
          <i className="password-toggle-icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
          </i>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
