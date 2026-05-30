import axios from 'axios';
import { supabase } from '../supabase/client';

const axiosClient = axios.create({
  baseURL: 'https://backendproyectomoviles.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: adjunta el JWT de Supabase en cada request
axiosClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
