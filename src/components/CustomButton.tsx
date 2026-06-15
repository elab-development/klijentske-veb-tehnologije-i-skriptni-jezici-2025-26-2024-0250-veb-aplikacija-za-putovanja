import React from 'react';
import "../App.css";

interface CustomButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onClick, className, type = "button" }) => {
    return (
        <button type={type} className={`search-action-btn ${className || ''}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default CustomButton;