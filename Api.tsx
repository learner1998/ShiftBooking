import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8080'; // Replace this with your actual base URL

const api = axios.create({
  baseURL: BASE_URL,
});

// Common API calls
const get = (url, config = {}) => api.get(url, config);
const post = (url, data, config = {}) => api.post(url, data, config);
const put = (url, data, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

export {get, post, put, del};
