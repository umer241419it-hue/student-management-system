import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, student }) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !student) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(student);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-container delete-modal-container">
        <div className="modal-header delete-modal-header">
          <div className="modal-header-title-wrapper">
            <div className="delete-warning-icon-wrapper">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <h2 id="delete-dialog-title" className="modal-title">
              Confirm Deletion
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={deleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-prompt-main">
            Are you sure you want to delete student <strong>{student.name}</strong> (Student ID: <strong>{student.studentId}</strong>)?
          </p>
          <p className="delete-prompt-sub">
            This student record will be permanently deleted from the database. This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>Deleting...</>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Student</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
