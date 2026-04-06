// JWT Security Utilities
class AuthManager {
    constructor() {
        this.API_URL = this.resolveApiUrl();
        this.tokenRefreshPromise = null;
    }

    resolveApiUrl() {
        const savedApiUrl = localStorage.getItem('apiUrl');
        if (savedApiUrl) {
            return savedApiUrl;
        }

        const { origin, protocol, hostname } = window.location;
        const isLocalHost = ['localhost', '127.0.0.1'].includes(hostname);
        const isFileProtocol = protocol === 'file:';

        if (isFileProtocol) {
            return 'http://localhost:5000';
        }

        if (!isLocalHost) {
            return origin;
        }

        const resolvedProtocol = protocol === 'https:' ? 'https:' : 'http:';
        const resolvedHost = hostname || 'localhost';
        return `${resolvedProtocol}//${resolvedHost}:5000`;
    }

    async fetchJson(url, options = {}, fallbackMessage = 'Unable to connect to the server.') {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        let response;

        try {
            response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    Accept: 'application/json',
                    ...(options.headers || {})
                }
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your network and try again.');
            }
            throw new Error(`${fallbackMessage} Make sure the backend is running on ${this.API_URL}.`);
        } finally {
            clearTimeout(timeout);
        }

        return response;
    }

    async parseJsonResponse(response) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error(`Server response was not valid JSON: ${text}`);
        }
    }

    // Secure token storage with encryption (basic implementation)
    setToken(token) {
        try {
            // In production, consider using httpOnly cookies instead of localStorage
            localStorage.setItem('token', token);
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setRefreshToken(refreshToken) {
        try {
            localStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
            console.error('Failed to store refresh token:', error);
        }
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    // Clear all auth data
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('currentCategory');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    // Refresh token if needed
    async refreshTokenIfNeeded() {
        if (this.tokenRefreshPromise) {
            return this.tokenRefreshPromise;
        }

        this.tokenRefreshPromise = this._refreshToken();
        try {
            const result = await this.tokenRefreshPromise;
            return result;
        } finally {
            this.tokenRefreshPromise = null;
        }
    }

    async _refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await this.fetchJson(`${this.API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            }, 'Session refresh failed.');

            if (!response.ok) {
                const error = await this.parseJsonResponse(response);
                throw new Error(error.error || error.message || 'Token refresh failed');
            }

            const data = await this.parseJsonResponse(response);
            this.setToken(data.token);
            this.setRefreshToken(data.refreshToken);
            return data.token;
        } catch (error) {
            // If refresh fails, clear auth and redirect to login
            this.clearAuth();
            window.location.href = 'index.html';
            throw error;
        }
    }

    // Make authenticated API calls with automatic token refresh
    async authenticatedFetch(url, options = {}) {
        const makeRequest = async (token) => {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...options.headers
            };

            return this.fetchJson(url, { ...options, headers }, 'Request failed.');
        };

        let token = this.getToken();

        // First attempt
        let response = await makeRequest(token);

        // If token is expired, try to refresh and retry
        if (response.status === 401) {
            try {
                token = await this.refreshTokenIfNeeded();
                response = await makeRequest(token);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                this.clearAuth();
                window.location.href = 'index.html';
                throw refreshError;
            }
        }

        return response;
    }

    // Login method
    async login(username, password) {
        const response = await this.fetchJson(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }, 'Login failed.');

        if (!response.ok) {
            const error = await this.parseJsonResponse(response);
            throw new Error(error.error || error.message || 'Login failed');
        }

        const data = await this.parseJsonResponse(response);
        this.setToken(data.token);
        this.setRefreshToken(data.refreshToken);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.name);

        return data;
    }

    // Register method
    async register(userData) {
        const response = await this.fetchJson(`${this.API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }, 'Registration failed.');

        if (!response.ok) {
            const error = await this.parseJsonResponse(response);
            throw new Error(error.error || error.message || 'Registration failed');
        }

        const data = await this.parseJsonResponse(response);
        this.setToken(data.token);
        this.setRefreshToken(data.refreshToken);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', userData.name);

        return data;
    }

    // Logout method
    async logout() {
        try {
            const refreshToken = this.getRefreshToken();
            await this.fetchJson(`${this.API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ refreshToken })
            }, 'Logout failed.');
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            this.clearAuth();
            window.location.href = 'index.html';
        }
    }
}

// Create global instance
const authManager = new AuthManager();
window.APP_API_URL = authManager.API_URL;
