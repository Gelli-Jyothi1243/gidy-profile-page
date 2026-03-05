import axios from "axios";

// Use environment variable for production, fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || "https://gidy-profile-backend-odl6.onrender.com/api/profile";

const API = axios.create({
  baseURL: API_URL
});

console.log("API URL:", API_URL); // Debug log

export default API;
