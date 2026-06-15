import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // POVEZANO: Sada Register vuče stilove direktno iz svog CSS fajla
import Navbar from '../components/Navbar';

// I unutar return-a samo pozoveš:
<Navbar />
const Register = () => {
  const navigate = useNavigate();

  // Tvoj originalni state - čist i bez komplikacija
  const [userData, setUserData] = useState({
    ime: "",
    prezime: "",
    email: "",
    pol: "",
    telefon: "",
    lozinka: "",
    dan: "",
    mesec: "",
    godina: ""
  });

  // handleSubmit napisan jednostavno u tvom stilu, radi bez greške u TS-u
  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Uspešna registracija!");
    navigate("/");
  };

  return (
    <div className="register-page">
      
      {/* Mali logo skroz u gornjem levom uglu */}
      <div className="register-top-left">
        <img src="/logo-crveni.png" alt="logo" className="register-mini-logo" />
      </div>

      {/* Glavni Naslov sa ikonicom */}
      <div className="register-header">
        <h1 className="register-title">
          <span className="user-icon">👤</span> Registracija novog korisnika
        </h1>
        <p className="register-subtitle">
          Registrujte se i olakšajte sebi organizaciju putovanja!
        </p>
      </div>

      {/* Forma podeljena na dve kolone/strane po dizajnu sa slike */}
      <form className="register-form" onSubmit={handleSubmit}>
        
        {/* LEVA STRANA: Lični podaci */}
        <div className="register-left-side">
          
          <div className="register-row-group">
            <div className="input-box">
              <label><span className="doc-icon">📄</span> Ime</label>
              <input
                type="text"
                value={userData.ime}
                onChange={(e) => setUserData({ ...userData, ime: e.target.value })}
              />
            </div>
            <div className="input-box">
              <label>Prezime</label>
              <input
                type="text"
                value={userData.prezime}
                onChange={(e) => setUserData({ ...userData, prezime: e.target.value })}
              />
            </div>
          </div>

          <div className="register-row-group">
            <div className="input-box">
              <label>Pol</label>
              <input
                type="text"
                value={userData.pol}
                onChange={(e) => setUserData({ ...userData, pol: e.target.value })}
              />
            </div>
            <div className="input-box">
              <label>Br. telefona</label>
              <input
                type="text"
                value={userData.telefon}
                onChange={(e) => setUserData({ ...userData, telefon: e.target.value })}
              />
            </div>
          </div>

          <div className="date-section">
            <label className="date-label">Datum rođenja</label>
            <div className="date-row">
              <input
                placeholder="DD"
                value={userData.dan}
                onChange={(e) => setUserData({ ...userData, dan: e.target.value })}
              />
              <input
                placeholder="MM"
                value={userData.mesec}
                onChange={(e) => setUserData({ ...userData, mesec: e.target.value })}
              />
              <input
                placeholder="YYYY"
                value={userData.godina}
                onChange={(e) => setUserData({ ...userData, godina: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* DESNA STRANA: Okvir (Uokvirena bela/siva kutija sa slike) */}
        <div className="register-right-card">
          
          {/* Crveni pečat sa avionom koji "štrči" van ivica kartice */}
          <div className="stamp-badge">
            <img src="/stamp-avion.png" alt="Stamp" /> 
          </div>

          <div className="card-input-box">
            <label>Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>

          <div className="card-input-box">
            <label>Lozinka</label>
            <input
              type="password"
              value={userData.lozinka}
              onChange={(e) => setUserData({ ...userData, lozinka: e.target.value })}
            />
          </div>

          <button type="submit" className="register-btn">
            Registruj se
          </button>

          {/* Prihvati uslove */}
          <div className="terms-box">
            <label htmlFor="terms">Prihvati uslove registracije</label>
            <input type="checkbox" id="terms" />
          </div>
        </div>

      </form>

      {/* DONJI DEO - Sigurnosna poruka sa štitom */}
      <div className="register-footer-security">
        <span className="shield-icon">🛡️</span>
        <p>Svi vaši podaci su bezbedni i koristiće se samo u svrhe rezervacije putovanja</p>
      </div>

    </div>
  );
};

export default Register;
