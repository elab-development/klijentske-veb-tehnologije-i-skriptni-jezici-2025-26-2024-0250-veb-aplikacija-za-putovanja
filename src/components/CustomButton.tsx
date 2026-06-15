interface ButtonProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
}

const CustomButton = ({ text, onClick, type = "button" }: ButtonProps) => (
    <button onClick={onClick} type={type} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {text}
    </button>
);
export default CustomButton;