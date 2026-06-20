import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { useApp } from "../context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useApp();

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.ime.trim() || !userData.email.trim()) {
      alert("Ime i E-mail su obavezna polja!");
      return;
    }
    // Set default values if date inputs are missing
    const yyyy = userData.godina.trim() || "2005";
    const mm = userData.mesec.trim().padStart(2, '0') || "05";
    const dd = userData.dan.trim().padStart(2, '0') || "23";
    const rodjenjeStr = `${yyyy}-${mm}-${dd}`;

    registerUser({
      ime: `${userData.ime} ${userData.prezime}`.trim(),
      pol: userData.pol || "Ž",
      telefon: userData.telefon || "+381635492851",
      email: userData.email,
      rodjenje: rodjenjeStr
    });
    alert("Uspešna registracija!");
    navigate("/search");
  };

  return (
    <div className="register-page">
      
      {/* Mali logo skroz u gornjem levom uglu */}
      <div className="register-top-left">
        <img src="/slike/logo.png" alt="logo" className="register-mini-logo" />
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
            <InputField
              containerClassName="input-box"
              label={<><span className="doc-icon">📄</span> Ime</>}
              type="text"
              value={userData.ime}
              onChange={(e) => setUserData({ ...userData, ime: e.target.value })}
            />
            <InputField
              containerClassName="input-box"
              label="Prezime"
              type="text"
              value={userData.prezime}
              onChange={(e) => setUserData({ ...userData, prezime: e.target.value })}
            />
          </div>

          <div className="register-row-group">
            <InputField
              containerClassName="input-box"
              label="Pol"
              type="text"
              value={userData.pol}
              onChange={(e) => setUserData({ ...userData, pol: e.target.value })}
            />
            <InputField
              containerClassName="input-box"
              label="Br. telefona"
              type="text"
              value={userData.telefon}
              onChange={(e) => setUserData({ ...userData, telefon: e.target.value })}
            />
          </div>

          <div className="date-section">
            <label className="date-label">Datum rođenja</label>
            <div className="date-row">
              <InputField
                containerClassName="date-row-offset"
                type="text"
                placeholder="DD"
                value={userData.dan}
                onChange={(e) => setUserData({ ...userData, dan: e.target.value })}
              />
              <InputField
                containerClassName="date-row-offset"
                type="text"
                placeholder="MM"
                value={userData.mesec}
                onChange={(e) => setUserData({ ...userData, mesec: e.target.value })}
              />
              <InputField
                containerClassName="date-row-offset"
                type="text"
                placeholder="YYYY"
                value={userData.godina}
                onChange={(e) => setUserData({ ...userData, godina: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* DESNA STRANA: Okvir (Uokvirena bela/siva kutija sa slike) */}
        <div className="register-right-card">
          


          <InputField
            containerClassName="card-input-box"
            label="Email"
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />

          <InputField
            containerClassName="card-input-box"
            label="Lozinka"
            type="password"
            value={userData.lozinka}
            onChange={(e) => setUserData({ ...userData, lozinka: e.target.value })}
          />

          <CustomButton type="submit" className="register-btn" text="Registruj se" />

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
