import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <img
        src="/logo-crveni.png"
        alt="Logo"
        className="login-logo"
      />

      <h1 className="login-title">Srpski putnik</h1>

      <p className="login-subtitle">
        Tvoje sledeće putovanje počinje ovde!
      </p>

      <div className="login-form">
        <div className="login-welcome">
          Dobro došli na platformu koja vam olakšava planiranje svakog
          putovanja – od rezervacije putnih aranžmana do pronalaska
          najzanimljivijih atrakcija u gradu.
        </div>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Lozinka"
        />

        <p className="login-forgot">
          Zaboravljena lozinka?
        </p>

        <button
          className="login-btn"
          onClick={() => navigate("/search")}
        >
          Prijavi se
        </button>

        <p className="login-register-text">
          Nemate nalog?
        </p>

        <button
          className="login-register-btn"
          onClick={() => navigate("/register")}
        >
          Registruj se
        </button>
      </div>

      <div className="login-footer">
        <div>
          <h4>Adresa</h4>
          <p>Jove Ilića 154, 11000 Beograd</p>

          <h4>Radno vreme</h4>
          <p>
            Radni dan 08:00 - 15:00
            <br />
            Vikend 08:00 - 12:00
          </p>
        </div>

        <div>
          <h4>Kontakt</h4>
          <p>putovanja@gmail.com</p>
          <p>+381 61 522 3434</p>
        </div>
      </div>
    </div>
  );
};

export default Login;