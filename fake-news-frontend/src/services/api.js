import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Sends a news claim to the backend for AI-powered verification.
 * 
 * @param {string} text - The news claim or article text to analyze.
 * @returns {Promise<Object>} The analysis result containing verdict, confidence, and sources.
 * @throws {Error} If the network request fails or the backend returns an error.
 */
export const analyzeNews = async (text) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze`, { text });
        return response.data;
    } catch (error) {
        console.error('Error analyzing news:', error);
        throw error;
    }
};
