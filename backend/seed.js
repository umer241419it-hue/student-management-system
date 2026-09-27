const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

// Load environment variables
dotenv.config();

const sampleStudents = [
  {
    studentId: '101',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    mobile: '9876543210',
    branch: 'CSE',
    semester: 5,
    cgpa: 8.5,
  },
  {
    studentId: '102',
    name: 'Neha Sharma',
    email: 'neha@example.com',
    mobile: '9876543211',
    branch: 'IT',
    semester: 6,
    cgpa: 9.1,
  },
  {
    studentId: '103',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    mobile: '9876543212',
    branch: 'AIML',
    semester: 4,
    cgpa: 8.8,
  },
  {
    studentId: '104',
    name: 'Priya Patel',
    email: 'priya@example.com',
    mobile: '9876543213',
    branch: 'ECE',
    semester: 7,
    cgpa: 7.9,
  },
  {
    studentId: '105',
    name: 'Rohan Singh',
    email: 'rohan@example.com',
    mobile: '9876543214',
    branch: 'ME',
    semester: 3,
    cgpa: 7.4,
  },
  {
    studentId: '106',
    name: 'Ananya Gupta',
    email: 'ananya@example.com',
    mobile: '9876543215',
    branch: 'CSE',
    semester: 8,
    cgpa: 9.5,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_management';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing student records.');

    // Insert sample students
    const created = await Student.insertMany(sampleStudents);
    console.log(`Successfully seeded ${created.length} students into the database:`);
    created.forEach((s) => {
      console.log(`  - [${s.studentId}] ${s.name} (${s.branch}, Sem ${s.semester}, CGPA: ${s.cgpa})`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
