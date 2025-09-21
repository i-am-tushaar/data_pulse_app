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
            tick={{ fill: '#808080' }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
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
    
    <div className="key-findings">
      <h4 className="findings-title">💰 Key Findings</h4>
      <ul className="findings-list">
        {data.revenueByDate?.length > 0 && (
          <li className="finding-item highlight">
            <strong>Peak Revenue:</strong> ₹{((Math.max(...data.revenueByDate.map(d => d.revenue))) / 100000).toFixed(1)}L on best day
          </li>
        )}
        {data.revenueByDate?.length > 1 && (
          <li className="finding-item">
            Average daily revenue: ₹{((data.totalRevenue / data.revenueByDate.length) / 100000).toFixed(1)}L
          </li>
        )}
        {data.revenueByDate?.some(d => d.revenue > 0) && (
          <li className="finding-item">
            Revenue trend shows {data.revenueByDate.slice(-7).reduce((sum, d) => sum + d.revenue, 0) > data.revenueByDate.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0) ? 'growing' : 'declining'} pattern
          </li>
        )}
      </ul>
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
            tick={{ fill: '#808080' }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
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
    
    <div className="key-findings">
      <h4 className="findings-title">📋 Key Findings</h4>
      <ul className="findings-list">
        {data.ordersTimeline?.length > 0 && (
          <li className="finding-item highlight">
            <strong>Peak Orders:</strong> {Math.max(...data.ordersTimeline.map(d => d.orders))} orders on busiest day
          </li>
        )}
        {data.ordersTimeline?.length > 1 && (
          <li className="finding-item">
            Average daily orders: {Math.round(data.totalOrders / data.ordersTimeline.length)} per day
          </li>
        )}
        {data.ordersTimeline?.some(d => d.orders > 0) && (
          <li className="finding-item">
            Order pattern shows {data.ordersTimeline.slice(-7).reduce((sum, d) => sum + d.orders, 0) > data.ordersTimeline.slice(-14, -7).reduce((sum, d) => sum + d.orders, 0) ? 'increasing' : 'stable'} activity
          </li>
        )}
      </ul>
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
      
      <div className="key-findings">
        <h4 className="findings-title">🗺️ Key Findings</h4>
        <ul className="findings-list">
          {data.stateDistribution?.length > 0 && (
            <li className="finding-item highlight">
              <strong>{data.stateDistribution[0].name}</strong> leads with {Math.round((data.stateDistribution[0].value / data.totalOrders) * 100)}% of orders
            </li>
          )}
          {data.stateDistribution?.length > 1 && (
            <li className="finding-item">
              Top 3 states capture {Math.round((data.stateDistribution.slice(0, 3).reduce((sum, state) => sum + state.value, 0) / data.totalOrders) * 100)}% of market
            </li>
          )}
          {data.stateDistribution?.length > 3 && (
            <li className="finding-item">
              Geographic spread across {data.stateDistribution.length} major states
            </li>
          )}
        </ul>
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
        <BarChart data={data.topCities?.slice(0, 8) || []} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="cityGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#8000ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff0080" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number"
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#808080"
            fontSize={12}
            width={100}
            tick={{ fill: '#808080' }}
            interval={0}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Bar 
            dataKey="value" 
            fill="url(#cityGradient)"
            radius={[0, 4, 4, 0]}
            stroke="rgba(128, 0, 255, 0.5)"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    <div className="key-findings">
      <h4 className="findings-title">📍 Key Findings</h4>
      <ul className="findings-list">
        {data.topCities?.length > 0 && (
          <li className="finding-item highlight">
            <strong>{data.topCities[0].name}</strong> leads with {data.topCities[0].value} orders
          </li>
        )}
        {data.topCities?.length > 1 && (
          <li className="finding-item">
            Top 3 cities account for {Math.round((data.topCities.slice(0, 3).reduce((sum, city) => sum + city.value, 0) / data.totalOrders) * 100)}% of total orders
          </li>
        )}
        {data.topCities?.length > 5 && (
          <li className="finding-item">
            Geographic concentration: {data.topCities.length} cities generating significant order volume
          </li>
        )}
      </ul>
    </div>
  </motion.div>
);

// Customer Growth Trend Chart
const CustomerGrowthChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Customer Growth Trend</h3>
      <p className="chart-subtitle">Active customer base growth over time</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.customerGrowthTrend || []}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff41" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00ff41" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativeCustomers"
            stroke="#00ff41"
            strokeWidth={2}
            fill="url(#growthGradient)"
            dot={{ fill: "#00ff41", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#00ff41", strokeWidth: 2, fill: "#00ff41" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    
    <div className="key-findings">
      <h4 className="findings-title">📈 Key Findings</h4>
      <ul className="findings-list">
        {data.customerGrowthTrend?.length > 0 && (
          <li className="finding-item highlight">
            <strong>Total Growth:</strong> {data.customerGrowthTrend[data.customerGrowthTrend.length - 1]?.cumulativeCustomers || 0} customers acquired
          </li>
        )}
        {data.customerGrowthTrend?.length > 1 && (
          <li className="finding-item">
            Average daily growth: {Math.round((data.customerGrowthTrend.reduce((sum, day) => sum + day.newCustomers, 0) / data.customerGrowthTrend.length) * 10) / 10} new customers per day
          </li>
        )}
        {data.customerGrowthTrend?.some(day => day.newCustomers > 0) && (
          <li className="finding-item">
            Growth trajectory shows {data.customerGrowthTrend.filter(day => day.newCustomers > 0).length > data.customerGrowthTrend.length * 0.7 ? 'consistent' : 'variable'} customer acquisition
          </li>
        )}
      </ul>
    </div>
  </motion.div>
);

// Revenue by Category Chart
const RevenueByCategoryChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Revenue by Category</h3>
      <p className="chart-subtitle">Performance by product category</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.revenueByCategory || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffff00" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name"
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            formatter={(value, name) => [
              name === 'revenue' ? `₹${(value / 100000).toFixed(1)}L` : value,
              name === 'revenue' ? 'Revenue' : 'Orders'
            ]}
          />
          <Bar 
            dataKey="revenue" 
            fill="url(#categoryGradient)"
            radius={[4, 4, 0, 0]}
            stroke="rgba(255, 255, 0, 0.5)"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    <div className="key-findings">
      <h4 className="findings-title">💰 Key Findings</h4>
      <ul className="findings-list">
        {data.revenueByCategory?.length > 0 && (
          <li className="finding-item highlight">
            <strong>{data.revenueByCategory[0].name}</strong> leads revenue with ₹{(data.revenueByCategory[0].revenue / 100000).toFixed(1)}L
          </li>
        )}
        {data.revenueByCategory?.length > 1 && (
          <li className="finding-item">
            Top 3 categories generate {Math.round((data.revenueByCategory.slice(0, 3).reduce((sum, cat) => sum + cat.revenue, 0) / data.totalRevenue) * 100)}% of total revenue
          </li>
        )}
        {data.revenueByCategory?.length > 2 && (
          <li className="finding-item">
            Revenue distribution across {data.revenueByCategory.length} product categories
          </li>
        )}
      </ul>
    </div>
  </motion.div>
);

// Order Frequency Chart
const OrderFrequencyChart = ({ data }) => (
  <motion.div
    className="chart-container"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.7 }}
  >
    <div className="chart-header">
      <h3 className="chart-title">Order Frequency</h3>
      <p className="chart-subtitle">Customer purchase behavior analysis</p>
    </div>
    
    <div className="chart-content">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.orderFrequencyData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="frequencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff0080" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8000ff" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="range"
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
          />
          <YAxis 
            stroke="#808080"
            fontSize={12}
            tick={{ fill: '#808080' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="customers" 
            fill="url(#frequencyGradient)"
            radius={[4, 4, 0, 0]}
            stroke="rgba(255, 0, 128, 0.5)"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    <div className="key-findings">
      <h4 className="findings-title">🔁 Key Findings</h4>
      <ul className="findings-list">
        {data.orderFrequencyData?.length > 0 && (
          <li className="finding-item highlight">
            <strong>{Math.round((data.customerRetentionMetrics?.oneTimeCustomers / data.uniqueCustomers) * 100)}%</strong> are one-time customers
          </li>
        )}
        {data.customerRetentionMetrics && (
          <li className="finding-item">
            Customer retention rate: <strong>{data.customerRetentionMetrics.retentionRate}%</strong>
          </li>
        )}
        {data.orderFrequencyData?.find(item => item.range.includes('10+')) && (
          <li className="finding-item">
            {data.orderFrequencyData.find(item => item.range.includes('10+')).customers} high-value repeat customers (10+ orders)
          </li>
        )}
      </ul>
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
      <CustomerGrowthChart data={data} />
      <RevenueByCategoryChart data={data} />
      <OrderFrequencyChart data={data} />

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
        
        /* Key Findings Styles */
        .key-findings {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .findings-title {
          font-family: var(--font-primary);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-accent);
          margin: 0 0 var(--spacing-sm) 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .findings-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .finding-item {
          font-family: var(--font-secondary);
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
          padding-left: var(--spacing-sm);
          position: relative;
          line-height: 1.4;
        }
        
        .finding-item::before {
          content: '▶';
          position: absolute;
          left: 0;
          color: var(--text-accent);
          font-size: 0.6rem;
          top: 0.2em;
        }
        
        .finding-item.highlight {
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .finding-item.highlight::before {
          content: '⭐';
          font-size: 0.7rem;
        }
        
        @media (max-width: 768px) {
          .key-findings {
            margin-top: var(--spacing-mobile-md);
            padding-top: var(--spacing-mobile-sm);
          }
          
          .findings-title {
            font-size: 0.85rem;
          }
          
          .finding-item {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartsGrid;