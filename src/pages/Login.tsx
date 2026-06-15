import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if(email && pass) {
            navigate('/search');
        } else {
            alert("Popunite polja!");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Srpski putnik - Prijava</h1>
            <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Lozinka" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <CustomButton text="Prijavi se" type="submit" />
        </form>
    );
};

export default Login;