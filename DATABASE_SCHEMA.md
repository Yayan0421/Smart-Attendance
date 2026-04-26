# Database Schema Documentation

## Overview

The RFID Attendance System uses a relational database with 3 main tables: `Users`, `Events`, and `Attendance`.

## Database Name

```
rfid_attendance
```

## Tables

### 1. Users Table

Stores student and admin user information.

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  surname VARCHAR(100) NOT NULL,
  firstname VARCHAR(100) NOT NULL,
  middlename VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  age INT,
  student_number VARCHAR(20) UNIQUE,
  year_level ENUM('1st Year', '2nd Year', '3rd Year', '4th Year'),
  rfid_uid VARCHAR(255) UNIQUE,
  role ENUM('admin', 'staff') DEFAULT 'staff',
  profile_photo LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Unique identifier (UUID)
- `surname`: Student/User last name
- `firstname`: Student/User first name
- `middlename`: Student/User middle name (optional)
- `email`: Email address (unique, optional)
- `password`: Hashed password (optional)
- `age`: Age of student
- `student_number`: Student ID (format: XX-XXXXX)
- `year_level`: Academic year (1st-4th Year)
- `rfid_uid`: RFID card unique identifier
- `role`: User role (admin/staff)
- `profile_photo`: Base64 encoded image
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `email`, `student_number`, `rfid_uid`

---

### 2. Events Table

Stores event information and time windows for attendance.

```sql
CREATE TABLE events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  login_time TIME NOT NULL,
  logout_time TIME NOT NULL,
  location VARCHAR(255),
  fine_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Unique event identifier (UUID)
- `name`: Event name (e.g., "Orientation Day 2024")
- `date`: Event date
- `login_time`: Expected login/start time (HH:MM:SS)
- `logout_time`: Expected logout/end time
- `location`: Physical location of event
- `fine_amount`: Fine amount for late/absent students
- `created_at`: Event creation timestamp
- `updated_at`: Last update timestamp

**Indexes:**
- PRIMARY KEY: `id`

---

### 3. Attendance Table

Stores attendance records linking users and events.

```sql
CREATE TABLE attendance (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  event_id CHAR(36) NOT NULL,
  time_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Present', 'Late', 'Absent') DEFAULT 'Present',
  fine DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

**Columns:**
- `id`: Unique attendance record identifier (UUID)
- `user_id`: Reference to Users table (FK)
- `event_id`: Reference to Events table (FK)
- `time_in`: Time when student scanned in
- `status`: Attendance status (Present/Late/Absent)
- `fine`: Fine amount applied
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `user_id` → `users.id`
- FOREIGN KEY: `event_id` → `events.id`

---

## Relationships

### One-to-Many: Users → Attendance
- One user can have many attendance records
- Each attendance record belongs to one user

### One-to-Many: Events → Attendance
- One event can have many attendance records
- Each attendance record belongs to one event

### Visualization

```
Users (1)
  ↓
  └─→ (Many) Attendance
         ↑
         └─ (1) Events
```

---

## Data Types

| Type | Usage | Example |
|------|-------|---------|
| CHAR(36) | UUID Primary Keys | `550e8400-e29b-41d4-a716-446655440000` |
| VARCHAR | Text fields | `John`, `25-00017` |
| ENUM | Fixed choices | `'1st Year'`, `'Present'` |
| DATE | Dates only | `2024-04-21` |
| TIME | Time only | `14:30:00` |
| DATETIME | Date and time | `2024-04-21 14:30:45` |
| DECIMAL(10,2) | Monetary values | `100.50` |
| LONGTEXT | Large text/images | Base64 encoded image |
| TIMESTAMP | Auto timestamps | `2024-04-21 14:30:45` |

---

## Constraints

### Primary Keys
- `users.id` - Each user must be unique
- `events.id` - Each event must be unique
- `attendance.id` - Each attendance record must be unique

### Unique Constraints
- `users.email` - No duplicate emails
- `users.student_number` - No duplicate student numbers
- `users.rfid_uid` - No duplicate RFID UIDs

### Foreign Key Constraints
- `attendance.user_id` → `users.id` (CASCADE DELETE)
- `attendance.event_id` → `events.id` (CASCADE DELETE)

**ON DELETE CASCADE**: When a user or event is deleted, all related attendance records are automatically deleted.

---

## Indexes

### Primary Indexes
```sql
-- User lookups
INDEX idx_user_email (email)
INDEX idx_user_student_number (student_number)
INDEX idx_user_rfid_uid (rfid_uid)

-- Event lookups
INDEX idx_event_date (date)

-- Attendance lookups
INDEX idx_attendance_user_id (user_id)
INDEX idx_attendance_event_id (event_id)
INDEX idx_attendance_time_in (time_in)
```

---

## Sample Queries

### Get all students in 1st Year
```sql
SELECT * FROM users 
WHERE year_level = '1st Year' 
AND role = 'staff'
ORDER BY firstname ASC;
```

### Get attendance for specific event with year level filtering
```sql
SELECT 
  a.id,
  u.firstname,
  u.surname,
  u.student_number,
  a.time_in,
  a.status,
  a.fine
FROM attendance a
JOIN users u ON a.user_id = u.id
WHERE a.event_id = 'EVENT_ID'
AND u.year_level = '2nd Year'
ORDER BY a.time_in DESC;
```

### Calculate total fines for a student
```sql
SELECT 
  u.firstname,
  u.surname,
  SUM(a.fine) as total_fines
FROM attendance a
JOIN users u ON a.user_id = u.id
WHERE u.id = 'USER_ID'
GROUP BY a.user_id;
```

### Get late arrivals for an event
```sql
SELECT 
  u.firstname,
  u.surname,
  a.time_in,
  e.login_time
FROM attendance a
JOIN users u ON a.user_id = u.id
JOIN events e ON a.event_id = e.id
WHERE a.event_id = 'EVENT_ID'
AND a.status = 'Late'
ORDER BY a.time_in DESC;
```

### Count attendance by status for today
```sql
SELECT 
  status,
  COUNT(*) as count
FROM attendance
WHERE DATE(time_in) = CURDATE()
GROUP BY status;
```

---

## User Roles

### Admin
- Full access to all features
- Can create/edit/delete users, events
- Can view all attendance records
- Can manage system settings

### Staff
- Can scan RFID cards
- Can view own attendance
- Limited access to reports

---

## Backup & Recovery

### Export Database
```bash
mysqldump -u root -p rfid_attendance > backup.sql
```

### Import Database
```bash
mysql -u root -p rfid_attendance < backup.sql
```

---

## Performance Considerations

1. **Indexes** on frequently queried columns (email, student_number)
2. **UUID** for distributed systems and data migration
3. **DECIMAL(10,2)** for accurate monetary calculations
4. **CASCADE DELETE** for data integrity
5. **TIMESTAMP** for automatic audit trails

---

## Version Control

- **Version:** 1.0
- **Created:** 2024-04-21
- **Last Updated:** 2024-04-21
