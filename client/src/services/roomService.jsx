import axios from 'axios';

const API_URL = 'http://localhost:3002/api/room';

export const createRoom = async (roomId, password, userID, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/create-room`,
            { roomId, password, userId: userID }, // Match the backend keys
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating room' };
    }
};

export const joinRoom = async (roomId, password, userID, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/join-room`,
            { roomId, password, userId: userID }, // Match the backend keys
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error joining room' };
    }
};
