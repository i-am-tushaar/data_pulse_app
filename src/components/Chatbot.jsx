import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Bot, User } from 'lucide-react';
import { sendChatMessage, generateDashboardContext, handleChatbotCommand, formatN8nResponse, processDashboardUpdate, applyDataUpdates } from '../services/chatbotService';

const Chatbot = ({ onUpdateDashboard, isOpen, onToggle, dashboardData, activeView, onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your DataPulse AI assistant. Ask me anything about your store data or dashboard!',
      timestamp: new Date(),
      source: 'system'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Test connection when chatbot opens
      testConnection();
    }
  }, [isOpen]);

  const testConnection = async () => {
    try {
      const context = generateDashboardContext(dashboardData, activeView);
      const testResponse = await sendChatMessage('test connection', context);
      if (testResponse.success) {
        setConnectionStatus('connected');
        console.log('n8n connection test successful');
      } else {
        setConnectionStatus('disconnected');
        console.log('n8n connection test failed:', testResponse.error);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.log('n8n connection test error:', error);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    console.log('Sending message to chatbot:', message);

    try {
      // First check for local commands
      const localCommand = handleChatbotCommand(message, dashboardData);
      
      // Execute local actions immediately
      if (localCommand.action === 'refresh') {
        console.log('Executing local refresh command');
        onUpdateDashboard({ refresh: true });
      } else if (localCommand.action === 'navigate' && onNavigate) {
        console.log('Executing local navigation command:', localCommand.target);
        onNavigate(localCommand.target);
      }

      // Generate context for the webhook
      const context = generateDashboardContext(dashboardData, activeView);
      console.log('Generated context for n8n:', context);
      
      // Send to n8n webhook
      const webhookResponse = await sendChatMessage(message, context);
      console.log('Received webhook response:', webhookResponse);
      
      let botReply;
      let shouldUpdateDashboard = false;
      let dashboardUpdates = null;
      
      if (webhookResponse.success) {
        // Use the enhanced response formatter
        const formattedResponse = formatN8nResponse(webhookResponse);
        setConnectionStatus('connected');
        
        if (formattedResponse) {
          botReply = formattedResponse;
          console.log('Using formatted n8n response:', botReply);
        } else {
          botReply = localCommand.response || 'I received your message!';
          console.log('Using local command response as fallback:', botReply);
        }
        
        // Process dashboard update instructions from n8n
        dashboardUpdates = processDashboardUpdate(webhookResponse);
        console.log('Processed dashboard updates:', dashboardUpdates);
        
        if (dashboardUpdates.shouldRefreshData || 
            dashboardUpdates.shouldNavigateTo || 
            dashboardUpdates.dataUpdates ||
            dashboardUpdates.uiUpdates ||
            dashboardUpdates.customActions.length > 0) {
          shouldUpdateDashboard = true;
          
          if (onUpdateDashboard) {
            // Apply data updates directly if provided
            let updatedData = null;
            if (dashboardUpdates.dataUpdates && dashboardData) {
              updatedData = applyDataUpdates(dashboardData, dashboardUpdates.dataUpdates);
            }
            
            onUpdateDashboard({
              refresh: dashboardUpdates.shouldRefreshData,
              navigateTo: dashboardUpdates.shouldNavigateTo,
              dataUpdates: updatedData,
              uiUpdates: dashboardUpdates.uiUpdates,
              highlightKPIs: dashboardUpdates.shouldHighlightKPIs,
              filters: dashboardUpdates.shouldUpdateFilters,
              customActions: dashboardUpdates.customActions,
              ...webhookResponse.data
            });
          }
        }
      } else {
        // Connection failed, use friendly error message
        console.log('Webhook failed, using friendly error message:', webhookResponse.error);
        setConnectionStatus('disconnected');
        botReply = webhookResponse.friendlyMessage || 
                  localCommand.response || 
                  'Sorry, I couldn\'t connect to the data service. Please try again later.';
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botReply,
        timestamp: new Date(),
        data: webhookResponse.success ? webhookResponse.data : null,
        isError: !webhookResponse.success,
        source: webhookResponse.success ? 'n8n' : 'local'
      };

      console.log('Adding bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I encountered an unexpected error. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        isError: true,
        source: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) {
    return (
      <motion.div
        className="chatbot-toggle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
      >
        <MessageCircle size={24} />
        <div className="pulse-indicator" />

        <style jsx>{`
          .chatbot-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow-neon);
            z-index: 1000;
            color: white;
            border: 2px solid var(--cyber-blue);
          }

          .pulse-indicator {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: var(--cyber-blue);
            opacity: 0.3;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0.1; }
            100% { transform: scale(1); opacity: 0.3; }
          }
          
          /* Mobile positioning for chatbot toggle */
          @media (max-width: 768px) {
            .chatbot-toggle {
              bottom: 20px;
              right: 20px;
              width: var(--touch-target-comfortable);
              height: var(--touch-target-comfortable);
              z-index: 1001;
            }
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="chatbot-container"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-avatar">
            <Bot size={20} />
          </div>
          <div className="header-text">
            <h3>DataPulse AI</h3>
            <span className={`status ${connectionStatus}`}>
              {connectionStatus === 'connected' ? 'Connected to n8n' :
               connectionStatus === 'disconnected' ? 'Offline Mode' :
               'Online'}
            </span>
          </div>
        </div>
        <motion.button
          className="close-btn"
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {message.type === 'bot' ? (
                  <Bot size={16} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.content}
                  {message.source && (
                    <div className="message-source">
                      {message.source === 'n8n' ? '🤖 AI Response' : 
                       message.source === 'local' ? '⚡ Quick Response' : 
                       message.source === 'error' ? '⚠️ Error' : ''}
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            className="message bot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="message-content">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about your store data..."
            disabled={isLoading}
            className="chat-input"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="send-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </form>

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          border-left: var(--border-glass);
          box-shadow: var(--shadow-glass);
          z-index: 999;
          display: flex;
          flex-direction: column;
        }

        .chatbot-header {
          padding: var(--spacing-lg);
          border-bottom: var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 255, 255, 0.05);
          min-height: 70px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .header-text h3 {
          font-family: var(--font-primary);
          font-size: 1.1rem;
          color: var(--text-primary);
          margin: 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.3s ease;
        }

        .status.connected {
          color: var(--cyber-green);
        }

        .status.disconnected {
          color: var(--cyber-orange);
        }

        .status.unknown {
          color: var(--cyber-blue);
        }

        .status::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          animation: pulse 2s infinite;
        }

        .status.connected::before {
          background: var(--cyber-green);
        }

        .status.disconnected::before {
          background: var(--cyber-orange);
        }

        .status.unknown::before {
          background: var(--cyber-blue);
        }

        .close-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: var(--touch-target-min);
          min-width: var(--touch-target-min);
        }

        .close-btn:hover {
          color: var(--cyber-pink);
          border-color: rgba(255, 0, 128, 0.3);
          background: rgba(255, 0, 128, 0.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 3px;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .message.bot .message-avatar {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: var(--cyber-blue);
        }

        .message.user .message-avatar {
          background: rgba(255, 0, 128, 0.1);
          border: 1px solid rgba(255, 0, 128, 0.3);
          color: var(--cyber-pink);
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-bubble {
          background: var(--bg-glass);
          border: var(--border-glass);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.4;
          max-width: 280px;
          word-wrap: break-word;
        }

        .message.user .message-bubble {
          background: rgba(255, 0, 128, 0.1);
          border-color: rgba(255, 0, 128, 0.2);
        }

        .message.bot .message-bubble {
          background: rgba(0, 255, 255, 0.05);
          border-color: rgba(0, 255, 255, 0.1);
        }

        .message-bubble.error {
          background: rgba(255, 0, 0, 0.1);
          border-color: rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
        }

        .message-bubble.typing {
          padding: var(--spacing-md);
        }

        .message-source {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
          font-style: italic;
          opacity: 0.8;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--cyber-blue);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-10px); opacity: 1; }
        }

        .message-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-primary);
        }

        .chat-input-form {
          padding: var(--spacing-md);
          border-top: var(--border-glass);
          background: rgba(0, 0, 0, 0.2);
        }

        .input-container {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: var(--bg-glass);
          border: var(--border-glass);
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--text-primary);
          font-family: var(--font-secondary);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .chat-input::placeholder {
          color: var(--text-muted);
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--cyber-blue);
          box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
        }

        .chat-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-btn {
          background: var(--gradient-primary);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .send-btn:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--bg-secondary);
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .chatbot-container {
            width: 100%;
            right: 0;
            border-left: none;
            border-top: var(--border-glass);
          }
          
          .chatbot-header {
            padding: var(--spacing-mobile-md);
            min-height: 60px;
          }
          
          .bot-avatar {
            width: 36px;
            height: 36px;
          }
          
          .header-text h3 {
            font-size: 1rem;
          }
          
          .close-btn {
            width: var(--touch-target-comfortable);
            height: var(--touch-target-comfortable);
          }
          
          .messages-container {
            padding: var(--spacing-mobile-md);
            gap: var(--spacing-mobile-md);
          }
          
          .message-bubble {
            max-width: 85%;
            font-size: 0.9rem;
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
          }
          
          .chat-input-form {
            padding: var(--spacing-mobile-md);
          }
          
          .chat-input {
            font-size: 16px;
            padding: var(--spacing-mobile-sm) var(--spacing-mobile-md);
          }
          
          .send-btn {
            width: var(--touch-target-comfortable);
            height: var(--touch-target-comfortable);
          }
        }
        
        @media (max-width: 480px) {
          .chatbot-header {
            padding: var(--spacing-mobile-sm);
          }
          
          .header-text h3 {
            font-size: 0.9rem;
          }
          
          .status {
            font-size: 0.7rem;
          }
          
          .messages-container {
            padding: var(--spacing-mobile-sm);
          }
          
          .message-bubble {
            font-size: 0.85rem;
            max-width: 90%;
          }
          
          .chat-input-form {
            padding: var(--spacing-mobile-sm);
          }
        }
        
        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .chatbot-header {
            min-height: 50px;
            padding: var(--spacing-mobile-sm);
          }
          
          .bot-avatar {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Chatbot;