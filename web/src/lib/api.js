const API_BASE_URL = 'http://localhost:3001/api';

// Função para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Função para upload de arquivos
const uploadRequest = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: 'POST',
    body: formData,
  };

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload Request Error:', error);
    throw error;
  }
};

// API de Autenticação
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// API de Itens
export const itemsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/items${queryString ? `?${queryString}` : ''}`);
  },
  
  getPublic: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/items/public${queryString ? `?${queryString}` : ''}`);
  },
  
  getMyItems: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/items/my-items${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/items/${id}`),
  
  getPublicById: (id) => apiRequest(`/items/public/${id}`),
  
  create: (formData) => uploadRequest('/items', formData),
  
  update: (id, formData) => uploadRequest(`/items/${id}`, formData),
  
  delete: (id) => apiRequest(`/items/${id}`, { method: 'DELETE' }),
  
  getStats: () => apiRequest('/items/stats'),
};

// API de Usuários
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/users/${id}`),
  
  updateStatus: (id, isActive) => apiRequest(`/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  }),
  
  promoteToAdmin: (id) => apiRequest(`/users/${id}/promote`, {
    method: 'PUT',
  }),
  
  getStats: () => apiRequest('/users/stats'),
};

// API de Avaliações
export const evaluationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/evaluations${queryString ? `?${queryString}` : ''}`);
  },
  
  getPublic: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/evaluations/public${queryString ? `?${queryString}` : ''}`);
  },
  
  getMyEvaluations: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/evaluations/my-evaluations${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/evaluations/${id}`),
  
  getPublicById: (id) => apiRequest(`/evaluations/public/${id}`),
  
  create: (evaluationData) => apiRequest('/evaluations', {
    method: 'POST',
    body: JSON.stringify(evaluationData),
  }),
  
  update: (id, evaluationData) => apiRequest(`/evaluations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(evaluationData),
  }),
  
  delete: (id) => apiRequest(`/evaluations/${id}`, { method: 'DELETE' }),
  
  getStats: () => apiRequest('/evaluations/stats'),
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Função para fazer logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Função para obter dados do usuário do localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Função para salvar dados do usuário no localStorage
export const saveUserData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

