# RFID Attendance and Fine Recording System

A modern, full-stack web application for managing RFID-based student attendance and recording fines. Built with React.js, Node.js/Express, MySQL, and Tailwind CSS.

## 📋 Features

### Core Features
- ✅ **RFID Card Scanning** - Real-time attendance capture with duplicate prevention
- ✅ **Automatic Late Detection** - Flags late arrivals based on event login time
- ✅ **Fine Calculation** - Automatic fine assignment for late/absent students
- ✅ **JWT Authentication** - Secure login with role-based access control
- ✅ **User Management** - Add, edit, delete student records
- ✅ **Event Management** - Create events with time windows
- ✅ **Attendance Logging** - Comprehensive attendance records with CSV export
- ✅ **Dashboard Analytics** - Visual charts and statistics
- ✅ **Responsive Design** - Desktop and mobile-friendly interface

### Design Features
- 🎨 **Blue Monochromatic Palette** - Professional color scheme
- 🔄 **Smooth Animations** - Glassmorphism effects and transitions
- 📱 **Mobile Optimized** - Collapsible sidebar for mobile devices
- 🎯 **Clean UI** - Modern dashboard with card-based layout
- 📊 **Charts & Visualization** - Recharts for data visualization

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database management
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Lucide React** - Icon library

## 📁 Project Structure

```
MIcrop/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service client
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🎨 Color Palette

```
#000B18 - Darkest
#00172D - Very Dark
#00264D - Dark
#02386E - Medium Dark
#00498D - Medium
#0052A2 - Primary
```

## 🔐 Authentication

- Email/Password login
- JWT token-based authentication
- Role-based access (Admin/Staff)
- Session persistence with localStorage
- Protected routes with automatic redirect

### Demo Credentials
```
Email: admin@example.com
Password: password123
```

## 📊 Database Schema

### Users Table
- id (UUID)
- surname, firstname, middlename
- email, password (hashed)
- age, student_number, year_level
- rfid_uid (unique)
- role (admin/staff)
- profile_photo
- timestamps

### Events Table
- id (UUID)
- name, date
- login_time, logout_time
- location
- fine_amount
- timestamps

### Attendance Table
- id (UUID)
- user_id (FK)
- event_id (FK)
- time_in
- status (Present/Late/Absent)
- fine
- timestamps

## 🛠 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Attendance
- `POST /attendance/scan` - Record attendance scan
- `GET /attendance/logs` - Get attendance logs
- `GET /attendance/stats` - Get dashboard stats
- `GET /attendance/event/:event_id` - Get attendance by event

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rfid_attendance
PORT=5000
JWT_SECRET=your_jwt_secret
```

5. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Application runs on `http://localhost:5173`

## 📖 System Modules

### 1. Dashboard
- Total users, events, attendance stats
- Monthly attendance trends
- Fine collection analytics
- Attendance by year level
- Recent attendance logs

### 2. Users Management
- Display all registered students
- Search and filter by year level
- Sort alphabetically
- Pagination support
- Add, edit, delete users
- RFID UID registration

### 3. Events Management
- Create events with time windows
- Set fine amounts for late arrivals
- View event details
- Edit/delete events
- Track attendance per event

### 4. RFID Registration
- Scan RFID cards to get UID
- Auto-fill UID field
- Enter student information
- Validate student number format (XX-XXXXX)
- Store RFID-to-student mapping

### 5. Attendance Scanning
- Select event for scanning session
- Real-time RFID card scanning
- Auto-detect late arrivals
- Prevent duplicate scans (5-min window)
- Audio notifications
- Display scan results

### 6. Attendance Logs
- View all attendance records
- Filter by year level, event, date
- Search student names
- Export to CSV
- Color-coded status badges
- Organized by year level

### 7. Profile Management
- View profile information
- Edit personal details
- Change password
- Upload profile photo

## 🎯 Validation Rules

### Student Number Format
- Format: `XX-XXXXX` (e.g., `25-00017`)
- Regex: `^\d{2}-\d{5}$`

### Age
- Must be a positive integer
- Typically 18-30

### Year Level
- 1st Year
- 2nd Year
- 3rd Year
- 4th Year

### Status
- Present
- Late (when arrival time > login time)
- Absent

## 📱 Responsive Breakpoints

### Desktop
- 1024px and above
- Full sidebar navigation
- Multi-column layouts

### Tablet
- 768px - 1023px
- Collapsible sidebar drawer
- 2-column layouts

### Mobile
- Below 768px
- Hamburger menu
- Single column layouts
- Touch-optimized buttons

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation on frontend and backend
- Protected routes with role-based access
- Secure token storage in localStorage

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Build output in `dist/` directory ready for deployment.

## 🐛 Common Issues

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Verify database exists

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Available ports tried automatically

### RFID Not Scanning
- Check serial port connection
- Verify RFID reader is connected
- Test with demo UID input

## 📝 License

ISC License

## 👨‍💻 Author

Senior Full-Stack Developer

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
