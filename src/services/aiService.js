import axios from "axios";

const API_URL = "http://127.0.0.1:8001/ai";

export const getAIAccessibility = async (aiPayload) => {
    return axios.post(`${API_URL}/accessibility`, aiPayload);
};

export const getAiRisk = async (aiPayload) => {
    return axios.post(`${API_URL}/risk`, aiPayload);
};

export const getAiNudge = async (aiPayload) => {
    return axios.post(`${API_URL}/nudge`, aiPayload);
};