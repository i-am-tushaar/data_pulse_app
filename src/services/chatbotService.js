/**
 * Chatbot Service - Handles webhook communication and dashboard updates
 */

import { logN8nRequest, logN8nResponse } from '../utils/debugger';

const WEBHOOK_URL = 'https://n8n-8t66.onrender.com/webhook-test/dashboard';

/**
 * Send message to chatbot webhook with enhanced error handling
 * @param {string} message - User message
 * @param {Object} context - Additional context (dashboard data, user info, etc.)
 * @returns {Promise<Object>} Webhook response
 */
export const sendChatMessage = async (message, context = {}) => {
  const payload = {
    message,
    timestamp: new Date().toISOString(),
    userId: 'datapulse-user',
    dashboardContext: {
      currentView: context.activeView || 'dashboard',
      lastDataUpdate: context.lastUpdated || null,
      hasData: !!context.data,
      ...context
    }
  };

  console.log('Sending to n8n webhook:', {
    url: WEBHOOK_URL,
    payload: payload
  });
  
  logN8nRequest(payload);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'DataPulse-Chatbot/1.0'
      },
      body: JSON.stringify(payload),
      timeout: 30000 // 30 second timeout
    });

    console.log('n8n response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Raw n8n response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // If response is not JSON, treat it as plain text
      data = {
        reply: responseText,
        message: responseText,
        success: true
      };
    }

    console.log('Parsed n8n data:', data);
    
    const result = {
      success: true,
      data,
      rawResponse: responseText
    };
    
    logN8nResponse(result, responseText);

    return result;

  } catch (error) {
    console.error('Chatbot webhook error:', {
      message: error.message,
      stack: error.stack,
      url: WEBHOOK_URL
    });
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
};

/**
 * Clean and format response from n8n webhook
 * @param {Object} webhookResponse - Raw response from webhook
 * @returns {string} Clean, formatted response
 */
export const formatN8nResponse = (webhookResponse) => {
  if (!webhookResponse || !webhookResponse.success) {
    return null;
  }

  const data = webhookResponse.data;
  
  // Try different response field names that n8n might use
  let responseText = data.reply || 
                    data.message || 
                    data.response || 
                    data.text || 
                    data.output || 
                    data.result;

  // If no direct text field, check if the whole data is a string
  if (!responseText && typeof data === 'string') {
    responseText = data;
  }

  // If still no response, try to extract from nested objects
  if (!responseText && typeof data === 'object') {
    // Check common n8n output structures
    if (data.body && typeof data.body === 'string') {
      responseText = data.body;
    } else if (data.json && data.json.reply) {
      responseText = data.json.reply;
    } else if (data.data && typeof data.data === 'string') {
      responseText = data.data;
    }
  }

  if (!responseText) {
    console.log('No recognizable response text found in:', data);
    return 'I received your message, but the response format was not recognized.';
  }

  // Clean up the response text
  responseText = String(responseText).trim();

  // Remove extra quotes if the response is wrapped in quotes
  if ((responseText.startsWith('"') && responseText.endsWith('"')) ||
      (responseText.startsWith("'") && responseText.endsWith("'"))) {
    responseText = responseText.slice(1, -1);
  }

  // Remove curly brackets if the response is wrapped in them
  if (responseText.startsWith('{') && responseText.endsWith('}')) {
    try {
      const parsed = JSON.parse(responseText);
      if (parsed.reply || parsed.message || parsed.response) {
        responseText = parsed.reply || parsed.message || parsed.response;
      }
    } catch (e) {
      // If it's not valid JSON, just remove the brackets
      responseText = responseText.slice(1, -1).trim();
    }
  }

  // Remove square brackets if present
  if (responseText.startsWith('[') && responseText.endsWith(']')) {
    try {
      const parsed = JSON.parse(responseText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        responseText = String(parsed[0]);
      }
    } catch (e) {
      responseText = responseText.slice(1, -1).trim();
    }
  }

  // Clean up common formatting issues
  responseText = responseText
    .replace(/\\n/g, '\n')  // Convert escaped newlines
    .replace(/\\t/g, ' ')   // Convert escaped tabs to spaces
    .replace(/\\r/g, '')    // Remove escaped carriage returns
    .replace(/\\"/g, '"')  // Convert escaped quotes
    .replace(/\\'/g, "'")   // Convert escaped single quotes
    .trim();

  return responseText || 'I received your message!';
};

/**
 * Process webhook response and extract dashboard update instructions
 * @param {Object} webhookResponse - Response from webhook
 * @returns {Object} Processed update instructions
 */
export const processDashboardUpdate = (webhookResponse) => {
  const updates = {
    shouldRefreshData: false,
    shouldHighlightKPIs: [],
    shouldUpdateFilters: null,
    shouldNavigateTo: null,
    customActions: []
  };

  if (!webhookResponse.data) {
    return updates;
  }

  const response = webhookResponse.data;

  // Check for refresh instruction
  if (response.refresh || response.updateData || response.refreshDashboard) {
    updates.shouldRefreshData = true;
  }

  // Check for KPI highlighting
  if (response.highlightKPIs && Array.isArray(response.highlightKPIs)) {
    updates.shouldHighlightKPIs = response.highlightKPIs;
  }

  // Check for filter updates
  if (response.filters) {
    updates.shouldUpdateFilters = response.filters;
  }

  // Check for navigation instructions
  if (response.navigateTo) {
    updates.shouldNavigateTo = response.navigateTo;
  }

  // Custom actions from webhook
  if (response.actions && Array.isArray(response.actions)) {
    updates.customActions = response.actions;
  }

  return updates;
};

/**
 * Generate contextual information about current dashboard state
 * @param {Object} dashboardData - Current dashboard data
 * @param {string} activeView - Current active view
 * @returns {Object} Context for chatbot
 */
export const generateDashboardContext = (dashboardData, activeView) => {
  if (!dashboardData) {
    return {
      activeView,
      hasData: false,
      message: 'No data available'
    };
  }

  const context = {
    activeView,
    hasData: true,
    totalOrders: dashboardData.totalOrders,
    totalRevenue: dashboardData.totalRevenue,
    uniqueCustomers: dashboardData.uniqueCustomers,
    avgOrderValue: dashboardData.avgOrderValue,
    topStates: dashboardData.topStates?.slice(0, 3).map(s => s.name),
    topCities: dashboardData.topCities?.slice(0, 3).map(c => c.name),
    dataPoints: dashboardData.rawData?.length || 0,
    hasEmailData: dashboardData.rawData?.some(row => row.email_id) || false
  };

  return context;
};

/**
 * Generate helpful suggestions based on current data
 * @param {Object} dashboardData - Current dashboard data
 * @returns {Array} Array of suggestion strings
 */
export const generateDataInsights = (dashboardData) => {
  const insights = [];

  if (!dashboardData) {
    return ['Ask me to refresh the data', 'Check the connection status'];
  }

  if (dashboardData.totalRevenue) {
    insights.push(`Total revenue is ₹${dashboardData.totalRevenue.toLocaleString('en-IN')}`);
  }

  if (dashboardData.topStates?.length > 0) {
    insights.push(`Top performing state: ${dashboardData.topStates[0].name}`);
  }

  if (dashboardData.uniqueCustomers) {
    insights.push(`${dashboardData.uniqueCustomers} unique customers served`);
  }

  // Check for email data availability
  const hasEmailData = dashboardData.rawData?.some(row => row.email_id && row.email_id.trim());
  if (hasEmailData) {
    const emailCount = dashboardData.rawData.filter(row => row.email_id && row.email_id.trim()).length;
    insights.push(`Email contacts available for ${emailCount} customers`);
  }

  insights.push('Ask me about revenue trends, top customers, email data, or data insights');

  return insights;
};

/**
 * Handle specific chatbot commands
 * @param {string} message - User message
 * @param {Object} dashboardData - Current dashboard data
 * @returns {Object} Command response
 */
export const handleChatbotCommand = (message, dashboardData) => {
  const lowerMessage = message.toLowerCase();

  // Refresh command
  if (lowerMessage.includes('refresh') || lowerMessage.includes('update')) {
    return {
      type: 'refresh',
      response: 'Refreshing your dashboard data now...',
      action: 'refresh'
    };
  }

  // Navigation commands
  if (lowerMessage.includes('show data') || lowerMessage.includes('data table')) {
    return {
      type: 'navigate',
      response: 'Switching to data table view...',
      action: 'navigate',
      target: 'data'
    };
  }

  if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
    return {
      type: 'navigate',
      response: 'Switching to dashboard overview...',
      action: 'navigate',
      target: 'dashboard'
    };
  }

  // Data insights
  if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
    const revenue = dashboardData?.totalRevenue;
    if (revenue) {
      return {
        type: 'insight',
        response: `Your total revenue is ₹${revenue.toLocaleString('en-IN')}. This includes ${dashboardData.totalOrders} orders from ${dashboardData.uniqueCustomers} customers.`,
        action: 'highlight',
        target: 'revenue'
      };
    }
  }

  // Email data insights
  if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
    const hasEmailData = dashboardData?.rawData?.some(row => row.email_id);
    if (hasEmailData) {
      const emailCount = dashboardData.rawData.filter(row => row.email_id && row.email_id.trim()).length;
      return {
        type: 'insight',
        response: `I found email data for ${emailCount} customers in your database. You can view all email addresses in the data table.`,
        action: 'navigate',
        target: 'data'
      };
    } else {
      return {
        type: 'insight',
        response: 'Email data is being processed. The system will automatically update when email information becomes available.',
        action: 'refresh'
      };
    }
  }

  // Default response
  return {
    type: 'general',
    response: 'I can help you with dashboard insights, data refreshing, and navigation. What would you like to know?',
    action: null
  };
};