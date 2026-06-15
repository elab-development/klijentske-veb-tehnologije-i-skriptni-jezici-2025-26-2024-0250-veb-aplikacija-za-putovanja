import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const Register = () => {
    const [userData, setUserData] = useState({ ime: '', prezime: '', email: '', lozinka: '' });
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (userData.email && userData.lozinka) {
            alert("Uspešna registracija!");
            navigate('/');
        }
    };

    return (
        <div className="container">
            <h1>Registracija novog korisnika</h1>
            <form onSubmit={handleRegister}>
                <InputField label="Ime" type="text" value={userData.ime} onChange={(e) => setUserData({...userData, ime: e.target.value})} />
                <InputField label="Prezime" type="text" value={userData.prezime} onChange={(e) => setUserData({...userData, prezime: e.target.value})} />
                <InputField label="Email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                <InputField label="Lozinka" type="password" value={userData.lozinka} onChange={(e) => setUserData({...userData, lozinka: e.target.value})} />
                <CustomButton text="Registruj se" type="submit" />
            </form>
        </div>
    );
};
export default Register;