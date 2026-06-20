import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { useApp } from "../context/AppContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useApp();

  const handleLogin = () => {
    if (!email.trim()) {
      alert("Molimo Vas da unesete email adresu.");
      return;
    }
    // Simple email format check
    if (!email.includes("@")) {
      alert("Molimo Vas da unesete ispravan email.");
      return;
    }
    login(email);
    navigate("/search");
  };

  return (
    <div className="login-page">
      <img
        src="/slike/logo.png"
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

        <InputField
          containerClassName="input-box"
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          containerClassName="input-box"
          className="login-input"
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="login-forgot">
          Zaboravljena lozinka?
        </p>

        <CustomButton
          className="login-btn"
          text="Prijavi se"
          onClick={handleLogin}
        />

        <p className="login-register-text">
          Nemate nalog?
        </p>

        <CustomButton
          className="login-register-btn"
          text="Registruj se"
          onClick={() => navigate("/register")}
        />
      </div>

      <div className="login-footer">
        <div className="footer-col">
          <span className="footer-icon">📍</span>
          <h4>Adresa</h4>
          <p>Jove Ilića 154</p>
          <p>11000 Beograd, Srbija</p>
        </div>

        <div className="footer-col">
          <span className="footer-icon">🕒</span>
          <h4>Radno Vreme</h4>
          <p>Radni dan: 08:00 - 15:00</p>
          <p>Vikend: 08:00 - 12:00</p>
        </div>

        <div className="footer-col">
          <span className="footer-icon">✉️</span>
          <h4>Kontakt</h4>
          <p>putovanja@gmail.com</p>
          <p>+381 61 522 3434</p>
        </div>
      </div>
    </div>
  );
};

export default Login;