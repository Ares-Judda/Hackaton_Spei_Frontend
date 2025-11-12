import axios from "axios";

const AI_SERVICE_URL = "http://127.0.0.1:8001/ai";

export const getAiAccessibility = (aiPayload) => {
  return axios.post(`${AI_SERVICE_URL}/accessibility`, aiPayload);
};

export const getAiRisk = (payload) => {
  return axios.post(`${AI_SERVICE_URL}/risk`, payload);
};
