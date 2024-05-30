import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session data:', session);

      if (session) {
        setUser(session.user);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', session);
        setUser(session?.user ?? null);
      });

      return () => {
        authListener?.unsubscribe();
      };
    };

    getSession();
  }, []);

  const login = async (doctorId, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('doctor_id', doctorId)
        .single();

      if (error || !data) {
        throw new Error('User not found');
      }

      if (password !== data.password) {
        throw new Error('Invalid password');
      }

      console.log('Login successful:', data);
      setUser(data);
      return data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, supabase, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
