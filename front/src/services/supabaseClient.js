import { createClient } from '@supabase/supabase-js';

// En Create React App, las variables de entorno DEBEN empezar por REACT_APP_
// y se leen usando process.env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);