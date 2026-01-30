// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_B_LOCATION;

console.log("Location is:", API_BASE_URL); 

if (!API_BASE_URL) {
    console.warn("VITE_LOCATION is undefined. Check your .env file and restart server.");
}