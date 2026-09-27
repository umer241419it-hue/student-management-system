import React from 'react';
import { Eye, Edit3, Trash2, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';

const StudentTable = ({
  students,
  loading,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}) => {
  const getCgpaBadgeClass = (cgpa) => {
    const val = parseFloat(cgpa);
    if (val >= 8.5) return 'badge-cgpa-high';
    if (val >= 7.0) return 'badge-cgpa-mid';
    return 'badge-cgpa-low';
  };

  if (loading) {
    return (
      <div className="table-card table-loading-state">
        <RefreshCw size={36} className="spin text-primary" />
        <p className="loading-text">Loading student records...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="table-card table-empty-state">
        <div className="empty-icon-wrapper">
          <GraduationCap size={48} className="text-muted" />
        </div>
        <h3 className="empty-title">No Student Records Found</h3>
        <p className="empty-description">
          No students match your current criteria or the database is empty.
        </p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="student-table" id="student-records-table">
          <thead>
            <tr>
              <th scope="col">Student ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile</th>
              <th scope="col">Branch</th>
              <th scope="col">Semester</th>
              <th scope="col">CGPA</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id || student.studentId} className="student-row">
                <td className="font-semibold text-primary">
                  {student.studentId}
                </td>
                <td className="font-medium text-dark">
                  {student.name}
                </td>
                <td className="text-muted">
                  {student.email}
                </td>
                <td className="text-muted">
                  {student.mobile}
                </td>
                <td>
                  <span className="badge badge-branch">
                    {student.branch}
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge badge-semester">
                    Sem {student.semester}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getCgpaBadgeClass(student.cgpa)}`}>
                    {Number(student.cgpa).toFixed(2)}
                  </span>
                </td>
                <td className="text-center">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      id={`view-student-${student.studentId}`}
                      className="btn-action btn-action-view"
                      onClick={() => onView(student)}
                      title="View Student Details"
                      aria-label={`View details for ${student.name}`}
                    >
                      <Eye size={16} />
                      <span className="action-text">View</span>
                    </button>
                    <button
                      type="button"
                      id={`edit-student-${student.studentId}`}
                      className="btn-action btn-action-edit"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Edit3 size={16} />
                      <span className="action-text">Edit</span>
                    </button>
                    <button
                      type="button"
                      id={`delete-student-${student.studentId}`}
                      className="btn-action btn-action-delete"
                      onClick={() => onDelete(student)}
                      title="Delete Student"
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 size={16} />
                      <span className="action-text">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer-meta">
        <span>Showing <strong>{students.length}</strong> student record{students.length === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
};

export default StudentTable;
