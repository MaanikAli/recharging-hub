
/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5002/api' : '/api';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Client {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  nid: string;
  address: string;
  vehicleTypeId: string;
  imageUrl?: string;
  transactions: Transaction[];
  createdAt: string;
}

export interface VehicleType {
  id: string;
  name: string;
  chargingFee: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  vehicleTypeId: string;
  payableAmount: number;
  cashReceived: number;
  due: number;
}

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  updateCredentials: async (currentPassword: string, newUsername: string, newPassword: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newUsername, newPassword }),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  // Clients
  getClients: async (): Promise<Client[]> => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
    return response.json();
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  deleteClient: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete client');
  },

  addTransaction: async (clientId: string, transaction: { timestamp: string; cashReceived: number }): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to add transaction');
    return response.json();
  },

  updateTransaction: async (clientId: string, txId: string, transaction: Partial<Transaction>): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/transactions/${txId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
  },

  deleteTransaction: async (clientId: string, txId: string): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/transactions/${txId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return response.json();
  },

  // Vehicle Types
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicleTypes`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch vehicle types: ${response.status} ${response.statusText}`);
    return response.json();
  },

  createVehicleType: async (vehicleType: Omit<VehicleType, 'id'>): Promise<VehicleType> => {
    const response = await fetch(`${API_BASE_URL}/vehicleTypes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(vehicleType),
    });
    if (!response.ok) throw new Error('Failed to create vehicle type');
    return response.json();
  },

  updateVehicleType: async (id: string, vehicleType: Partial<VehicleType>): Promise<VehicleType> => {
    const response = await fetch(`${API_BASE_URL}/vehicleTypes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(vehicleType),
    });
    if (!response.ok) throw new Error('Failed to update vehicle type');
    return response.json();
  },

  deleteVehicleType: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/vehicleTypes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete vehicle type');
  },
};
