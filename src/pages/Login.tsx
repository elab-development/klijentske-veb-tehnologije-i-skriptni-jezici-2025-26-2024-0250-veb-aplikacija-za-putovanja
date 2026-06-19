import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
          containerClassName="w-full"
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          containerClassName="w-full"
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
          onClick={() => navigate("/search")}
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