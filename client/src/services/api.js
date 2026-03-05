import axios from "axios";

// Use production backend URL
const API_URL = "https://gidy-profile-backend-odl6.onrender.com";

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
API.interceptors.request.use(
  config => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  response => {
    console.log('Response received:', response.status);
    return response;
  },
  error => {
    console.error('Response error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;
