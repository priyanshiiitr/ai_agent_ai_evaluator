import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const evaluateSummary = async (data) => {
    try {
        const response = await apiClient.post('/evaluate', data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.detail || 'Failed to fetch evaluation.');
    }
};
