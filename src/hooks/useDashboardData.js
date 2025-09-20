import { useState, useEffect, useCallback } from 'react';
import { getDashboardData, generateRealtimeUpdate } from '../services/dataService';

/**
 * Custom hook for dashboard data management
 * @param {number} refreshInterval - Auto refresh interval in milliseconds
 * @returns {Object} Data state and actions
 */
export const useDashboardData = (refreshInterval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data function
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await getDashboardData(forceRefresh);
      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Force refresh function
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Simulate real-time updates (for demo purposes)
  const simulateRealtimeUpdate = useCallback(() => {
    if (data) {
      const updatedData = generateRealtimeUpdate(data);
      setData(updatedData);
      setLastUpdated(new Date());
    }
  }, [data]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        // Use cached data for auto refresh to avoid hitting API too frequently
        fetchData(false);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  // Real-time simulation (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (data && !loading) {
        simulateRealtimeUpdate();
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [data, loading, simulateRealtimeUpdate]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated && Date.now() - lastUpdated.getTime() > refreshInterval
  };
};