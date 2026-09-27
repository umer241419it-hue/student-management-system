import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: '/api/students',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch students with optional search and branch parameters
export const getStudents = async (params = {}) => {
  const queryParams = {};
  if (params.search && params.search.trim() !== '') {
    queryParams.search = params.search.trim();
  }
  if (params.branch && params.branch !== 'All') {
    queryParams.branch = params.branch;
  }
  const response = await API.get('/', { params: queryParams });
  return response.data;
};

// Fetch total student count in the database
export const getTotalCount = async () => {
  const response = await API.get('/count');
  return response.data;
};

// Fetch a single student by MongoDB _id or studentId
export const getStudentById = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

// Create a new student
export const createStudent = async (studentData) => {
  const response = await API.post('/', studentData);
  return response.data;
};

// Update an existing student
export const updateStudent = async (id, studentData) => {
  const response = await API.put(`/${id}`, studentData);
  return response.data;
};

// Delete a student
export const deleteStudent = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export default {
  getStudents,
  getTotalCount,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
