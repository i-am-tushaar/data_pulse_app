import React from 'react';
import { motion } from 'framer-motion';
import KPIGrid from './KPIGrid';
import ChartsGrid from './ChartsGrid';
import DataTable from './DataTable';

const Dashboard = ({ data, loading, onRefresh }) => {
  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-content">
        {/* Welcome Section */}
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="welcome-content">
            <h1 className="welcome-title">DataPulse – Reflects real-time data heartbeat</h1>
            <p className="welcome-subtitle">
              Live store activity and insights from your Google Sheets
            </p>
          </div>
          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot active"></div>
              <span>Live Data</span>
            </div>
            <div className="status-item">
              <div className="status-dot active"></div>
              <span>Real-time Sync</span>
            </div>
            <div className="status-item">
              <div className="status-dot active"></div>
              <span>Auto Refresh</span>
            </div>
          </div>
        </motion.div>

        {/* KPI Section */}
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="section-header">
            <h2 className="section-title">Key Performance Indicators</h2>
            <p className="section-subtitle">Critical metrics at a glance</p>
          </div>
          <KPIGrid data={data} loading={loading} />
        </motion.section>

        {/* Charts Section */}
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="section-header">
            <h2 className="section-title">Analytics & Visualizations</h2>
            <p className="section-subtitle">Interactive data insights</p>
          </div>
          <ChartsGrid data={data} loading={loading} />
        </motion.section>

        {/* Data Table Section */}
        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="section-header">
            <h2 className="section-title">Raw Data Explorer</h2>
            <p className="section-subtitle">Detailed data table with filtering</p>
          </div>
          <DataTable data={data} loading={loading} />
        </motion.section>
      </div>

      <style jsx>{`
        .dashboard {
          padding: var(--spacing-lg);
          min-height: calc(100vh - 70px);
          background: transparent;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xxl);
          padding: var(--spacing-xl);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border: var(--border-glass);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-glass);
          position: relative;
          overflow: hidden;
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-primary);
        }

        .welcome-content {
          flex: 1;
        }

        .welcome-title {
          font-family: var(--font-primary);
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 var(--spacing-sm) 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .welcome-subtitle {
          font-family: var(--font-secondary);
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .status-indicators {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          align-items: flex-end;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
        }

        .status-dot.active {
          background: var(--cyber-green);
          box-shadow: 0 0 10px var(--cyber-green);
          animation: pulse 2s infinite;
        }

        .dashboard-section {
          margin-bottom: var(--spacing-xxl);
        }

        .section-header {
          margin-bottom: var(--spacing-xl);
          text-align: left;
        }

        .section-title {
          font-family: var(--font-primary);
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 var(--spacing-xs) 0;
          background: var(--gradient-secondary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-family: var(--font-secondary);
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 255, 65, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0); }
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: var(--spacing-md);
          }

          .welcome-section {
            flex-direction: column;
            gap: var(--spacing-lg);
            text-align: center;
            padding: var(--spacing-lg);
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .status-indicators {
            align-items: center;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-subtitle {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-title {
            font-size: 1.5rem;
          }

          .welcome-subtitle {
            font-size: 0.9rem;
          }

          .section-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;