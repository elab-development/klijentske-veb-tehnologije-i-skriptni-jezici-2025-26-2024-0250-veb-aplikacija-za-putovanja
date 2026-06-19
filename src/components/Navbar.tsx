import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="search-navbar">
            <div className="nav-logo">
                <img src="/slike/logo.png" alt="Logo" />
            </div>
            <div className="nav-links">
                <span onClick={() => navigate('/reviews')}>Recenzije</span>
                <span onClick={() => navigate('/profile')}>Profil</span>
                <span onClick={() => navigate('/search')}>Putovanja</span>
                <span onClick={() => navigate('/offers')}>Ponude</span>
            </div>
            <div className="nav-buttons">
                <button className="nav-btn-login" onClick={() => navigate('/')}>Prijavi se</button>
                <button className="nav-btn-register" onClick={() => navigate('/register')}>Registruj se</button>
            </div>
        </nav>
    );
};

export default Navbar;