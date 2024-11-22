import axios from 'axios';

const BASE_URL = '/api/v1/tasks';

export const taskService = {
    // Tüm taskları getir
    getAllTasks: async () => {
        const response = await axios.get(BASE_URL);
        console.log("response", response.data);
        return response.data;
    },

    // Task güncelle (sürükleme için de kullanılacak)
    updateTask: async (taskId, data) => {
        const response = await axios.put(`${BASE_URL}/${taskId}`, data);
        return response.data;
    },

    // Task sil
    deleteTask: async (taskId) => {
        const response = await axios.delete(`${BASE_URL}/${taskId}`);
        return response.data;
    },

    // Task oluştur
    createTask: async (data) => {
        const response = await axios.post(BASE_URL, data);
        return response.data;
    },

    // Drag-drop için status güncelleme, notification endpoint
    notifyTaskStatusChange: async (taskId, newStatus) => {
        const response = await axios.post(`${BASE_URL}/${taskId}/status`, {
            status: newStatus
        });
        return response.data;
    }
};