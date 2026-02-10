import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const crearCita = async (datos) => {
  return await axios.post(`${API_URL}/citas`, datos);
};

export const obtenerCitas = async () => {
  return await axios.get(`${API_URL}/citas`);
};