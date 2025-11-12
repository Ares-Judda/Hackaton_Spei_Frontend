import axios from "axios";

const API_GATEWAY_URL = "https://localhost:7075/api/auth";

export const login = (email, password) => {
  return axios.post(`${API_GATEWAY_URL}/login`, {
    email: email,
    password: password,
  });
};

export const register = (registrationData) => {
  return axios.post(`${API_GATEWAY_URL}/register`, registrationData);
};
