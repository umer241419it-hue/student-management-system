import React, { useState, useEffect, useCallback } from 'react';
import {
  getStudents,
  getTotalCount,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/api';
import Navbar from '../components/Navbar';
import SearchFilterBar from '../components/SearchFilterBar';
import StudentTable from '../components/StudentTable';
import StudentFormModal from '../components/StudentFormModal';
import StudentDetailModal from '../components/StudentDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';

const Dashboard = () => {
  // Data states
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [currentStudent, setCurrentStudent] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Feedback toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch total database student count
  const fetchTotalCount = useCallback(async () => {
    try {
      const data = await getTotalCount();
      setTotalCount(data.count ?? 0);
    } catch (err) {
      console.error('Error fetching total student count:', err);
    }
  }, []);

  // Fetch student list based on search and branch filter
  const fetchStudents = useCallback(async (search = searchQuery, branch = selectedBranch) => {
    try {
      setLoading(true);
      const data = await getStudents({ search, branch });
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching students:', err);
      showToast('Failed to load student records from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedBranch]);

  // Initial load
  useEffect(() => {
    fetchTotalCount();
    fetchStudents();
  }, [fetchTotalCount]);

  // Debounced search query & branch filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchQuery, selectedBranch);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedBranch, fetchStudents]);

  // Handle Add Form Open
  const handleOpenAddModal = () => {
    setFormMode('add');
    setCurrentStudent(null);
    setIsFormModalOpen(true);
  };

  // Handle Edit Form Open
  const handleOpenEditModal = (student) => {
    setFormMode('edit');
    setCurrentStudent(student);
    setIsFormModalOpen(true);
  };

  // Handle View Details Open
  const handleOpenDetailModal = async (student) => {
    try {
      // Fetch fresh single student details by ID
      const data = await getStudentById(student._id || student.studentId);
      setDetailStudent(data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching student details:', err);
      showToast('Could not fetch student details', 'error');
    }
  };

  // Handle Delete Confirmation Dialog Open
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Submit Handler for Add / Edit
  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      const newStudent = await createStudent(formData);
      showToast(`Student '${newStudent.name}' (ID: ${newStudent.studentId}) added successfully!`, 'success');
    } else {
      const updated = await updateStudent(currentStudent._id || currentStudent.studentId, formData);
      showToast(`Student '${updated.name}' updated successfully!`, 'success');
    }

    setIsFormModalOpen(false);
    fetchStudents();
    fetchTotalCount();
  };

  // Confirm Delete Handler
  const handleDeleteConfirm = async (student) => {
    try {
      await deleteStudent(student._id || student.studentId);
      showToast(`Student '${student.name}' was successfully removed.`, 'success');
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents();
      fetchTotalCount();
    } catch (err) {
      console.error('Error deleting student:', err);
      const msg = err.response?.data?.message || 'Failed to delete student record.';
      showToast(msg, 'error');
    }
  };

  // Reset search and filter
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('All');
  };

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Header */}
      <Navbar totalCount={totalCount} loading={false} />

      {/* Main Content Body */}
      <main className="dashboard-content">
        <div className="dashboard-container">
          {/* Action and Filter Bar */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            onResetFilters={handleResetFilters}
            onOpenAddModal={handleOpenAddModal}
          />

          {/* Records Table */}
          <StudentTable
            students={students}
            loading={loading}
            onView={handleOpenDetailModal}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentStudent}
        isEditMode={formMode === 'edit'}
      />

      {/* View Student Details Modal */}
      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailStudent(null);
        }}
        student={detailStudent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        student={studentToDelete}
      />
    </div>
  );
};

export default Dashboard;
