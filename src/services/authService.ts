import instance from './axiosConfig';

export const login = async (email: string, password: string) => {
  const response = await instance.post('/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await instance.post('/register', { name, email, password });
  return response.data;
};
