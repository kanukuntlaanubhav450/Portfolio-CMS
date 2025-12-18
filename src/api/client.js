const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
import { auth } from "../firebase";

const getHeaders = async () => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : "";
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const api = {
    get: async (endpoint) => {
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
            if (!res.ok) throw new Error("API Error");
            return res.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },
    post: async (endpoint, data) => {
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "API Error");
            }
            return res.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            alert(`Error: ${error.message}`);
            throw error;
        }
    },
    put: async (endpoint, data) => {
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "API Error");
            }
            return res.json();
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error);
            alert(`Error: ${error.message}`);
            throw error;
        }
    },
    delete: async (endpoint) => {
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers,
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "API Error");
            }
            return res.json();
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
            alert(`Error: ${error.message}`);
            throw error;
        }
    },
    upload: async (file) => {
        try {
            const user = auth.currentUser;
            const token = user ? await user.getIdToken() : "";
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (!res.ok) throw new Error("Upload Failed");
            return res.json();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert(`Upload Error: ${error.message}`);
            throw error;
        }
    }
};
