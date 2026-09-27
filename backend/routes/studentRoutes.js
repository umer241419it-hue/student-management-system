const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentCount,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// Registered in strict order so /count is matched before /:id
router.get('/', getAllStudents);
router.get('/count', getStudentCount);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
