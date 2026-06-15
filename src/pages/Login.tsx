import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    return (
        <div className="container">
            <img src="/logo-crveni.png" alt="Logo" style={{ width: '80px' }} />
            <h1 style={{ fontSize: '40px', marginBottom: '0' }}>Srpski putnik</h1>
            <p>Tvoje sledeće putovanje počinje ovde!</p>
            
            <div className="form-box">
                <p style={{ background: '#e0d4ff', padding: '10px', borderRadius: '5px' }}>
                    Dobro došli na platformu koja vam olakšava planiranje svakog putovanja...
                </p>
                <input 
                    className="input-field" 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className="input-field" 
                    type="password" 
                    placeholder="Lozinka" 
                />
                <p style={{ fontSize: '12px', textAlign: 'right' }}>Zaboravljena lozinka?</p>
                <button className="btn-primary" onClick={() => navigate('/search')}>Prijavi se</button>
                
                <p style={{ marginTop: '20px' }}>Nemate nalog?</p>
                <button className="btn-secondary" onClick={() => navigate('/register')}>Registruj se</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', fontSize: '12px', textAlign: 'left' }}>
                <div>
                    <p><strong>Adresa</strong><br/>Jove Ilića 154, Beograd</p>
                </div>
                <div>
                    <p><strong>Kontakt</strong><br/>putovanja@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default Login;