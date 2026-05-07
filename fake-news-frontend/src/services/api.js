import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const analyzeNews = async (text) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze`, { text });
        return response.data;
    } catch (error) {
        console.error('Error analyzing news:', error);
        throw error;
    }
};
