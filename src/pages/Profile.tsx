import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { TripCalculator } from '../models/TripModels';

interface IBooking {
    id: number;
    destinacija: string;
    grad: string;
    datum: string;
    plan: string;
    brojOsoba: number;
    dodaci: string[];
    ukupnaCena: number;
    datumRezervacije: string;
}

interface IProfileData {
    ime: string;
    pol: string;
    datumRodjenja: string;
    telefon: string;
    email: string;
    kartica: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const { profile, wishlist, bookings, updateProfile, cancelBooking, toggleWishlist } = useApp();

    // Profile Edit Panel local States (Functionality 6)
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<IProfileData>(profile);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Synchronize local edit state with global profile state on context updates
    useEffect(() => {
        setProfileData(profile);
    }, [profile]);

    // FUNCTIONALITY 6: Schema Validators for forms
    const validateForm = (data: IProfileData) => {
        const errors: { [key: string]: string } = {};

        // Name check: no numbers, minimum length 2
        if (!data.ime.trim()) {
            errors.ime = "Ime ne sme biti prazno.";
        } else if (/\d/.test(data.ime)) {
            errors.ime = "Ime ne sme sadržati brojeve.";
        } else if (data.ime.length < 2) {
            errors.ime = "Ime mora imati bar 2 karaktera.";
        }

        // Email check: Standard Regex format matching
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            errors.email = "E-mail adresa je obavezna.";
        } else if (!emailRegex.test(data.email)) {
            errors.email = "Unesite ispravnu e-mail adresu (npr. ime@primer.com).";
        }

        // Phone check: +xxxx or standard format
        if (!data.telefon.trim()) {
            errors.telefon = "Broj telefona je obavezan.";
        } else if (!/^\+?[0-9\s\-]{6,15}$/.test(data.telefon)) {
            errors.telefon = "Unesite ispravan broj telefona (npr. +3816XXXXXXXX).";
        }

        // Card number check: 16 digits format
        const cleanCard = data.kartica.replace(/\s+/g, '');
        if (!data.kartica.trim()) {
            errors.kartica = "Broj platne kartice je obavezan.";
        } else if (cleanCard.length !== 16 || isNaN(Number(cleanCard))) {
            errors.kartica = "Kartica mora imati tačno 16 cifara.";
        }

        return errors;
    };

    const handleFormChange = (polje: keyof IProfileData, vrednost: string) => {
        const noviPodaci = { ...profileData, [polje]: vrednost };
        setProfileData(noviPodaci);

        // Instant validation on fly
        const greske = validateForm(noviPodaci);
        setFormErrors(prev => ({
            ...prev,
            [polje]: greske[polje] || ""
        }));
    };

    const handleSacuvajProfil = () => {
        const greske = validateForm(profileData);
        if (Object.keys(greske).length > 0) {
            setFormErrors(greske);
            alert("Molimo Vas da ispravite greške u formi pre čuvanja!");
            return;
        }

        updateProfile(profileData);
        setIsEditing(false);
        setFormErrors({});
        alert("Podaci na Vašem profilu su uspešno ažurirani.");
    };

    // FUNCTIONALITY 2: Remove single item from wishlist
    const handleRemoveFromWishlist = (item: string) => {
        const parts = item.split(' - ');
        if (parts.length >= 2) {
            toggleWishlist(parts[0].trim(), parts[1].trim());
        } else {
            toggleWishlist(item, "");
        }
    };

    // FUNCTIONALITY 5: Cancel specific booking
    const handleCancelBooking = (bookingId: number, grad: string) => {
        if (window.confirm(`Da li ste sigurni da želite da otkažete rezervaciju izleta za grad ${grad}?`)) {
            cancelBooking(bookingId);
            alert("Rezervacija je uspešno otkazana. Novac će biti vraćen na Vašu povezanu karticu.");
        }
    };

    return (
        <div className="profile-page" id="profile-page-root">
            <Navbar />
            
            {/* GLAVNI SADRŽAJ PROFILA */}
            <div className="profile-container" id="profile-info-dashboard">
                
                {/* Leva kolona: Naslov i velika ikona */}
                <div className="profile-left-hero" id="profile-card-hero">
                    <h1 className="profile-main-title">Korisnički Nalog</h1>
                    <div className="profile-avatar-box">
                        <span className="profile-avatar-icon">👤</span>
                    </div>
                    <span className="status-badge-online">● AKTIVAN PROFIL</span>
                </div>

                {/* Desna strana: Podaci podeljeni u kolone ili Formular za izmenu */}
                <div className="profile-data-wrapper" id="profile-data-form-box">
                    {!isEditing ? (
                        <>
                            {/* Kolona 1: Lični podaci (Pristin read mode) */}
                            <div className="profile-data-column">
                                <h3>Lični podaci</h3>
                                <div className="profile-info-label">Ime i prezime:</div>
                                <div className="profile-info-field">{profileData.ime}</div>
                                
                                <div className="profile-info-label">Pol:</div>
                                <div className="profile-info-field">{profileData.pol === "M" ? "Muški" : "Ženski"}</div>
                                
                                <div className="profile-info-label">Datum rođenja:</div>
                                <div className="profile-info-field">
                                    {new Date(profileData.datumRodjenja).toLocaleDateString('sr-RS')}
                                </div>
                            </div>

                            {/* Kolona 2: Podaci o nalogu i kartici */}
                            <div className="profile-data-column">
                                <h3>Podaci o profilu</h3>
                                <div className="profile-info-label">E-mail adresa:</div>
                                <div className="profile-info-field email-field">{profileData.email}</div>
                                <p className="profile-reg-date">Član turističke zajednice od 2023.</p>

                                <h3 className="card-title-margin">Način plaćanja</h3>
                                <div className="profile-info-label">Povezana kartica:</div>
                                <div className="profile-info-field">
                                    💳 **** **** **** {profileData.kartica.trim().slice(-4)}
                                </div>
                            </div>
                        </>
                    ) : (
                        // FUNCTIONALITY 6 Interactive Edit Panel with dynamic validation
                        <div className="profile-edit-form-full">
                            <h3 style={{ borderBottom: '1.5px solid #eae8e4', paddingBottom: '8px', marginBottom: '16px' }}>Izmenite lične informacije</h3>
                            
                            <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                
                                <div className="edit-input-group">
                                    <label>Ime i prezime:</label>
                                    <input 
                                        type="text" 
                                        value={profileData.ime} 
                                        onChange={(e) => handleFormChange('ime', e.target.value)}
                                        className={formErrors.ime ? "input-validate-error" : ""}
                                    />
                                    {formErrors.ime && <span className="validator-error-text">{formErrors.ime}</span>}
                                </div>

                                <div className="edit-input-group">
                                    <label>Pol:</label>
                                    <select 
                                        value={profileData.pol} 
                                        onChange={(e) => handleFormChange('pol', e.target.value)}
                                    >
                                        <option value="Ž">Ženski</option>
                                        <option value="M">Muški</option>
                                    </select>
                                </div>

                                <div className="edit-input-group">
                                    <label>Datum rođenja:</label>
                                    <input 
                                        type="date" 
                                        value={profileData.datumRodjenja} 
                                        onChange={(e) => handleFormChange('datumRodjenja', e.target.value)}
                                    />
                                </div>

                                <div className="edit-input-group">
                                    <label>Broj mobilnog telefona:</label>
                                    <input 
                                        type="text" 
                                        value={profileData.telefon} 
                                        onChange={(e) => handleFormChange('telefon', e.target.value)}
                                        className={formErrors.telefon ? "input-validate-error" : ""}
                                    />
                                    {formErrors.telefon && <span className="validator-error-text">{formErrors.telefon}</span>}
                                </div>

                                <div className="edit-input-group">
                                    <label>E-mail adresa:</label>
                                    <input 
                                        type="text" 
                                        value={profileData.email} 
                                        onChange={(e) => handleFormChange('email', e.target.value)}
                                        className={formErrors.email ? "input-validate-error" : ""}
                                    />
                                    {formErrors.email && <span className="validator-error-text">{formErrors.email}</span>}
                                </div>

                                <div className="edit-input-group">
                                    <label>Broj platne kartice:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Forma: **** **** **** ****"
                                        value={profileData.kartica} 
                                        onChange={(e) => handleFormChange('kartica', e.target.value)}
                                        className={formErrors.kartica ? "input-validate-error" : ""}
                                    />
                                    {formErrors.kartica && <span className="validator-error-text">{formErrors.kartica}</span>}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DUGMIĆI ZA PROFIL */}
            <div className="profile-footer-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', maxWidth: '1000px', margin: '16px auto', padding: '0 40px' }}>
                {!isEditing ? (
                    <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                        Izmenite profil ⚙️
                    </button>
                ) : (
                    <>
                        <button className="profile-logout-btn" onClick={() => { setIsEditing(false); setFormErrors({}); }} style={{ background: '#ccc', color: '#1e1e1e' }}>
                            Otkaži
                        </button>
                        <button className="profile-edit-btn" onClick={handleSacuvajProfil}>
                            Sačuvaj izmene ✓
                        </button>
                    </>
                )}
                <button className="profile-logout-btn" onClick={() => navigate('/')}>
                    Odjavi se
                </button>
            </div>

            {/* FUNCTIONALITY 5: ACTIVES BOOKINGS & EXCURSIONS DASHBOARD */}
            <div className="bookings-dashboard-section" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 40px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '26px', borderBottom: '2.5px solid #eae8e4', paddingBottom: '10px', marginBottom: '14px' }}>
                    Moje rezervacije (Aktivni izleti)
                </h2>
                
                {bookings.length === 0 ? (
                    <div className="empty-bookings-box" style={{ background: '#faf9f6', border: '1.5px dashed #cfccc4', padding: '30px', borderRadius: '14px', textAlign: 'center' }}>
                        <p style={{ color: '#6e6b64', marginBottom: '14px' }}>Trenutno nemate aktivnih rezervacija za izlete ili gradske atrakcije.</p>
                        <button className="profile-edit-btn" onClick={() => navigate('/attractions')} style={{ fontSize: '13px' }}>
                            Prilagodi plan i rezerviši prvu avanturu! ➔
                        </button>
                    </div>
                ) : (
                    <div className="bookings-active-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {bookings.map((booking) => (
                            <div key={booking.id} className="active-booking-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1.5px solid #eae8e4', borderRadius: '14px', padding: '18px' }}>
                                <div className="booking-details-left">
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#cf4638', background: '#fdf0ee', padding: '4px 8px', borderRadius: '6px' }}>
                                        POTVRĐENA REZERVACIJA
                                    </span>
                                    <h4 style={{ fontSize: '20px', margin: '8px 0 4px 0', fontFamily: 'Playfair Display', fontWeight: 700 }}>
                                        {booking.grad}, {booking.destinacija}
                                    </h4>
                                    <p style={{ fontSize: '13.5px', color: '#55534e', margin: '0' }}>
                                        <strong>Odabrani program:</strong> {booking.plan}
                                    </p>
                                    <p style={{ fontSize: '13px', color: '#6e6b64', marginTop: '6px' }}>
                                        🗓️ <strong>Planirano za:</strong> {booking.datum} | 👥 <strong>Broj putnika:</strong> {booking.brojOsoba} osoba
                                    </p>

                                    {booking.dodaci && booking.dodaci.length > 0 && (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                            {booking.dodaci.map((dod, idx) => (
                                                <span key={idx} style={{ fontSize: '11.5px', background: '#faf9f6', border: '1px solid #eae8e4', padding: '2px 8px', borderRadius: '12px', color: '#55534e' }}>
                                                    ✓ {dod}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="booking-details-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#a19e95' }}>Plaćena cena (sa porezom):</span>
                                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '22px', fontWeight: 'bold', color: '#1e1e1e', margin: '2px 0 10px 0' }}>
                                        {TripCalculator.formatirajCenu(booking.ukupnaCena)}
                                    </span>
                                    <button 
                                        className="profile-logout-btn" 
                                        onClick={() => handleCancelBooking(booking.id, booking.grad)}
                                        style={{ fontSize: '12px', padding: '6px 12px', height: 'auto', background: '#fdf0ee', border: '1px solid #f6d1cc', color: '#cf4638' }}
                                    >
                                        Otkaži rezervaciju ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. WISHLIST SEKCIJA */}
            <div className="wishlist-section" id="wishlist-dashboard-section">
                <h2>Omiljene destinacije (Wishlist)</h2>
                <p className="wishlist-subtitle">Kliknite na srce kako biste uklonili sačuvanu lokaciju:</p>
                
                {wishlist.length === 0 ? (
                    <div className="empty-wishlist-box" style={{ background: '#faf9f6', padding: '20px', borderRadius: '10px', textAlign: 'center', color: '#6e6b64' }}>
                        Nema sačuvanih lokacija. Kliknite na srce ponude na strani Ponude!
                    </div>
                ) : (
                    <div className="wishlist-list" id="wishlist-items-box">
                        {wishlist.map((item, index) => (
                            <div key={index} className="wishlist-item" id={`wishlist-badge-${index}`}>
                                <span 
                                    className="heart-icon icon-saved" 
                                    style={{ cursor: 'pointer', color: '#cf4638', marginRight: '8px' }}
                                    onClick={() => handleRemoveFromWishlist(item)}
                                    title="Ukloni iz omiljenih"
                                >
                                    ❤️
                                </span> 
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Profile;