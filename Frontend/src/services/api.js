// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to make requests with auth token
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        // Store token in localStorage
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }
        
        return response;
    }

    async getProfile() {
        return this.request('/api/auth/profile');
    }

    async logout() {
        localStorage.removeItem('authToken');
    }

    // Posts methods
    async getPosts(page = 1, limit = 10) {
        return this.request(`/api/posts?page=${page}&limit=${limit}`);
    }

    async getPost(id) {
        return this.request(`/api/posts/${id}`);
    }

    async createPost(postData) {
        // If postData contains a file, use FormData
        if (postData instanceof FormData) {
            return this.request('/api/posts', {
                method: 'POST',
                headers: {
                    // Don't set Content-Type for FormData, let browser set it
                    Authorization: localStorage.getItem('authToken') ? 
                        `Bearer ${localStorage.getItem('authToken')}` : undefined
                },
                body: postData,
            });
        }

        return this.request('/api/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    }

    async updatePost(id, postData) {
        // If postData contains a file, use FormData
        if (postData instanceof FormData) {
            return this.request(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: localStorage.getItem('authToken') ? 
                        `Bearer ${localStorage.getItem('authToken')}` : undefined
                },
                body: postData,
            });
        }

        return this.request(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData),
        });
    }

    async deletePost(id) {
        return this.request(`/api/posts/${id}`, {
            method: 'DELETE',
        });
    }

    // Image methods
    getImageUrl(fileId) {
        return `${this.baseURL}/api/images/${fileId}`;
    }

    async getImageInfo(fileId) {
        return this.request(`/api/images/info/${fileId}`);
    }

    async getImageUrls(fileId) {
        return this.request(`/api/images/url/${fileId}`);
    }

    getImageDownloadUrl(fileId) {
        return `${this.baseURL}/api/images/download/${fileId}`;
    }

    // Utility methods
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
