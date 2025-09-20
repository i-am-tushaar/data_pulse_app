import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Target, Mail } from 'lucide-react';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color, delay = 0 }) => {
  const isPositiveTrend = trend === 'up';
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      className={`kpi-card ${color}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="kpi-header">
        <div className="kpi-icon-container">
          <Icon className="kpi-icon" />
        </div>
        <div className="kpi-trend">
          <TrendIcon 
            className={`trend-icon ${isPositiveTrend ? 'positive' : 'negative'}`} 
            size={16} 
          />
          <span className={`trend-value ${isPositiveTrend ? 'positive' : 'negative'}`}>
            {trendValue}
          </span>
        </div>
      </div>

      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-value">{value}</div>
        <p className="kpi-subtitle">{subtitle}</p>
      </div>

      <div className="kpi-background-effect"></div>

      <style jsx>{`
        .kpi-card {
          position: relative;
          padding: var(--spacing-lg);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border: var(--border-glass);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-glass);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .kpi-card:hover::before {
          opacity: 1;
        }

        .kpi-card:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 
            var(--shadow-glass),
            0 0 30px rgba(0, 255, 255, 0.15);
        }

        .kpi-card.blue {
          --accent-color: var(--cyber-blue);
        }

        .kpi-card.pink {
          --accent-color: var(--cyber-pink);
        }

        .kpi-card.green {
          --accent-color: var(--cyber-green);
        }

        .kpi-card.purple {
          --accent-color: var(--cyber-purple);
        }

        .kpi-card.orange {
          --accent-color: var(--cyber-orange);
        }

        .kpi-card.orange {
          --accent-color: var(--cyber-orange);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }

        .kpi-icon-container {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .kpi-icon {
          width: 24px;
          height: 24px;
          color: var(--accent-color);
          filter: drop-shadow(0 0 10px var(--accent-color));
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius);
          padding: var(--spacing-xs) var(--spacing-sm);
        }

        .trend-icon.positive {
          color: var(--cyber-green);
        }

        .trend-icon.negative {
          color: var(--cyber-pink);
        }

        .trend-value {
          font-size: 0.8rem;
          font-weight: 600;
          font-family: var(--font-primary);
        }

        .trend-value.positive {
          color: var(--cyber-green);
        }

        .trend-value.negative {
          color: var(--cyber-pink);
        }

        .kpi-content {
          flex: 1;
        }

        .kpi-title {
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 var(--spacing-sm) 0;
        }

        .kpi-value {
          font-family: var(--font-primary);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
          background: linear-gradient(135deg, var(--accent-color), var(--text-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .kpi-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .kpi-background-effect {
          position: absolute;
          top: 50%;
          right: -20px;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
          opacity: 0.05;
          border-radius: 50%;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .kpi-card {
            min-height: 140px;
            padding: var(--spacing-md);
          }

          .kpi-value {
            font-size: 1.5rem;
          }

          .kpi-icon-container {
            width: 40px;
            height: 40px;
          }

          .kpi-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </motion.div>
  );
};

const KPIGrid = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="kpi-grid">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="kpi-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="loading-cyber"></div>
          </motion.div>
        ))}
        
        <style jsx>{`
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
          }

          .kpi-skeleton {
            height: 160px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: var(--border-glass);
            border-radius: var(--border-radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media (max-width: 768px) {
            .kpi-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const kpiData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      subtitle: 'Total revenue from all orders',
      icon: DollarSign,
      trend: 'up',
      trendValue: '+12.5%',
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: formatNumber(data.totalOrders),
      subtitle: 'Orders processed successfully',
      icon: ShoppingCart,
      trend: 'up',
      trendValue: '+8.2%',
      color: 'blue'
    },
    {
      title: 'Unique Customers',
      value: formatNumber(data.uniqueCustomers),
      subtitle: 'Active customer base',
      icon: Users,
      trend: 'up',
      trendValue: '+15.3%',
      color: 'purple'
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(data.avgOrderValue),
      subtitle: 'Average value per order',
      icon: Target,
      trend: 'down',
      trendValue: '-3.1%',
      color: 'pink'
    }
  ];

  // Add email coverage KPI if email data is available
  if (data.emailMetrics && data.emailMetrics.totalWithEmails > 0) {
    kpiData.push({
      title: 'Email Coverage',
      value: `${data.emailMetrics.emailCoverage}%`,
      subtitle: `${data.emailMetrics.totalWithEmails} customers with emails`,
      icon: Mail,
      trend: 'up',
      trendValue: '+5.7%',
      color: 'orange'
    });
  }

  return (
    <div className="kpi-grid">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={kpi.title}
          {...kpi}
          delay={index * 0.1}
        />
      ))}

      <style jsx>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default KPIGrid;