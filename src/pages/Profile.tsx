import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css"; // POVEZANO: Vuče sve stilove iz glavnog App.css fajla

const Profile = () => {
    const navigate = useNavigate();

    // Tvoj niz sa sačuvanim lokacijama sa slike
    const wishlist = [
        "Barselona - Španija",
        "Pariz - Francuska",
        "Rim - Italija",
        "Atina - Grčka"
    ];

    return (
        <div className="profile-page">
            
            {/* 1. NAVBAR GORE (Isti kao na Search stranici) */}
            <nav className="search-navbar">
                <div className="nav-logo">
                    <img src="/logo-crveni.png" alt="Logo" />
                </div>
                <div className="nav-links">
                    <span onClick={() => navigate('/reviews')}>Recenzije</span>
                    <span onClick={() => navigate('/profile')}>Profil</span>
                    <span onClick={() => navigate('/my-trips')}>Putovanja</span>
                    <span onClick={() => navigate('/offers')}>Ponude</span>
                </div>
                <div className="nav-buttons">
                    <button className="nav-btn-login" onClick={() => navigate('/')}>Prijavi se</button>
                    <button className="nav-btn-register" onClick={() => navigate('/register')}>Registruj se</button>
                </div>
            </nav>

            {/* 2. GLAVNI SADRŽAJ PROFILA */}
            <div className="profile-container">
                
                {/* Leva kolona: Naslov i velika ikona */}
                <div className="profile-left-hero">
                    <h1 className="profile-main-title">Profil</h1>
                    <div className="profile-avatar-box">
                        <span className="profile-avatar-icon">👤</span>
                    </div>
                </div>

                {/* Desna strana: Podaci podeljeni u kolone */}
                <div className="profile-data-wrapper">
                    
                    {/* Kolona 1: Lični podaci */}
                    <div className="profile-data-column">
                        <h3>Lični podaci</h3>
                        <div className="profile-info-field">Anja</div>
                        <div className="profile-info-field">Ž</div>
                        <div className="profile-info-field">23.05.2005.</div>
                        <div className="profile-info-field">+381635492851</div>
                    </div>

                    {/* Kolona 2: Podaci o profilu i kartici */}
                    <div className="profile-data-column">
                        <h3>Podaci o profilu</h3>
                        <div className="profile-info-field email-field">anjakaradzic@gmail.com</div>
                        <p className="profile-reg-date">Registrovan/a od 2023.</p>

                        <h3 className="card-title-margin">Podaci o kartici</h3>
                        <div className="profile-info-field">**** **** **** 6543</div>
                    </div>

                </div>
            </div>

            {/* 3. WISHLIST SEKCIJA */}
            <div className="wishlist-section">
                <h2>Wishlist</h2>
                <p className="wishlist-subtitle">Sačuvane lokacije:</p>
                
                <div className="wishlist-list">
                    {wishlist.map((item, index) => (
                        <div key={index} className="wishlist-item">
                            <span className="heart-icon">♡</span> {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. DUGMIĆI NA DNU DESNO */}
            <div className="profile-footer-buttons">
                <button className="profile-edit-btn" onClick={() => alert("Izmena profila u izradi...")}>
                    Izmenite profil
                </button>
                <button className="profile-logout-btn" onClick={() => navigate('/')}>
                    Odjavi se
                </button>
            </div>

        </div>
    );
};

export default Profile;