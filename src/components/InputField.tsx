import React from 'react';
import "../App.css";

interface InputFieldProps {
    label?: string;
    type: string;
    placeholder?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, value, onChange, disabled, className }) => {
    return (
        <div className="search-input-box">
            {label && <label>{label}</label>}
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                className={className}
            />
        </div>
    );
};

export default InputField;