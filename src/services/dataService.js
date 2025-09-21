import Papa from 'papaparse';

// Google Sheets CSV URL with Email ID support
// Updated to include filename parameter and Email ID column processing
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1hiD-Vs1rAM1s9sR9CBpFoIIrK2Rq5NJ7fjPK0mgcw6s/export?format=csv&filename=sheet_data.csv';

/**
 * Fetch data from Google Sheets CSV
 * @returns {Promise<Array>} Parsed CSV data
 */
export const fetchGoogleSheetsData = async () => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Clean up header names and handle Email Id specifically
          const cleanHeader = header.trim().toLowerCase();
          if (cleanHeader === 'email id' || cleanHeader === 'email_id' || cleanHeader === 'emailid') {
            return 'email_id';
          }
          return cleanHeader.replace(/\s+/g, '_');
        },
        transform: (value, field) => {
          // Transform specific fields
          if (field === 'order_date' && value) {
            return new Date(value);
          }
          
          // Convert numeric fields
          if (field === 'order_id' && value) {
            return parseInt(value, 10);
          }
          
          // Validate and clean email addresses
          if (field === 'email_id' && value) {
            const email = value.trim().toLowerCase();
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) ? email : value.trim();
          }
          
          // Clean up text fields
          if (typeof value === 'string') {
            return value.trim();
          }
          
          return value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
};

/**
 * Process raw data for dashboard metrics
 * @param {Array} data - Raw CSV data
 * @returns {Object} Processed metrics
 */
export const processDataForMetrics = (data) => {
  if (!data || data.length === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      uniqueCustomers: 0,
      avgOrderValue: 0,
      emailMetrics: {
        totalWithEmails: 0,
        uniqueEmails: 0,
        emailCoverage: 0
      },
      topStates: [],
      topCities: [],
      revenueByDate: [],
      ordersTimeline: [],
      stateDistribution: [],
      cityDistribution: [],
      customerGrowthTrend: [],
      revenueByCategory: [],
      orderFrequencyData: [],
      customerRetentionMetrics: {
        retentionRate: 0,
        churnRate: 0,
        repeatCustomers: 0,
        oneTimeCustomers: 0
      }
    };
  }

  // Calculate basic metrics
  const totalOrders = data.length;
  const uniqueCustomers = new Set(data.map(row => row.customer_name)).size;
  
  // Email metrics
  const emailData = data.filter(row => row.email_id && row.email_id.trim());
  const uniqueEmails = new Set(emailData.map(row => row.email_id)).size;
  const emailCoverage = data.length > 0 ? Math.round((emailData.length / data.length) * 100) : 0;
  
  // Revenue calculation (assuming there might be an amount field or calculate based on order count)
  // For demo purposes, we'll generate revenue based on order patterns
  const revenuePerOrder = data.map(() => Math.floor(Math.random() * 41500) + 4150); // 500*83 to 50*83 range in INR
  const totalRevenue = revenuePerOrder.reduce((sum, amount) => sum + amount, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // Customer retention analysis
  const customerOrderCounts = data.reduce((acc, row) => {
    const customer = row.customer_name;
    if (!acc[customer]) acc[customer] = 0;
    acc[customer]++;
    return acc;
  }, {});
  
  const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
  const oneTimeCustomers = uniqueCustomers - repeatCustomers;
  const retentionRate = uniqueCustomers > 0 ? Math.round((repeatCustomers / uniqueCustomers) * 100) : 0;
  const churnRate = 100 - retentionRate;

  // Group by state
  const stateGroups = data.reduce((acc, row) => {
    const state = row.state || 'Unknown';
    if (!acc[state]) acc[state] = 0;
    acc[state]++;
    return acc;
  }, {});

  // Group by city
  const cityGroups = data.reduce((acc, row) => {
    const city = row.city || 'Unknown';
    if (!acc[city]) acc[city] = 0;
    acc[city]++;
    return acc;
  }, {});

  // Top states and cities
  const topStates = Object.entries(stateGroups)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const topCities = Object.entries(cityGroups)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // Revenue by date
  const dateGroups = data.reduce((acc, row, index) => {
    const date = row.order_date;
    if (date && date instanceof Date && !isNaN(date)) {
      const dateKey = date.toISOString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = { date: dateKey, revenue: 0, orders: 0, customers: new Set() };
      acc[dateKey].revenue += revenuePerOrder[index];
      acc[dateKey].orders++;
      acc[dateKey].customers.add(row.customer_name);
    }
    return acc;
  }, {});

  const revenueByDate = Object.values(dateGroups)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      date: item.date,
      revenue: item.revenue,
      orders: item.orders
    }));

  // Customer growth trend
  const customerGrowthTrend = Object.values(dateGroups)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, item, index) => {
      const cumulativeCustomers = acc.length > 0 
        ? acc[acc.length - 1].cumulativeCustomers + item.customers.size
        : item.customers.size;
      
      acc.push({
        date: item.date,
        newCustomers: item.customers.size,
        cumulativeCustomers
      });
      return acc;
    }, []);

  // Revenue by product category (simulated based on customer patterns)
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty'];
  const revenueByCategory = categories.map(category => ({
    name: category,
    revenue: Math.floor(Math.random() * totalRevenue * 0.3) + totalRevenue * 0.05,
    orders: Math.floor(Math.random() * totalOrders * 0.3) + Math.floor(totalOrders * 0.05)
  })).sort((a, b) => b.revenue - a.revenue);

  // Order frequency distribution
  const frequencyDistribution = Object.values(customerOrderCounts).reduce((acc, count) => {
    const bucket = count === 1 ? '1 order' : 
                   count <= 3 ? '2-3 orders' :
                   count <= 5 ? '4-5 orders' :
                   count <= 10 ? '6-10 orders' : '10+ orders';
    if (!acc[bucket]) acc[bucket] = 0;
    acc[bucket]++;
    return acc;
  }, {});
  
  const orderFrequencyData = Object.entries(frequencyDistribution)
    .map(([range, customers]) => ({ range, customers }));

  // State distribution for pie chart
  const stateDistribution = topStates.slice(0, 6);
  const cityDistribution = topCities.slice(0, 6);

  return {
    totalOrders,
    totalRevenue,
    uniqueCustomers,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    emailMetrics: {
      totalWithEmails: emailData.length,
      uniqueEmails,
      emailCoverage
    },
    topStates,
    topCities,
    revenueByDate,
    ordersTimeline: revenueByDate,
    stateDistribution,
    cityDistribution,
    customerGrowthTrend,
    revenueByCategory,
    orderFrequencyData,
    customerRetentionMetrics: {
      retentionRate,
      churnRate,
      repeatCustomers,
      oneTimeCustomers
    },
    rawData: data
  };
};

/**
 * Generate mock real-time updates for demo purposes
 * @param {Object} currentMetrics - Current metrics
 * @returns {Object} Updated metrics
 */
export const generateRealtimeUpdate = (currentMetrics) => {
  const updateFactor = 1 + (Math.random() * 0.1 - 0.05); // ±5% change
  
  return {
    ...currentMetrics,
    totalOrders: Math.floor(currentMetrics.totalOrders * updateFactor),
    totalRevenue: Math.floor(currentMetrics.totalRevenue * updateFactor),
    uniqueCustomers: Math.floor(currentMetrics.uniqueCustomers * updateFactor),
    avgOrderValue: Math.round(currentMetrics.avgOrderValue * updateFactor * 100) / 100,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Cache management
 */
const CACHE_KEY = 'dashboard_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Error reading cached data:', error);
  }
  return null;
};

export const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Error caching data:', error);
  }
};

/**
 * Main data fetching function with caching
 * @param {boolean} forceRefresh - Force refresh from source
 * @returns {Promise<Object>} Processed dashboard data
 */
export const getDashboardData = async (forceRefresh = false) => {
  try {
    // Check cache first unless forced refresh
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        return cachedData;
      }
    }

    // Fetch fresh data
    const rawData = await fetchGoogleSheetsData();
    const processedData = processDataForMetrics(rawData);
    
    // Cache the processed data
    setCachedData(processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    
    // Fallback to cached data if available
    const cachedData = getCachedData();
    if (cachedData) {
      console.warn('Using cached data due to fetch error');
      return cachedData;
    }
    
    // Return empty metrics as final fallback
    return processDataForMetrics([]);
  }
};