import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../styles/LoginForm.scss';
import Divider from '@mui/material/Divider';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RegisterForm = () => {  
  const [submitted, setSubmitted] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [invalidDoctorId, setInvalidDoctorId] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate fields
    if (!doctorId || !email) {
      setError('Vyplňte prosím všechna pole.');
      setInvalidDoctorId(!doctorId);
      setInvalidEmail(!email);
      return;
    }

    try {
      // Check if the doctor ID or email already exists in the "pending" table
      const { data: existingDoctorId, error: doctorIdError } = await supabase
        .from('pending')
        .select('*')
        .eq('doctor_id', doctorId)
        .single();

      if (existingDoctorId) {
        setError('Tohle ID už je zaregistrované.');
        setInvalidDoctorId(true);
        return;
      }

      const { data: existingEmail, error: emailError } = await supabase
        .from('pending')
        .select('*')
        .eq('email', email)
        .single();

      if (existingEmail) {
        setError('Tenhle e-mail už je zaregistrován.');
        setInvalidEmail(true);
        return;
      }

      // Insert the data into the "pending" table
      const { data, error } = await supabase
        .from('pending')
        .insert([{ doctor_id: doctorId, email: email }]);

      if (error) {
        throw error;
      }

      setSubmitted(true);
      setError(null); // Clear any previous error
    } catch (error) {
      setError('There was an error submitting the form. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      {submitted && (
        <div className="announcement">
          <h4>Prosím zkontrolujte svůj e-mail pro další instrukce.</h4>
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <Divider component="li" />
        <br />
        <div className="form-group">
          <label htmlFor="doctorId" className="form-label">
            Identifikační číslo lékaře:
          </label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            placeholder="Zde napište ..."
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              if (e.target.value) setInvalidDoctorId(false);
            }}
            className={invalidDoctorId ? 'invalid' : ''}
          />
        </div>
        <br /><br />
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-mailová adresa:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Zde napište ..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) setInvalidEmail(false);
            }}
            className={invalidEmail ? 'invalid' : ''}
          />
        </div>
        <button type="submit" className="login-button">Registrovat*</button>
        {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
        <h5>*Po kliknutí na tlačitko registrace Vám bude po ověření identity na email posláno heslo pro přihlášení.</h5>
      </form>
    </div>
  );
};

export default RegisterForm;
