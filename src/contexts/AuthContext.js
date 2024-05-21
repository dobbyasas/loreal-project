import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
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

      if (password !== 'password123') {
        throw new Error('Invalid password');
      }

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
