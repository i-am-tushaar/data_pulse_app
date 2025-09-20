# 🚀 Cyberpunk Data Dashboard

A visually stunning, dark-themed dashboard web app that connects to Google Sheets and displays data in real-time with cutting-edge cyberpunk aesthetics and glassmorphism effects.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)

## ✨ Features

### 🎨 **Visual Design**
- **Dark Cyberpunk Theme**: Sleek, futuristic interface with neon accents
- **Glassmorphism Effects**: Beautiful translucent cards and panels
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **Responsive Design**: Perfectly optimized for desktop, tablet, and mobile

### 📊 **Data Integration**
- **Real-time Google Sheets Connection**: Automatic data fetching and caching
- **Live Updates**: Auto-refresh every 30 seconds with simulated real-time changes
- **Smart Caching**: 5-minute local storage cache for optimal performance

### 📈 **Dashboard Features**
- **Interactive KPI Cards**: Revenue, orders, customers, and average order value
- **Dynamic Charts**: Revenue trends, order timelines, state/city distributions
- **Advanced Data Table**: Filtering, sorting, pagination, and CSV export
- **AI Chatbot Assistant**: Interactive chatbot with webhook integration for real-time assistance
- **Multiple Views**: Dashboard, Analytics, Data Explorer, Profile, Settings

### 🎭 **User Experience**
- **Smooth Navigation**: Animated sidebar with active indicators
- **AI Chatbot**: Smart assistant for data insights and dashboard control
- **Loading States**: Cyberpunk-themed loading animations
- **Error Handling**: Graceful fallbacks and retry mechanisms
- **Mobile-First**: Collapsible sidebar and touch-friendly interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   cd cyberpunk-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🤖 AI Chatbot Assistant

The dashboard includes an intelligent AI chatbot that provides real-time assistance and can interact with your data.

### **Features**
- **Smart Conversations**: Natural language interface for data queries
- **Webhook Integration**: Connects to `https://n8n-8t66.onrender.com/webhook-test/dashboard`
- **Dynamic Updates**: Can trigger dashboard refreshes and navigation
- **Context Awareness**: Understands current dashboard state and data
- **Fallback Responses**: Graceful handling of server errors

### **Usage Examples**
```
"Show me the revenue data"
"Refresh the dashboard"
"What are the top performing states?"
"Go to data table"
"Update the information"
```

### **Debugging & Troubleshooting**
The chatbot includes comprehensive debugging tools:

**Console Commands** (Available in browser dev tools):
```javascript
// Test n8n connection
window.debugN8n.test()

// View debug information
window.debugN8n.debug()
```

**Features for n8n Integration**:
- ✅ **Enhanced Error Handling**: Detailed logging for troubleshooting
- ✅ **Response Formatting**: Automatically cleans wrapped/malformed responses
- ✅ **Connection Status**: Visual indicator showing n8n connection state
- ✅ **Fallback Responses**: Local responses when n8n is unavailable
- ✅ **Auto-retry Logic**: Intelligent retry mechanisms for failed requests

### **Webhook Integration**
The chatbot sends POST requests with this structure:
```json
{
  "message": "user message",
  "timestamp": "ISO timestamp",
  "userId": "pulseboard-user",
  "dashboardContext": {
    "currentView": "dashboard",
    "totalOrders": 1234,
    "totalRevenue": 567890,
    "hasData": true,
    "hasEmailData": true
  }
}
```

**Expected n8n Response Formats** (All supported):
```json
// Option 1: Simple reply
{
  "reply": "Your response message here"
}

// Option 2: With actions
{
  "message": "Response with dashboard updates",
  "refresh": true,
  "navigateTo": "data"
}

// Option 3: Plain text response
"Just a simple text response"

// Option 4: Wrapped responses (auto-cleaned)
"{\"reply\": \"Wrapped JSON response\"}"
```

**Response Processing Features**:
- ✅ **Auto-formatting**: Removes quotes, brackets, and escape characters
- ✅ **Multiple Field Support**: Checks `reply`, `message`, `response`, `text`, `output`
- ✅ **Nested Object Handling**: Extracts responses from complex structures
- ✅ **Error Recovery**: Graceful handling of malformed responses

## 📊 Data Source

The dashboard connects to this Google Sheets CSV:
```
https://docs.google.com/spreadsheets/d/1hiD-Vs1rAM1s9sR9CBpFoIIrK2Rq5NJ7fjPK0mgcw6s/export?format=csv&filename=sheet_data.csv
```

### Expected Data Format
The CSV should contain the following columns:
- `Order ID` - Unique identifier for each order
- `Order Date` - Date of the order
- `Customer Name` - Name of the customer
- `Email ID` - Customer's email address
- `State` - Customer's state
- `City` - Customer's city

## 🛠️ Tech Stack

### Core Framework
- **React 18.2.0** - Modern React with hooks
- **Vite 4.4.5** - Fast build tool and development server

### UI & Animations
- **Framer Motion** - Smooth animations and transitions
- **Styled Components** - CSS-in-JS styling
- **Lucide React** - Beautiful SVG icons

### Data Visualization
- **Recharts** - Responsive chart library
- **Papa Parse** - CSV parsing

### Data Management
- **Custom Hooks** - `useDashboardData` for state management
- **Local Storage Caching** - Optimized data persistence

## 🎨 Theme System

The dashboard uses a comprehensive CSS variable system for theming:

```css
:root {
  /* Cyberpunk Colors */
  --cyber-pink: #ff0080;
  --cyber-blue: #00ffff;
  --cyber-purple: #8000ff;
  --cyber-green: #00ff41;
  
  /* Glassmorphism */
  --bg-glass: rgba(255, 255, 255, 0.05);
  --bg-glass-dark: rgba(0, 0, 0, 0.3);
  
  /* Typography */
  --font-primary: 'Orbitron', monospace;
  --font-secondary: 'Rajdhani', sans-serif;
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

## 🔧 Configuration

### Data Refresh Interval
Modify the refresh interval in `src/hooks/useDashboardData.js`:
```javascript
const { data, loading, error } = useDashboardData(30000); // 30 seconds
```

### Cache Duration
Adjust cache settings in `src/services/dataService.js`:
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 🎯 Key Components

### Dashboard Components
- `App.jsx` - Main application container
- `Dashboard.jsx` - Primary dashboard view
- `Sidebar.jsx` - Navigation sidebar
- `Header.jsx` - Top navigation bar

### Data Components
- `KPIGrid.jsx` - Key performance indicator cards
- `ChartsGrid.jsx` - Interactive data visualizations
- `DataTable.jsx` - Advanced data table with filtering
- `Chatbot.jsx` - AI assistant with webhook integration

### Services & Hooks
- `dataService.js` - Google Sheets integration
- `chatbotService.js` - Webhook communication and dashboard updates
- `useDashboardData.js` - Data management hook

## 🎨 Customization

### Adding New Charts
1. Create chart component in `src/components/`
2. Import Recharts components
3. Use the established glassmorphism styling
4. Add to `ChartsGrid.jsx`

### Modifying Theme Colors
Update CSS variables in `src/styles/index.css`:
```css
:root {
  --cyber-pink: #your-color;
  --cyber-blue: #your-color;
  /* etc... */
}
```

### Adding New Data Sources
1. Create new service in `src/services/`
2. Follow the `dataService.js` pattern
3. Update the data processing functions

## 🐛 Troubleshooting

### Common Issues

**Data not loading?**
- Check network connectivity
- Verify Google Sheets URL is accessible
- Check browser console for CORS errors

**Charts not rendering?**
- Ensure data format matches expected structure
- Verify Recharts dependencies are installed
- Check responsive container dimensions

**Mobile layout issues?**
- Test on actual devices, not just browser dev tools
- Verify CSS media queries
- Check touch event handling

## 🚀 Performance Optimizations

- **Smart Caching**: 5-minute localStorage cache
- **Lazy Loading**: Components load on demand
- **Optimized Re-renders**: useMemo and useCallback hooks
- **Efficient Animations**: Hardware-accelerated transforms
- **Bundle Optimization**: Vite's built-in optimizations

## 📈 Future Enhancements

- [ ] Real-time WebSocket connections
- [ ] Advanced filtering and search
- [ ] Custom widget builder
- [ ] Export to multiple formats
- [ ] User authentication
- [ ] Multi-dashboard support
- [ ] Advanced analytics algorithms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for incredible animation capabilities
- **Recharts** for beautiful, responsive charts
- **Lucide** for the perfect icon set
- **Google Sheets** for easy data integration
- **Vite** for blazing-fast development experience

---

**Built with ❤️ and ⚡ by the power of modern web technologies**

*Experience the future of data visualization with our cyberpunk-themed dashboard that makes data analysis feel like commanding a space station!*