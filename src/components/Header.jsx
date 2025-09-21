import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, RefreshCw, Search, User, ChevronLeft, ChevronRight } from 'lucide-react';

const Header = ({ onRefresh, lastUpdated, loading, onMenuToggle, onDesktopSidebarToggle, sidebarCollapsed }) => {
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.header 
      className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          {/* Mobile Hamburger Menu */}
          <motion.button
            className="menu-toggle mobile-only"
            onClick={onMenuToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </motion.button>

          {/* Desktop Sidebar Toggle */}
          <motion.button
            className="sidebar-toggle desktop-only"
            onClick={onDesktopSidebarToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.button>

          <div className="header-title">
            <h1 className="title-cyber">DataPulse Command Center</h1>
            <p className="subtitle-cyber">Live Store Activity Dashboard</p>
          </div>
        </div>

        {/* Center Section */}
        <div className="header-center">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search data..."
              className="search-input"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <div className="status-info">
            <span className="status-label">Last Update:</span>
            <span className="status-value">{formatLastUpdated(lastUpdated)}</span>
          </div>

          <motion.button
            className={`refresh-btn ${loading ? 'loading' : ''}`}
            onClick={onRefresh}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`refresh-icon ${loading ? 'spinning' : ''}`} size={16} />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            className="notification-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={16} />
            <span className="notification-badge">3</span>
          </motion.button>

          <motion.button
            className="profile-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={16} />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 70px;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          border-bottom: var(--border-glass);
          position: fixed;
          top: 0;
          left: 250px;
          right: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          transition: left 0.3s ease;
        }

        .header.sidebar-collapsed {
          left: 70px;
        }

        .header-content {
          width: 100%;
          padding: 0 var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-lg);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .menu-toggle,
        .sidebar-toggle {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
          min-height: var(--touch-target-min);
          min-width: var(--touch-target-min);
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-md);
        }

        .menu-toggle:hover,
        .sidebar-toggle:hover {
          color: var(--cyber-blue);
          background: rgba(0, 255, 255, 0.1);
          border-color: rgba(0, 255, 255, 0.3);
        }

        .mobile-only {
          display: none;
        }

        .desktop-only {
          display: flex;
        }

        .header-title h1 {
          font-size: 1.5rem;
          margin: 0;
          margin-bottom: 2px;
        }

        .header-title p {
          font-size: 0.8rem;
          margin: 0;
          opacity: 0.8;
        }

        .header-center {
          flex: 1;
          max-width: 400px;
          display: flex;
          justify-content: center;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-sm);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2.5rem;
          color: var(--text-primary);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
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

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
          justify-content: flex-end;
        }

        .status-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.8rem;
        }

        .status-label {
          color: var(--text-muted);
        }

        .status-value {
          color: var(--cyber-blue);
          font-family: var(--font-primary);
          font-weight: 600;
        }

        .refresh-btn {
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
          min-height: var(--touch-target-min);
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-icon {
          transition: transform 0.3s ease;
        }

        .refresh-icon.spinning {
          animation: spin 1s linear infinite;
        }

        .notification-btn,
        .profile-btn {
          position: relative;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: var(--touch-target-min);
          min-width: var(--touch-target-min);
        }

        .notification-btn:hover,
        .profile-btn:hover {
          color: var(--cyber-blue);
          border-color: rgba(0, 255, 255, 0.3);
          background: rgba(0, 255, 255, 0.1);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--cyber-pink);
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .header {
            left: 0;
            padding: 0;
          }
          
          .header.sidebar-collapsed {
            left: 0; /* Reset on mobile */
          }
          
          .header-content {
            padding: 0 var(--spacing-mobile-md);
            gap: var(--spacing-mobile-sm);
          }

          .mobile-only {
            display: flex;
            min-height: var(--touch-target-comfortable);
            min-width: var(--touch-target-comfortable);
          }

          .desktop-only {
            display: none;
          }

          .header-center {
            display: none;
          }

          .status-info {
            display: none;
          }
          
          .header-right {
            gap: var(--spacing-mobile-sm);
          }
          
          .notification-btn,
          .profile-btn {
            width: var(--touch-target-comfortable);
            height: var(--touch-target-comfortable);
          }
          
          .refresh-btn {
            min-height: var(--touch-target-comfortable);
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: 0 var(--spacing-mobile-sm);
          }
          
          .header-title h1 {
            font-size: 1.2rem;
          }

          .header-title p {
            display: none;
          }

          .refresh-btn span {
            display: none;
          }
          
          .refresh-btn {
            padding: var(--spacing-mobile-sm);
            min-width: var(--touch-target-comfortable);
          }
        }
        
        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .header {
            height: 60px;
          }
          
          .header-title h1 {
            font-size: 1.1rem;
          }
          
          .notification-btn,
          .profile-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;