import React from 'react';
import { Search, Filter, UserPlus, X } from 'lucide-react';

export const BRANCH_OPTIONS = [
  'All',
  'CSE',
  'IT',
  'AIML',
  'ECE',
  'ME',
  'Civil',
];

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  onResetFilters,
  onOpenAddModal,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedBranch !== 'All';

  return (
    <div className="search-filter-card">
      <div className="search-filter-controls">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-input-icon" />
          <input
            id="student-search-input"
            type="text"
            className="search-input"
            placeholder="Search by ID, Name, or Email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Branch Filter Dropdown */}
        <div className="filter-select-wrapper">
          <Filter size={16} className="filter-select-icon" />
          <label htmlFor="branch-filter-select" className="sr-only">
            Filter by Branch
          </label>
          <select
            id="branch-filter-select"
            className="branch-select"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
          >
            {BRANCH_OPTIONS.map((branch) => (
              <option key={branch} value={branch}>
                {branch === 'All' ? 'Branch: All' : `Branch: ${branch}`}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            id="reset-filters-btn"
            className="btn btn-outline"
            onClick={onResetFilters}
            title="Reset search and filters"
          >
            <X size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Primary Add Student Action */}
      <div className="search-filter-action">
        <button
          type="button"
          id="open-add-student-btn"
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
