import React from 'react';
import "../App.css";

interface InputFieldProps {
    label?: React.ReactNode;
    type: string;
    placeholder?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    type, 
    placeholder, 
    value, 
    onChange, 
    disabled, 
    className,
    containerClassName = "search-input-box"
}) => {
    return (
        <div className={containerClassName}>
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