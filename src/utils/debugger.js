/**
 * Debug utilities for chatbot-n8n integration
 */

export const debugN8nConnection = () => {
  console.group('🔍 n8n Connection Debug Info');
  
  console.log('📡 Webhook URL:', 'https://n8n-8t66.onrender.com/webhook-test/dashboard');
  console.log('🌐 Browser Info:', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine
  });
  
  console.log('⏰ Current Time:', new Date().toISOString());
  
  // Test basic connectivity
  fetch('https://n8n-8t66.onrender.com/webhook-test/dashboard', {
    method: 'HEAD',
    mode: 'no-cors'
  }).then(() => {
    console.log('✅ Basic connectivity test passed');
  }).catch(error => {
    console.log('❌ Basic connectivity test failed:', error);
  });
  
  console.groupEnd();
};

export const logN8nRequest = (payload) => {
  console.group('📤 Sending to n8n');
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('Size:', new Blob([JSON.stringify(payload)]).size, 'bytes');
  console.groupEnd();
};

export const logN8nResponse = (response, rawResponse) => {
  console.group('📥 Received from n8n');
  console.log('Success:', response.success);
  console.log('Raw Response:', rawResponse);
  console.log('Parsed Data:', response.data);
  if (response.error) {
    console.error('Error:', response.error);
  }
  console.groupEnd();
};

export const testN8nWebhook = async () => {
  console.group('🧪 Testing n8n Webhook');
  
  const testPayload = {
    message: "test connection",
    timestamp: new Date().toISOString(),
    userId: "debug-test",
    dashboardContext: {
      currentView: "dashboard",
      hasData: true,
      test: true
    }
  };
  
  try {
    console.log('Sending test request...');
    logN8nRequest(testPayload);
    
    const response = await fetch('https://n8n-8t66.onrender.com/webhook-test/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log('✅ Test successful - JSON response:', jsonData);
      } catch (e) {
        console.log('✅ Test successful - Text response:', responseText);
      }
    } else {
      console.log('❌ Test failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
  
  console.groupEnd();
};

// Auto-run debug info when this module loads
if (typeof window !== 'undefined') {
  window.debugN8n = {
    debug: debugN8nConnection,
    test: testN8nWebhook,
    logRequest: logN8nRequest,
    logResponse: logN8nResponse
  };
  
  console.log('🔧 n8n Debug tools available at: window.debugN8n');
}