# Event Planner Website with Admin Dashboard

A full-stack event planning platform built with Next.js 16, MongoDB, and TypeScript. Features a secure admin dashboard with custom authentication for managing events and bookings.

## Features

### Admin Dashboard
- 🔐 Secure custom authentication with JWT sessions
- 👥 Two fixed admin users (no public registration)
- 🛡️ Protected routes with middleware
- 📊 Dashboard with event and booking management
- 🎨 Modern, responsive UI
- 🔒 Rate limiting on login attempts
- 🍪 HTTP-only, secure session cookies

### Public Website
- 📅 Event browsing and viewing
- 🎫 Event booking system (coming soon)
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB
- **Authentication**: Custom JWT-based auth with bcrypt
- **Language**: TypeScript
- **Styling**: CSS Modules

## Project Structure

```
wassim-kharrat-events/
├── src/
│   └── app/
│       ├── (public)/          # Public-facing website
│       │   ├── page.tsx       # Homepage
│       │   └── layout.tsx     # Public layout
│       ├── (admin)/           # Admin dashboard (protected)
│       │   └── admin/
│       │       ├── page.tsx           # Dashboard home
│       │       ├── layout.tsx         # Admin layout with sidebar
│       │       ├── login/
│       │       │   ├── page.tsx       # Login page
│       │       │   └── login.module.css
│       │       ├── events/            # Events management
│       │       ├── bookings/          # Bookings management
│       │       └── settings/          # Settings
│       └── api/
│           └── auth/
│               ├── login/route.ts     # Login API
│               └── logout/route.ts    # Logout API
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── db.ts                  # Database collections
│   ├── auth.ts                # Authentication helpers
│   └── models/
│       └── Admin.ts           # Admin user model
├── scripts/
│   └── seed-admins.ts         # Script to seed admin users
└── middleware.ts              # Route protection middleware
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wassim-kharrat-events
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/event-planner
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-planner

   # Authentication Secret (generate a random string)
   # Generate with: openssl rand -base64 32
   AUTH_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Node Environment
   NODE_ENV=development

   # Cloudinary Configuration (for image uploads)
   # Get credentials from: https://cloudinary.com
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Seed admin users**
   
   Run the seed script to create two admin users:
   ```bash
   npm run seed:admins
   ```

   This will create:
   - **Admin 1**: `admin1@eventplanner.com` / `Admin123!`
   - **Admin 2**: `admin2@eventplanner.com` / `Admin456!`

   ⚠️ **Important**: Change these passwords in production!

5. **Start the development server**
```bash
npm run dev
   ```

6. **Access the application**
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Admin login: http://localhost:3000/admin/login

## Authentication System

### How It Works

1. **Login Flow**
   - Admin enters credentials on `/admin/login`
   - Server validates credentials against MongoDB
   - On success, JWT token is created and stored in HTTP-only cookie
   - User is redirected to dashboard

2. **Session Management**
   - JWT tokens expire after 12 hours
   - Tokens are verified on each protected route access
   - Sessions are stored in secure, HTTP-only cookies

3. **Route Protection**
   - Middleware checks authentication for all `/admin/*` routes
   - Unauthenticated users are redirected to login
   - Authenticated users trying to access login are redirected to dashboard

4. **Security Features**
   - Password hashing with bcrypt (12 rounds)
   - Rate limiting: 5 login attempts per IP, 15-minute lockout
   - HTTP-only cookies (not accessible via JavaScript)
   - Secure cookies in production (HTTPS only)
   - SameSite=strict cookie policy
   - Generic error messages (no user enumeration)

## API Routes

### POST `/api/auth/login`
Login endpoint for admin users.

**Request Body:**
```json
{
  "email": "admin1@eventplanner.com",
  "password": "Admin123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "admin": {
    "id": "...",
    "email": "admin1@eventplanner.com",
    "name": "Admin One",
    "role": "super_admin"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### POST `/api/auth/logout`
Logout endpoint that clears the session cookie.

**Response:**
```json
{
  "success": true
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:admins` - Seed admin users

### Adding More Admin Users

To add more admin users, you can either:

1. **Modify the seed script** (`scripts/seed-admins.ts`) and re-run it after clearing the admins collection
2. **Manually insert into MongoDB**:
   ```javascript
   // In MongoDB shell or Compass
   db.admins.insertOne({
     email: "newadmin@eventplanner.com",
     passwordHash: "<bcrypt-hashed-password>",
     name: "New Admin",
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

## Security Considerations

### For Production

1. **Change default admin passwords immediately**
2. **Use a strong AUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
3. **Use HTTPS** (secure cookies require it)
4. **Set NODE_ENV=production**
5. **Use MongoDB Atlas or secured MongoDB instance**
6. **Enable MongoDB authentication**
7. **Consider adding 2FA for admin accounts**
8. **Set up proper logging and monitoring**
9. **Regular security audits**
10. **Keep dependencies updated**

### Rate Limiting

The login endpoint has built-in rate limiting:
- Maximum 5 attempts per IP address
- 15-minute lockout after exceeding limit
- Automatic reset on successful login

For production, consider using a more robust solution like Redis for distributed rate limiting.

## Roadmap

- [ ] Event creation and management UI
- [ ] Booking system implementation
- [ ] Email notifications
- [ ] File upload for event images
- [ ] Advanced analytics dashboard
- [ ] Export functionality (CSV, PDF)
- [ ] Search and filtering
- [ ] Multi-language support
- [ ] Mobile app

## Troubleshooting

### Cannot connect to MongoDB
- Verify `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running (if local)
- Check network connectivity (if using Atlas)

### Login not working
- Verify admin users were seeded: `npm run seed:admins`
- Check browser console for errors
- Verify `AUTH_SECRET` is set in `.env.local`

### Session expires too quickly
- Adjust `SESSION_MAX_AGE` in `lib/auth.ts` (default: 12 hours)

### Rate limit issues during development
- The rate limit resets after 15 minutes
- Restart the dev server to clear in-memory rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
