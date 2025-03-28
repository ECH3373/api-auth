import axios from 'axios';

export const get_employee = async (id) => {
  try {
    const response = await axios.get(`http://82.29.197.244:8080/employees/${id}`);
    return response.data.data;
  } catch (error) {}
};

export const api = {
  get_employee,
};
