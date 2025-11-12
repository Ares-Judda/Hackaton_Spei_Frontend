import axios from "axios";

const API_GATEWAY_URL = "https://localhost:7075/api/profile";

export const updateConsent = (consentData) => {
  return axios.put(`${API_GATEWAY_URL}/consent`, consentData);
};

export const getAccessibilityProfile = () => {
  return axios.get(`${API_GATEWAY_URL}/accessibility`);
};

export const updateAccessibilityProfile = (profileData) => {
  return axios.put(`${API_GATEWAY_URL}/accessibility`, profileData);
};
