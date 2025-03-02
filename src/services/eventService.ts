import instance from './axiosConfig';

export interface EventData {
  title: string;
  description?: string;
  location?: string;
  date: string;
  userId: number;
}

export const getEvents = async () => {
  const response = await instance.get('/events');
  return response.data;
};

export const createEvent = async (eventData: EventData) => {
  const response = await instance.post('/events', eventData);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await instance.delete(`/events/${id}`);
};

export const updateEvent = async (id: number, updatedData: Partial<EventData>) => {
  const response = await instance.put(`/events/${id}`, updatedData);
  return response.data;
};
