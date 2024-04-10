import React from "react";
import '../styles/LoginPage.scss';
import LoginForm from '../Components/LoginForm'

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="form-container">
        <div className="text-container">
            <h1>VÍTEJTE NA STRÁNKÁCH SCALP AND HAIR ACADEMY</h1>
            <p>Po přihlášení do systému budete přesměrování do galerie videí a fotografií z konference Scalp and Hair Academy 2024</p>
        </div>
        <LoginForm />
      </div>
      <div className="image-container">
        <img src="/images/background.png" alt="Scalp and Hair Academy" />
      </div>
    </div>
  );
};

export default LoginPage;
