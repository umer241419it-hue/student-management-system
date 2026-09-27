const mongoose = require('mongoose');
const Student = require('../models/Student');

// @desc    Add a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    const { studentId, name, email, mobile, branch, semester, cgpa } = req.body;

    // Check if studentId already exists
    if (studentId) {
      const existingStudent = await Student.findOne({ studentId: studentId.trim() });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: `Student with ID '${studentId.trim()}' already exists.`,
        });
      }
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      mobile,
      branch,
      semester,
      cgpa,
    });

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students (with optional search and branch filter)
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res, next) => {
  try {
    const { search, branch } = req.query;
    const filter = {};

    // Branch filter
    if (branch && branch.trim() !== '' && branch !== 'All') {
      filter.branch = branch.trim();
    }

    // Search filter across studentId, name, email
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { studentId: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // Newest records first
    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// @desc    Get total count of all students in the database
// @route   GET /api/students/count
// @access  Public
const getStudentCount = async (req, res, next) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single student by MongoDB _id or studentId
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }

    if (!student) {
      student = await Student.findOne({ studentId: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID '${id}'`,
      });
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing student by MongoDB _id or studentId
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }

    if (!student) {
      student = await Student.findOne({ studentId: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID '${id}'`,
      });
    }

    // Check if new studentId conflicts with another student
    if (req.body.studentId && req.body.studentId.trim() !== student.studentId) {
      const duplicate = await Student.findOne({
        studentId: req.body.studentId.trim(),
        _id: { $ne: student._id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Student ID '${req.body.studentId.trim()}' is already taken by another student.`,
        });
      }
    }

    // Update fields
    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student by MongoDB _id or studentId
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }

    if (!student) {
      student = await Student.findOne({ studentId: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID '${id}'`,
      });
    }

    await Student.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentCount,
  getStudentById,
  updateStudent,
  deleteStudent,
};
