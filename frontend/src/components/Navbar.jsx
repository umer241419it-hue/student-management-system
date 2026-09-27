import React from 'react';
import { GraduationCap, Users } from 'lucide-react';

const Navbar = ({ totalCount, loading }) => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="navbar-title">STUDENT MANAGEMENT SYSTEM</h1>
            <p className="navbar-subtitle">Academic Records & Administration Portal</p>
          </div>
        </div>

        <div className="navbar-stats" id="total-students-counter">
          <div className="stats-pill">
            <Users size={18} className="stats-icon" />
            <span className="stats-label">Total Students:</span>
            <span className="stats-value">
              {loading ? '...' : totalCount}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
