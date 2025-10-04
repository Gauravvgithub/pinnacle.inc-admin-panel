import axios from 'axios';
const instance = axios.create({
  
  
  baseURL: "https://pinnacle-inc-backend.vercel.app/api",
  withCredentials: true,
});

export default instance;
