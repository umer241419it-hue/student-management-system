import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertCircle, Save, UserPlus } from 'lucide-react';
import { BRANCH_OPTIONS } from './SearchFilterBar';

const AVAILABLE_BRANCHES = BRANCH_OPTIONS.filter((b) => b !== 'All');

const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    mobile: '',
    branch: 'CSE',
    semester: '1',
    cgpa: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        studentId: initialData.studentId || '',
        name: initialData.name || '',
        email: initialData.email || '',
        mobile: initialData.mobile || '',
        branch: initialData.branch || 'CSE',
        semester: initialData.semester ? String(initialData.semester) : '1',
        cgpa: initialData.cgpa !== undefined ? String(initialData.cgpa) : '',
      });
    } else {
      setFormData({
        studentId: '',
        name: '',
        email: '',
        mobile: '',
        branch: 'CSE',
        semester: '1',
        cgpa: '',
      });
    }
    setErrors({});
    setServerError('');
  }, [initialData, isEditMode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required';
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., student@example.com)';
    }

    // Mobile validation: 10-digit number
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    // Semester validation: 1 to 8
    const sem = parseInt(formData.semester, 10);
    if (!formData.semester || isNaN(sem) || sem < 1 || sem > 8) {
      newErrors.semester = 'Semester must be a number between 1 and 8';
    }

    // CGPA validation: 0.0 to 10.0
    const cgpaVal = parseFloat(formData.cgpa);
    if (formData.cgpa === '' || isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      newErrors.cgpa = 'CGPA must be a decimal value between 0.0 and 10.0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        studentId: formData.studentId.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        branch: formData.branch.trim(),
        semester: parseInt(formData.semester, 10),
        cgpa: parseFloat(formData.cgpa),
      };

      await onSubmit(payload);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to save student record. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title-wrapper">
            {isEditMode ? (
              <UserCheck size={22} className="text-primary" />
            ) : (
              <UserPlus size={22} className="text-primary" />
            )}
            <h2 id="modal-title" className="modal-title">
              {isEditMode ? 'Update Student Record' : 'Add New Student'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="form-alert form-alert-error" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="form-grid">
            {/* Student ID */}
            <div className="form-group">
              <label htmlFor="studentId" className="form-label">
                Student ID <span className="required-star">*</span>
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                className={`form-input ${errors.studentId ? 'input-error' : ''}`}
                placeholder="e.g. 101 or CS2024"
                value={formData.studentId}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.studentId && <p className="error-text">{errors.studentId}</p>}
            </div>

            {/* Student Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Amit Kumar"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. amit@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label htmlFor="mobile" className="form-label">
                Mobile Number <span className="required-star">*</span>
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                maxLength={10}
                className={`form-input ${errors.mobile ? 'input-error' : ''}`}
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.mobile && <p className="error-text">{errors.mobile}</p>}
            </div>

            {/* Branch */}
            <div className="form-group">
              <label htmlFor="branch" className="form-label">
                Branch <span className="required-star">*</span>
              </label>
              <select
                id="branch"
                name="branch"
                className={`form-select ${errors.branch ? 'input-error' : ''}`}
                value={formData.branch}
                onChange={handleChange}
                disabled={submitting}
              >
                {AVAILABLE_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.branch && <p className="error-text">{errors.branch}</p>}
            </div>

            {/* Semester */}
            <div className="form-group">
              <label htmlFor="semester" className="form-label">
                Semester (1-8) <span className="required-star">*</span>
              </label>
              <select
                id="semester"
                name="semester"
                className={`form-select ${errors.semester ? 'input-error' : ''}`}
                value={formData.semester}
                onChange={handleChange}
                disabled={submitting}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
              {errors.semester && <p className="error-text">{errors.semester}</p>}
            </div>

            {/* CGPA */}
            <div className="form-group form-group-full">
              <label htmlFor="cgpa" className="form-label">
                CGPA (0.00 – 10.00) <span className="required-star">*</span>
              </label>
              <input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                className={`form-input ${errors.cgpa ? 'input-error' : ''}`}
                placeholder="e.g. 8.50"
                value={formData.cgpa}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.cgpa && <p className="error-text">{errors.cgpa}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-student-form-btn"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>Saving...</>
              ) : isEditMode ? (
                <>
                  <Save size={16} />
                  <span>Update Student</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
