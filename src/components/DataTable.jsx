import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, ChevronUp, ChevronDown, Eye } from 'lucide-react';

const DataTable = ({ data, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('order_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const rawData = data?.rawData || [];

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    let filtered = rawData.filter(row => {
      const matchesSearch = !searchTerm || 
        Object.values(row).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesState = !selectedState || row.state === selectedState;
      const matchesCity = !selectedCity || row.city === selectedCity;
      
      return matchesSearch && matchesState && matchesCity;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'order_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortField === 'order_id') {
        aVal = parseInt(aVal, 10) || 0;
        bVal = parseInt(bVal, 10) || 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [rawData, searchTerm, sortField, sortDirection, selectedState, selectedCity]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Get unique values for filters
  const uniqueStates = [...new Set(rawData.map(row => row.state).filter(Boolean))].sort();
  const uniqueCities = [...new Set(rawData.map(row => row.city).filter(Boolean))].sort();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(filteredData[0] || {}).join(','),
      ...filteredData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'order_id', label: 'Order ID', sortable: true },
    { key: 'order_date', label: 'Date', sortable: true },
    { key: 'customer_name', label: 'Customer', sortable: true },
    { key: 'email_id', label: 'Email ID', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'city', label: 'City', sortable: true },
  ];

  if (loading) {
    return (
      <motion.div
        className="table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="table-header">
          <h3 className="table-title">Data Table</h3>
        </div>
        <div className="table-skeleton">
          <div className="loading-cyber"></div>
        </div>

        <style jsx>{`
          .table-container {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: var(--border-glass);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-glass);
          }

          .table-header {
            margin-bottom: var(--spacing-lg);
          }

          .table-title {
            font-family: var(--font-primary);
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .table-skeleton {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Table Header */}
      <div className="table-header">
        <div className="table-title-section">
          <h3 className="table-title">Data Table</h3>
          <p className="table-subtitle">
            {filteredData.length} of {rawData.length} records
          </p>
        </div>

        <div className="table-controls">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <motion.button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span>Filters</span>
          </motion.button>

          <motion.button
            className="export-btn"
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-grid">
              <div className="filter-group">
                <label>State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                  className="filter-select"
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="header-content">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="sort-icons">
                        <ChevronUp
                          size={14}
                          className={`sort-icon ${
                            sortField === column.key && sortDirection === 'asc' ? 'active' : ''
                          }`}
                        />
                        <ChevronDown
                          size={14}
                          className={`sort-icon ${
                            sortField === column.key && sortDirection === 'desc' ? 'active' : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={row.order_id || index}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0, 255, 255, 0.05)' }}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {column.key === 'order_date' && row[column.key]
                        ? new Date(row[column.key]).toLocaleDateString()
                        : column.key === 'email_id' && row[column.key]
                        ? (
                            <a 
                              href={`mailto:${row[column.key]}`} 
                              className="email-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {row[column.key]}
                            </a>
                          )
                        : row[column.key] || 'N/A'}
                    </td>
                  ))}
                  <td className="table-cell">
                    <motion.button
                      className="action-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={14} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <motion.button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>

          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          <motion.button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      )}

      <style jsx>{`
        .table-container {
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border: var(--border-glass);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-glass);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .table-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .table-container:hover::before {
          transform: scaleX(1);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-lg);
          gap: var(--spacing-lg);
        }

        .table-title-section {
          flex: 1;
        }

        .table-title {
          font-family: var(--font-primary);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .table-subtitle {
          font-family: var(--font-secondary);
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .table-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-sm);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2.5rem;
          color: var(--text-primary);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          width: 250px;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--cyber-blue);
          box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
        }

        .filter-btn,
        .export-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--cyber-blue);
          font-family: var(--font-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover,
        .export-btn:hover {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .filters-section {
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--border-radius);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .filter-group label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm);
          color: var(--text-primary);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--cyber-blue);
          box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: var(--spacing-lg);
          -webkit-overflow-scrolling: touch;
          position: relative;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-secondary);
          min-width: 600px;
        }

        .table-header-cell {
          background: rgba(255, 255, 255, 0.05);
          padding: var(--spacing-md);
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .table-header-cell.sortable {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .table-header-cell.sortable:hover {
          background: rgba(0, 255, 255, 0.1);
          color: var(--cyber-blue);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sort-icons {
          display: flex;
          flex-direction: column;
          margin-left: var(--spacing-xs);
        }

        .sort-icon {
          color: var(--text-muted);
          transition: color 0.3s ease;
        }

        .sort-icon.active {
          color: var(--cyber-blue);
        }

        .table-row {
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: rgba(0, 255, 255, 0.05);
        }

        .table-cell {
          padding: var(--spacing-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .email-link {
          color: var(--cyber-blue);
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 4px;
          padding: 2px 4px;
        }

        .email-link:hover {
          color: var(--cyber-pink);
          background: rgba(0, 255, 255, 0.1);
          text-shadow: 0 0 5px currentColor;
        }

        .action-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          color: var(--cyber-blue);
          border-color: rgba(0, 255, 255, 0.3);
          background: rgba(0, 255, 255, 0.1);
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-lg);
        }

        .pagination-btn {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--cyber-blue);
          font-family: var(--font-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-family: var(--font-primary);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            gap: var(--spacing-mobile-md);
          }

          .table-controls {
            flex-wrap: wrap;
            width: 100%;
            gap: var(--spacing-mobile-sm);
          }

          .search-input {
            width: 100%;
            font-size: 16px;
          }
          
          .filter-btn,
          .export-btn {
            min-height: var(--touch-target-comfortable);
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-mobile-md);
          }
          
          .filter-select {
            font-size: 16px;
            min-height: var(--touch-target-comfortable);
          }
          
          .table-wrapper {
            margin-bottom: var(--spacing-mobile-lg);
          }
          
          .data-table {
            min-width: 800px;
          }
          
          .table-header-cell {
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
            font-size: 0.8rem;
          }
          
          .table-cell {
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
            font-size: 0.85rem;
          }
          
          .action-btn {
            width: var(--touch-target-comfortable);
            height: var(--touch-target-comfortable);
          }
          
          .pagination {
            gap: var(--spacing-mobile-md);
          }
          
          .pagination-btn {
            min-height: var(--touch-target-comfortable);
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
          }
        }
        
        @media (max-width: 480px) {
          .table-header {
            gap: var(--spacing-mobile-sm);
          }
          
          .table-controls {
            gap: var(--spacing-mobile-xs);
          }
          
          .search-container {
            order: -1;
            width: 100%;
          }
          
          .filter-btn span,
          .export-btn span {
            display: none;
          }
          
          .data-table {
            min-width: 700px;
          }
          
          .table-header-cell {
            padding: var(--spacing-mobile-xs) var(--spacing-mobile-sm);
            font-size: 0.75rem;
          }
          
          .table-cell {
            padding: var(--spacing-mobile-xs) var(--spacing-mobile-sm);
            font-size: 0.8rem;
          }
          
          .pagination-info {
            font-size: 0.8rem;
          }
        }
        
        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .table-header {
            flex-direction: row;
            align-items: center;
          }
          
          .table-controls {
            flex-wrap: nowrap;
          }
          
          .search-input {
            width: 200px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default DataTable;