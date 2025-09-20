import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardData } from './hooks/useDashboardData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import Chatbot from './components/Chatbot';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  // Use our custom hook for data management
  const { data, loading, error, lastUpdated, refresh } = useDashboardData(30000);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChatbotToggle = () => {
    setChatbotOpen(!chatbotOpen);
  };

  const handleDashboardUpdate = (updateData) => {
    // Handle dynamic dashboard updates from chatbot responses
    console.log('Dashboard update requested:', updateData);
    
    // Example: Force refresh if chatbot suggests it
    if (updateData.refresh || updateData.refreshDashboard) {
      refresh();
    }
    
    // Handle navigation updates
    if (updateData.navigateTo) {
      setActiveView(updateData.navigateTo);
    }
    
    // You can add more update logic here based on the webhook response
    // For example: update specific KPIs, highlight certain data, etc.
  };

  const handleChatbotNavigation = (viewName) => {
    setActiveView(viewName);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            data={data} 
            loading={loading} 
            onRefresh={refresh}
          />
        );
      case 'analytics':
        return (
          <div className="view-container">
            <motion.div
              className="coming-soon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="title-cyber">Advanced Analytics</h2>
              <p className="subtitle-cyber">Coming Soon</p>
              <div className="neon-border p-lg">
                <p>This section will contain:</p>
                <ul>
                  <li>Advanced statistical analysis</li>
                  <li>Predictive modeling</li>
                  <li>Trend forecasting</li>
                  <li>Custom report generation</li>
                </ul>
              </div>
            </motion.div>
          </div>
        );
      case 'data':
        return (
          <div className="view-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="page-header">
                <h2 className="title-cyber">Data Explorer</h2>
                <p className="subtitle-cyber">Raw data table with advanced filtering</p>
              </div>
              <DataTable data={data} loading={loading} />
            </motion.div>
          </div>
        );
      case 'profile':
        return (
          <div className="view-container">
            <motion.div
              className="coming-soon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="title-cyber">User Profile</h2>
              <p className="subtitle-cyber">Personalization Hub</p>
              <div className="neon-border p-lg">
                <p>Customize your dashboard experience:</p>
                <ul>
                  <li>Theme preferences</li>
                  <li>Widget configurations</li>
                  <li>Data source settings</li>
                  <li>Notification preferences</li>
                </ul>
              </div>
            </motion.div>
          </div>
        );
      case 'settings':
        return (
          <div className="view-container">
            <motion.div
              className="coming-soon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="title-cyber">System Settings</h2>
              <p className="subtitle-cyber">Configuration Center</p>
              <div className="neon-border p-lg">
                <p>System configuration options:</p>
                <ul>
                  <li>Data refresh intervals</li>
                  <li>API endpoints</li>
                  <li>Security settings</li>
                  <li>Export preferences</li>
                </ul>
              </div>
            </motion.div>
          </div>
        );
      default:
        return (
          <Dashboard 
            data={data} 
            loading={loading} 
            onRefresh={refresh}
          />
        );
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <motion.div
          className="error-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="error-title">Connection Error</h2>
          <p className="error-message">{error}</p>
          <motion.button
            className="btn-cyber"
            onClick={refresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry Connection
          </motion.button>
        </motion.div>
        
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            padding: var(--spacing-lg);
          }

          .error-content {
            text-align: center;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: var(--border-glass);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-xxl);
            box-shadow: var(--shadow-glass);
            max-width: 500px;
          }

          .error-title {
            font-family: var(--font-primary);
            font-size: 2rem;
            color: var(--cyber-pink);
            margin-bottom: var(--spacing-lg);
          }

          .error-message {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xl);
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`main-content ${chatbotOpen ? 'chatbot-open' : ''}`}>
        <Header 
          onRefresh={refresh}
          lastUpdated={lastUpdated}
          loading={loading}
          onMenuToggle={handleMenuToggle}
        />
        
        <main className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chatbot */}
      <AnimatePresence>
        <Chatbot
          isOpen={chatbotOpen}
          onToggle={handleChatbotToggle}
          onUpdateDashboard={handleDashboardUpdate}
          onNavigate={handleChatbotNavigation}
          dashboardData={data}
          activeView={activeView}
        />
      </AnimatePresence>

      <style jsx>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-secondary);
        }

        .sidebar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: none;
        }

        .main-content {
          flex: 1;
          margin-left: 250px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease, margin-right 0.3s ease;
        }

        .main-content.chatbot-open {
          margin-right: 380px;
        }

        .content-area {
          flex: 1;
          margin-top: 70px;
          overflow-y: auto;
        }

        .view-container {
          padding: var(--spacing-lg);
          min-height: calc(100vh - 70px);
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: var(--spacing-xl);
          text-align: left;
        }

        .coming-soon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          gap: var(--spacing-lg);
        }

        .coming-soon h2 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
        }

        .coming-soon p {
          font-size: 1.2rem;
          margin-bottom: var(--spacing-xl);
        }

        .coming-soon ul {
          text-align: left;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .coming-soon li {
          margin-bottom: var(--spacing-xs);
        }

        @media (max-width: 768px) {
          .sidebar-wrapper {
            transform: translateX(-100%);
          }

          .sidebar-wrapper.open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block;
          }

          .main-content,
          .main-content.chatbot-open {
            margin-left: 0;
            margin-right: 0;
          }

          .view-container {
            padding: var(--spacing-md);
          }

          .coming-soon h2 {
            font-size: 2rem;
          }

          .coming-soon p {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .coming-soon h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;