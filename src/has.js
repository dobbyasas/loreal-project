const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const updateAdminPassword = async () => {
  const adminPassword = 'GodMode2024'; // The admin's plain text password
  const hashedPassword = await hashPassword(adminPassword);

  const { data, error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('doctor_id', 'admin'); // Assuming 'admin' is the doctor_id for the admin

  if (error) {
    console.error('Error updating admin password:', error);
  } else {
    console.log('Admin password updated successfully:', data);
  }
};

updateAdminPassword();
