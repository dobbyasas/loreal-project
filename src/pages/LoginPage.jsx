import React, { useState, useEffect, useRef } from "react";
import RegisterForm from '../Components/RegisterForm';
import LoginForm from "../Components/LoginForm";
import '../styles/LoginPage.scss';

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState('register');
  const buttonGroupRef = useRef(null);

  useEffect(() => {
    const updateBorder = () => {
      const buttons = buttonGroupRef.current.querySelectorAll('button');
      const activeButton = buttonGroupRef.current.querySelector('.active');
      if (activeButton) {
        const borderLeft = activeButton.offsetLeft + 'px';
        const borderWidth = activeButton.offsetWidth + 'px';
        buttonGroupRef.current.style.setProperty('--border-left', borderLeft);
        buttonGroupRef.current.style.setProperty('--border-width', borderWidth);
      }
    };

    updateBorder();
    window.addEventListener('resize', updateBorder);
    return () => window.removeEventListener('resize', updateBorder);
  }, [activeForm]);

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="text-container">
          <h1>VÍTEJTE NA STRÁNKÁCH SCALP AND HAIR ACADEMY</h1>
          <p>Po přihlášení do systému budete přesměrování do galerie videí a fotografií z konference Scalp and Hair Academy 2024</p>
        </div>
        <div className="button-group" ref={buttonGroupRef}>
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
