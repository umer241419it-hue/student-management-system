# Student Management System — MERN Stack

An academic web application developed for **Assignment 1: MERN-Based Student Management System**. It allows an administrator to manage student records with full CRUD operations, multi-field search, branch filtering, and dynamic student count tracking.

---

## Technologies Used

* **MongoDB** — NoSQL database for storing student records (`student_management` database, `students` collection)
* **Express.js** — Fast, unopinionated REST API backend framework
* **React.js (Vite)** — Fast, component-based frontend UI
* **Node.js** — JavaScript runtime environment
* **Mongoose** — Elegant MongoDB object modeling and schema validation
* **Axios** — Promise-based HTTP client for API integration
* **Vanilla CSS** — Modern, responsive academic dashboard styling

---

## Features Implemented

1. **Add Student**: Form modal with validation for Student ID, Name, Email, Mobile (10 digits), Branch, Semester (1–8), and CGPA (0.00–10.00).
2. **View All Students**: Clean, responsive tabular display showing newest records first.
3. **Search Student**: Server-side search querying across Student ID, Name, and Email.
4. **Filter by Branch**: Filter student records by branch (`All`, `CSE`, `IT`, `AIML`, `ECE`, `ME`, `Civil`). Works in combination with search.
5. **Update Student**: Edit button opens modal pre-filled with student data, saving modifications via the `PUT` API.
6. **Delete Student**: Delete button triggers a custom confirmation modal before removing the student record from MongoDB via the `DELETE` API.
7. **Total Student Count**: Displays live total student count from MongoDB (`Total Students: X`), updating dynamically after add and delete operations.
8. **View Student Details**: Modal card presenting complete student information retrieved via `GET /api/students/:id`.
9. **Toast Feedback**: Non-blocking success and error notification banners (no browser `alert()`).

---

## Student Schema

Each student record in MongoDB contains:

| Field | Type | Rules | Description |
|---|---|---|---|
| `studentId` | String | Required, Unique, Trim | Unique identifier (e.g. `101`) |
| `name` | String | Required, Trim | Full name of the student |
| `email` | String | Required, Trim, Lowercase, Email format | Student email address |
| `mobile` | String | Required, Trim, 10 digits | Student contact number |
| `branch` | String | Required, Trim | Department (CSE, IT, AIML, ECE, ME, Civil) |
| `semester` | Number | Required, Min: 1, Max: 8 | Current academic semester |
| `cgpa` | Number | Required, Min: 0.00, Max: 10.00 | Cumulative Grade Point Average |
| `createdAt` / `updatedAt` | Date | Managed by Mongoose | Timestamps |

---

## Project Structure

```text
student-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   └── studentController.js  # CRUD controller handlers
│   ├── models/
│   │   └── Student.js            # Mongoose Student schema & model
│   ├── routes/
│   │   └── studentRoutes.js      # REST API route definitions
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handling
│   ├── server.js                 # Express server entry point
│   ├── seed.js                   # Sample student data seed script
│   ├── package.json              # Backend dependencies & scripts
│   └── .env                      # Environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header with total student counter
│   │   │   ├── SearchFilterBar.jsx   # Search input, branch dropdown, add button
│   │   │   ├── StudentTable.jsx      # Student data table & action buttons
│   │   │   ├── StudentFormModal.jsx  # Add and Edit student modal form
│   │   │   ├── StudentDetailModal.jsx# View student details modal
│   │   │   ├── DeleteConfirmModal.jsx# Deletion confirmation modal
│   │   │   └── Toast.jsx             # Toast notification alerts
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Main dashboard page coordinating state
│   │   ├── services/
│   │   │   └── api.js                # Axios API service calls
│   │   ├── App.jsx                   # Root application component
│   │   ├── index.css                 # Custom styling design system
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite build and proxy config
│   └── package.json                  # Frontend dependencies & scripts
│
├── README.md                         # Documentation
└── .gitignore                        # Git ignore rules
```

---

## Installation & Setup

### 1. Prerequisites
Ensure you have installed:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on default port `27017`

To check if MongoDB is running locally:
```powershell
# Windows
Get-Service MongoDB
```

### 2. Backend Installation & Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd student-management-system/backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/student_management
   ```

4. (Optional) Seed initial sample student records:
   ```bash
   npm run seed
   ```

5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server will start at `http://localhost:5000`.*

---

### 3. Frontend Installation & Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd student-management-system/frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be available at `http://localhost:5173`.*

---

## REST API Documentation

Base URL: `http://localhost:5000/api/students`

### 1. Add Student
* **Method:** `POST`
* **URL:** `/api/students`
* **Request Body:**
  ```json
  {
    "studentId": "101",
    "name": "Amit Kumar",
    "email": "amit@example.com",
    "mobile": "9876543210",
    "branch": "CSE",
    "semester": 5,
    "cgpa": 8.5
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "_id": "65e...",
    "studentId": "101",
    "name": "Amit Kumar",
    "email": "amit@example.com",
    "mobile": "9876543210",
    "branch": "CSE",
    "semester": 5,
    "cgpa": 8.5,
    "createdAt": "2026-09-10T06:58:00.000Z",
    "updatedAt": "2026-09-10T06:58:00.000Z"
  }
  ```
* **Error Response (409 Conflict):**
  ```json
  {
    "success": false,
    "message": "Student with ID '101' already exists."
  }
  ```

---

### 2. Get All Students
* **Method:** `GET`
* **URL:** `/api/students`
* **Optional Query Parameters:**
  * `search`: Searches across `studentId`, `name`, and `email` (e.g. `?search=Amit`)
  * `branch`: Filters by branch (e.g. `?branch=CSE`)
* **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "65e...",
      "studentId": "101",
      "name": "Amit Kumar",
      "email": "amit@example.com",
      "mobile": "9876543210",
      "branch": "CSE",
      "semester": 5,
      "cgpa": 8.5
    }
  ]
  ```

---

### 3. Get Total Student Count
* **Method:** `GET`
* **URL:** `/api/students/count`
* **Success Response (200 OK):**
  ```json
  {
    "count": 6
  }
  ```

---

### 4. Get Single Student
* **Method:** `GET`
* **URL:** `/api/students/:id` *(accepts either MongoDB `_id` or `studentId`)*
* **Success Response (200 OK):**
  ```json
  {
    "_id": "65e...",
    "studentId": "101",
    "name": "Amit Kumar",
    "email": "amit@example.com",
    "mobile": "9876543210",
    "branch": "CSE",
    "semester": 5,
    "cgpa": 8.5
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Student not found with ID '999'"
  }
  ```

---

### 5. Update Student
* **Method:** `PUT`
* **URL:** `/api/students/:id` *(accepts either MongoDB `_id` or `studentId`)*
* **Request Body:**
  ```json
  {
    "name": "Amit K. Verma",
    "cgpa": 8.9
  }
  ```
* **Success Response (200 OK):**
  Returns the updated student document.

---

### 6. Delete Student
* **Method:** `DELETE`
* **URL:** `/api/students/:id` *(accepts either MongoDB `_id` or `studentId`)*
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Student deleted successfully"
  }
  ```
