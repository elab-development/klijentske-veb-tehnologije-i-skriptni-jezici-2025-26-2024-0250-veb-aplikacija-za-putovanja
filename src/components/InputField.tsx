interface InputProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, type, value, onChange }: InputProps) => (
    <div style={{ marginBottom: '10px' }}>
        <label>{label}: </label>
        <input type={type} value={value} onChange={onChange} />
    </div>
);
export default InputField;