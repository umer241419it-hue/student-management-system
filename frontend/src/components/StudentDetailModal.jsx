import React from 'react';
import { X, GraduationCap, Mail, Phone, Calendar, Award, BookOpen, Clock } from 'lucide-react';

const StudentDetailModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal-container detail-modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title-wrapper">
            <GraduationCap size={22} className="text-primary" />
            <h2 id="detail-modal-title" className="modal-title">
              Student Details
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details Card */}
        <div className="detail-modal-body">
          <div className="detail-hero">
            <div className="detail-avatar">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="detail-hero-info">
              <h3 className="detail-name">{student.name}</h3>
              <p className="detail-id">Student ID: <strong>{student.studentId}</strong></p>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-icon"><Mail size={16} /></div>
              <div>
                <span className="detail-label">Email</span>
                <p className="detail-value">{student.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Phone size={16} /></div>
              <div>
                <span className="detail-label">Mobile Number</span>
                <p className="detail-value">{student.mobile}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><BookOpen size={16} /></div>
              <div>
                <span className="detail-label">Branch</span>
                <p className="detail-value">{student.branch}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Calendar size={16} /></div>
              <div>
                <span className="detail-label">Semester</span>
                <p className="detail-value">Semester {student.semester}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Award size={16} /></div>
              <div>
                <span className="detail-label">CGPA</span>
                <p className="detail-value font-semibold text-primary">
                  {Number(student.cgpa).toFixed(2)} / 10.00
                </p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><Clock size={16} /></div>
              <div>
                <span className="detail-label">Registered Date</span>
                <p className="detail-value">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
