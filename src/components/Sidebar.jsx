import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Settings, User, Zap } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'data', icon: Zap, label: 'Data Table' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="sidebar-content">
        {/* Logo */}
        <div className="logo-section">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap className="logo-icon" />
            <span className="logo-text">DATAPULSE</span>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Status */}
        <div className="sidebar-status">
          <div className="status-item">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          border-right: var(--border-glass);
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar-content {
          padding: var(--spacing-lg);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .logo-section {
          margin-bottom: var(--spacing-xl);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          color: var(--cyber-blue);
          filter: drop-shadow(0 0 10px var(--cyber-blue));
        }

        .logo-text {
          font-family: var(--font-primary);
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: transparent;
          border: none;
          border-radius: var(--border-radius);
          color: var(--text-secondary);
          font-family: var(--font-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          color: var(--cyber-blue);
          background: rgba(0, 255, 255, 0.1);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          min-width: 20px;
        }

        .nav-label {
          font-size: 0.9rem;
        }

        .nav-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: var(--cyber-blue);
          border-radius: 2px;
          box-shadow: 0 0 10px var(--cyber-blue);
        }

        .sidebar-status {
          margin-top: auto;
          padding-top: var(--spacing-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyber-green);
          box-shadow: 0 0 10px var(--cyber-green);
          animation: pulse 2s infinite;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </motion.aside>
  );
};

export default Sidebar;