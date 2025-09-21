import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
        
        <style jsx>{`
          .custom-tooltip {
            background: var(--bg-glass-dark);
            backdrop-filter: blur(20px);
            border: var(--border-glass);
            border-radius: var(--border-radius);
            padding: var(--spacing-sm);
            box-shadow: var(--shadow-glass);
            font-family: var(--font-secondary);
          }

          .tooltip-label {
            color: var(--text-primary);
            font-weight: 600;
            margin: 0 0 var(--spacing-xs) 0;
            font-size: 0.9rem;
          }

          .tooltip-value {
            margin: 0;
            font-size: 0.8rem;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }
  return null;
};

// Revenue Trend Chart
const RevenueTrendChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Revenue Trends</h3>
      <p className="chart-subtitle">Daily revenue performance</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.revenueByDate}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00ffff" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#808080"
            fontSize={12}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00ffff"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={{ fill: "#00ffff", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#00ffff", strokeWidth: 2, fill: "#00ffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Orders Timeline Chart
const OrdersTimelineChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Orders Timeline</h3>
      <p className="chart-subtitle">Daily order volume</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.ordersTimeline}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#808080"
            fontSize={12}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#ff0080"
            strokeWidth={3}
            dot={{ fill: "#ff0080", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#ff0080", strokeWidth: 2, fill: "#ff0080" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// State Distribution Chart
const StateDistributionChart = ({ data }) => {
  const COLORS = ['#00ffff', '#ff0080', '#8000ff', '#00ff41', '#ff6b00', '#ffff00'];

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">Top States</h3>
        <p className="chart-subtitle">Order distribution by state</p>
      </div>
      
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.stateDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.stateDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#b0b0b0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Top Cities Chart
const TopCitiesChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Top Cities</h3>
      <p className="chart-subtitle">Most active cities by orders</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.topCities.slice(0, 8)} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number"
            stroke="#808080"
            fontSize={12}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#808080"
            fontSize={12}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#cityGradient)"
            radius={[0, 4, 4, 0]}
          >
            <defs>
              <linearGradient id="cityGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#8000ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff0080" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Main Charts Grid Component
const ChartsGrid = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="charts-grid">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="chart-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="loading-cyber"></div>
          </motion.div>
        ))}
        
        <style jsx>{`
          .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
          }

          .chart-skeleton {
            height: 380px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: var(--border-glass);
            border-radius: var(--border-radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Mobile Responsive Styles */
          @media (max-width: 768px) {
            .charts-grid {
              grid-template-columns: 1fr;
              gap: var(--spacing-mobile-md);
              margin-bottom: var(--spacing-mobile-xl);
            }
            
            .chart-skeleton {
              height: 300px;
            }
          }
          
          @media (max-width: 480px) {
            .charts-grid {
              gap: var(--spacing-mobile-sm);
            }
            
            .chart-skeleton {
              height: 280px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="charts-grid">
      <RevenueTrendChart data={data} />
      <OrdersTimelineChart data={data} />
      <StateDistributionChart data={data} />
      <TopCitiesChart data={data} />

      <style jsx>{`
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .chart-container {
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

        .chart-container::before {
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

        .chart-container:hover::before {
          transform: scaleX(1);
        }

        .chart-container:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 
            var(--shadow-glass),
            0 0 30px rgba(0, 255, 255, 0.1);
        }

        .chart-header {
          margin-bottom: var(--spacing-lg);
        }

        .chart-title {
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

        .chart-subtitle {
          font-family: var(--font-secondary);
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .chart-content {
          position: relative;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-mobile-md);
          }

          .chart-container {
            padding: var(--spacing-mobile-md);
          }
          
          .chart-header {
            margin-bottom: var(--spacing-mobile-lg);
          }
          
          .chart-title {
            font-size: 1.1rem;
          }
          
          .chart-subtitle {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .charts-grid {
            gap: var(--spacing-mobile-sm);
          }
          
          .chart-container {
            padding: var(--spacing-mobile-sm);
          }
          
          .chart-title {
            font-size: 1rem;
          }
          
          .chart-subtitle {
            font-size: 0.7rem;
          }
        }
        
        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .chart-container {
            padding: var(--spacing-mobile-sm);
          }
          
          .chart-header {
            margin-bottom: var(--spacing-mobile-md);
          }
        }
      `}</style>
    </div>
  );
};

export default ChartsGrid;