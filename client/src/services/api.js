import axios from "axios";

// Production backend URL
const API_URL = "https://gidy-profile-backend-odl6.onrender.com/api/profile";

const API = axios.create({
  baseURL: API_URL
});

console.log("API URL:", API_URL); // Debug log

export default API;
