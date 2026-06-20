import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { useApp } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { profile, isAuthenticated, logout } = useApp();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Preuzmi samo prvo ime za lepši izgled u nav baru
    const imeZaPrikaz = profile?.ime ? profile.ime.split(' ')[0] : "Putnik";

    return (
        <nav className="search-navbar">
            <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/search')}>
                <img src="/slike/logo.png" alt="Logo" />
            </div>
            <div className="nav-links">
                <span onClick={() => navigate('/search')}>Putovanja</span>
                <span onClick={() => navigate('/offers')}>Ponude</span>
                <span onClick={() => navigate('/reviews')}>Recenzije</span>
                <span onClick={() => navigate('/profile')}>Profil ({imeZaPrikaz})</span>
            </div>
            <div className="nav-buttons">
                {isAuthenticated ? (
                    <button className="nav-btn-login" onClick={handleLogout}>Odjavi se ➔</button>
                ) : (
                    <>
                        <button className="nav-btn-login" onClick={() => navigate('/')}>Prijavi se</button>
                        <button className="nav-btn-register" onClick={() => navigate('/register')}>Registruj se</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;