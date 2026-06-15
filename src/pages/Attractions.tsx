import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css"; // POVEZANO: Vuče sve stilove iz glavnog App.css fajla
import Navbar from '../components/Navbar';

// I unutar return-a samo pozoveš:
<Navbar />

const Attractions = () => {
    const navigate = useNavigate();

    // Jednostavan state za broj osoba, datum i plan koji korisnik menja
    const [brojOsoba, setBrojOsoba] = useState("1");
    const [datum, setDatum] = useState("2026-05-27");
    const [plan, setPlan] = useState("Disneyland + Muzej Luvr");

    const handleRezervacija = () => {
        alert("Uspešno rezervisano!");
    };

    return (
        <div className="attractions-page">
            
            
            {/* 2. GLAVNI NASLOV SA ZAKRIVLJENIM PODNASLOVOM */}
            <div className="attractions-header">
                <h2>Atrakcije grada:</h2>
                <p className="attractions-subtitle">Bilo koji izlet ili atrakciju možeš rezervisati preko nas!</p>
                <div className="slanted-text">Pretraži atrakcije po želji!</div>
            </div>

            {/* 3. FORMA PODELJENA U KARTICE */}
            <div className="attractions-form-wrapper">
                
                {/* LEVA KARTICA: Lokacija, Datum i Plan */}
                <div className="attractions-card">
                    <div className="attractions-input-box">
                        <label>Država:</label>
                        <input type="text" value="Francuska" disabled className="disabled-input" />
                    </div>

                    <div className="attractions-input-box">
                        <label>Grad:</label>
                        <input type="text" value="Pariz" disabled className="disabled-input" />
                    </div>

                    <div className="attractions-input-box">
                        <label>Datum:</label>
                        <select value={datum} onChange={(e) => setDatum(e.target.value)}>
                            <option value="2026-05-27">27.05.2026.</option>
                            <option value="2026-05-28">28.05.2026.</option>
                        </select>
                    </div>

                    <div className="attractions-input-box">
                        <label>Plan:</label>
                        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                            <option value="Disneyland + Muzej Luvr">Disneyland + Muzej Luvr</option>
                            <option value="Ajfelova Kula + Krstarenje Sennom">Ajfelova Kula + Krstarenje Sennom</option>
                        </select>
                    </div>
                </div>

                {/* DESNA KARTICA: Cena i Broj osoba */}
                <div className="attractions-card right-card-align">
                    <div className="attractions-input-box">
                        <label>Cena po osobi:</label>
                        <select disabled className="disabled-select">
                            <option>199e</option>
                        </select>
                    </div>

                    <div className="attractions-input-box">
                        <label>Broj osoba: <span className="people-icon">👥</span></label>
                        <input 
                            type="number" 
                            value={brojOsoba} 
                            onChange={(e) => setBrojOsoba(e.target.value)} 
                            min="1"
                        />
                    </div>
                </div>

            </div>

            {/* 4. DUGMIĆI NA DNU ZA AKCIJU */}
            <div className="attractions-footer-buttons">
                <button className="attractions-reserve-btn" onClick={handleRezervacija}>
                    Rezersiši!
                </button>
                <button className="attractions-special-btn" onClick={() => navigate('/offers')}>
                    Prikaži specijalne ponude!
                </button>
            </div>

        </div>
    );
};

export default Attractions;