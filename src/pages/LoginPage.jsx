import React from "react";
import { useState } from "react";
import '../styles/LoginPage.scss';
import 'react-tabs/style/react-tabs.css';
import RegisterForm from '../Components/RegisterForm'
import LoginForm from "../Components/LoginForm";

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState('register');

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="text-container">
            <h1>VÍTEJTE NA STRÁNKÁCH SCALP AND HAIR ACADEMY</h1>
            <p>Po přihlášení do systému budete přesměrování do galerie videí a fotografií z konference Scalp and Hair Academy 2024</p>
        </div>

        <div className="button-group">
          <button 
            className={activeForm === 'register' ? 'active' : ''} 
            onClick={() => setActiveForm('register')}
          >
            Registrovat
          </button>
          <button 
            className={activeForm === 'login' ? 'active' : ''} 
            onClick={() => setActiveForm('login')}
          >
            Přihlásit
          </button>
        </div>
        {activeForm === 'register' && <RegisterForm />}
        {activeForm === 'login' && <LoginForm />}
      </div>
      <div className="image-container">
        <img src="/images/background.png" alt="Scalp and Hair Academy" />
      </div>
    </div>
  );
};

export default LoginPage;
