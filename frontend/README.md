# Frontend App - RFID Attendance System

React 18 + Vite + Tailwind CSS modern web interface.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx         # Top navigation bar
│   ├── Sidebar.jsx        # Side navigation menu
│   └── UIComponents.jsx   # Reusable UI components
├── context/
│   └── AuthContext.jsx    # Global auth state
├── hooks/
│   └── useAuth.js         # Custom auth hook
├── layouts/
│   └── MainLayout.jsx     # Main app layout
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Dashboard.jsx      # Dashboard with charts
│   ├── Users.jsx          # User management
│   ├── Events.jsx         # Event management
│   ├── RFIDCards.jsx      # RFID registration
│   ├── ScanAttendance.jsx # Attendance scanning
│   ├── AttendanceLogs.jsx # Attendance records
│   └── Profile.jsx        # User profile
├── services/
│   └── api.js             # API client with Axios
├── utils/
│   └── helpers.js         # Helper functions
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Key Features

### 1. Authentication
- Email/password login
- JWT token storage
- Auto logout on token expiry
- Protected routes

### 2. Dashboard
- System statistics
- Attendance trends chart
- Fine collection analytics
- Attendance status pie chart

### 3. Users Management
- View all students
- Search and filter
- Sort by name
- Add/edit/delete users
- Grouped by year level

### 4. Events Management
- Create events
- Set time windows
- Configure fine amounts
- View event details

### 5. RFID Registration
- Simulate RFID scanning
- Auto UID capture
- Validate student info
- Register cards

### 6. Attendance Scanning
- Real-time scanning
- Auto late detection
- Duplicate prevention
- Recent scans log

### 7. Attendance Logs
- Filter by year/date
- Search students
- Export to CSV
- Color-coded status

### 8. Profile Management
- View profile info
- Edit personal details
- Change password
- Upload avatar

## Components

### UIComponents.jsx
Reusable components:
- **StatCard** - Display statistics
- **Card** - Generic card container
- **Button** - Styled button
- **Input** - Text input with validation
- **Select** - Select dropdown

### Sidebar.jsx
- Collapsible navigation
- Menu items with icons
- Active route highlighting
- Mobile drawer
- Logout button

### Header.jsx
- App title
- User profile dropdown
- Mobile menu toggle
- Logout option

## Context & State

### AuthContext
```javascript
{
  user,              // Current user object
  token,             // JWT token
  loading,           // Loading state
  error,             // Error message
  login(),           // Login function
  logout(),          // Logout function
  isAuthenticated    // Boolean auth state
}
```

## API Integration

### Services (api.js)

```javascript
// Auth
authService.login(email, password)
authService.logout()

// Users
userService.getAll()
userService.getById(id)
userService.create(data)
userService.update(id, data)
userService.delete(id)

// Events
eventService.getAll()
eventService.getById(id)
eventService.create(data)
eventService.update(id, data)
eventService.delete(id)

// Attendance
attendanceService.scan(rfid_uid, event_id)
attendanceService.getLogs(filters)
attendanceService.getStats()
attendanceService.getByEvent(event_id)
```

## Routing

Protected routes require authentication. Unauthenticated users redirect to `/login`.

```
/login                 - Login page (public)
/                     - Dashboard (protected)
/users                - Users management
/events               - Events management
/rfid                 - RFID registration
/scan                 - Attendance scanning
/attendance-logs      - Attendance logs
/profile              - User profile
```

## Tailwind CSS Customization

Colors in `tailwind.config.js`:
```
Primary: #0052A2
Dark: #00264D
Medium: #02386E
Light: #00498D
```

## Helper Functions

### validators
- `validateStudentNumber()` - Check XX-XXXXX format
- `getStatusColor()` - Color for attendance status

### formatters
- `formatTime()` - Convert to HH:MM
- `formatDate()` - Convert to readable date

### utilities
- `exportToCSV()` - Download CSV file

## Charts

Using Recharts:
- LineChart - Attendance trends
- BarChart - Monthly analytics
- PieChart - Status distribution

```javascript
import { LineChart, BarChart, PieChart } from 'recharts'
```

## Responsive Design

### Breakpoints
- **Mobile** - <768px (single column)
- **Tablet** - 768px-1024px (2 columns)
- **Desktop** - >1024px (3+ columns)

### Mobile Features
- Hamburger menu
- Collapsible sidebar
- Touch-friendly buttons
- Single column layouts

## Form Validation

### Student Number
- Regex: `^\d{2}-\d{5}$`
- Example: `25-00017`

### RFID UID
- Auto-populated from scan
- Unique per student

## Error Handling

- API errors display toast messages
- Form validation errors inline
- Auth errors redirect to login
- Network errors show retry option

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint code
npm run lint
```

## Build Output

Production build in `dist/` directory:
- `index.html` - Entry point
- `assets/` - CSS, JS, images

## Environment Setup

API BASE URL in `services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000'
})
```

For production, update to your API URL.

## Key Libraries

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.16.0",
    "axios": "^1.5.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.292.0",
    "tailwindcss": "^3.3.3"
  }
}
```

## Performance Optimization

- Lazy loading routes
- Memoization of components
- Efficient state management
- Optimized re-renders
- Asset compression

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

- Secure token storage (localStorage)
- Protected API calls
- CSRF protection via CORS
- Input sanitization
- XSS prevention

## Testing

Create test files alongside components:
```
Component.jsx
Component.test.jsx
```

Run tests:
```bash
npm test
```

## Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Styling

Global styles in `index.css`:
- Tailwind directives
- Custom scrollbar
- Smooth animations
- Color variables

## Debugging

### React DevTools
- Browser extension for React debugging
- Component tree inspection
- Props/state viewing

### Network Tab
- Check API calls
- Verify response data
- Debug CORS issues

## Common Issues

**Blank Page**
- Check browser console
- Verify backend running
- Check API base URL

**Styling Not Applied**
- Clear browser cache
- Rebuild Tailwind
- Check CSS imports

**Login Not Working**
- Verify backend API running
- Check credentials
- Verify CORS enabled

---

**Happy Building!** 💻
