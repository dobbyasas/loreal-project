import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/RegisterForm.scss';
import Divider from '@mui/material/Divider';

const RegisterForm = () => {
  const [doctorId, setDoctorId] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      let { data: existingDoctorId, error: doctorIdError } = await supabase
        .from('pending')
        .select('doctor_id')
        .eq('doctor_id', doctorId)
        .single();

      if (doctorIdError && doctorIdError.code !== 'PGRST116') throw doctorIdError;
      if (existingDoctorId) {
        setError('Tohle ID už je zaregistrované.');
        return;
      }

      let { data: existingEmail, error: emailError } = await supabase
        .from('pending')
        .select('email')
        .eq('email', email)
        .single();

      if (emailError && emailError.code !== 'PGRST116') throw emailError;
      if (existingEmail) {
        setError('Tenhle e-mail už je zaregistrován.');
        return;
      }

      const { data, error } = await supabase
        .from('pending')
        .insert([{ doctor_id: doctorId, name: name, surname: surname, email: email }]);

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {submitted ? (
        <div className="success-message">
          <p><b>Děkujeme vám za zájem o přednášky ze Scalp and Hair Academy. </b></p>
          <p><b>Vaše žádost byla zaslána administrátorovi stránky a až bude potvrzena, obdržíte e-mail s možností přihlášení. </b></p>
          <p><b>V případě nejasností prosím kontaktujte zástupce společnosti L’Oréal.</b></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="register-form">
          <Divider component="li" />
          <br />
          <div className="form-group">
            <label htmlFor="doctorId" className="form-label">Identifikační číslo lékaře:</label>
            <input
              type="text"
              id="doctorId"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Zde napište ..."
              required
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="name" className="form-label">Jméno:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zde napište ..."
              required
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="surname" className="form-label">Příjmení:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Zde napište ..."
              required
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="email" className="form-label">E-mailová adresa:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Zde napište ..."
              required
            />
          </div>
          <br />
          <button type="submit" className="register-button">Registrovat</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
