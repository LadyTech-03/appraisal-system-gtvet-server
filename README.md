# TVET Appraisal System - Backend

A comprehensive performance appraisal system for Technical and Vocational Education and Training (TVET) institutions.

## Features

- User authentication and authorization
- Performance appraisal management
- Mid-year and end-of-year reviews
- Key result areas tracking
- Core and non-core competencies assessment
- Training records management
- Document upload and signature management
- Access request system
- Admin dashboard and analytics

## Tech Stack

- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- Joi for validation
- Nodemailer for email notifications

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   copy .env.example .env
   ```

5. Update the `.env` file with your database credentials and other configuration.
   - Set `ADMIN_PASSWORD` to your desired admin password
   - Update database connection details

6. Set up the database:
   ```bash
   # Run migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

The system uses PostgreSQL. Make sure you have PostgreSQL installed and running.

1. Create a database named `tvet_appraisal`
2. Update the database credentials in your `.env` file
3. Set `ADMIN_PASSWORD` in your `.env` file (this will be the admin login password)
4. Run the migrations to create tables
5. Run the seeders to populate initial data

### Admin Login
- **Email**: `admin@tvet.gov.gh`
- **Password**: The value of `ADMIN_PASSWORD` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Appraisals
- `GET /api/appraisals` - Get all appraisals
- `GET /api/appraisals/:id` - Get appraisal by ID
- `POST /api/appraisals` - Create new appraisal
- `PUT /api/appraisals/:id` - Update appraisal
- `DELETE /api/appraisals/:id` - Delete appraisal

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews/mid-year` - Create mid-year review
- `POST /api/reviews/end-year` - Create end-year review

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/analytics` - Get analytics data
- `POST /api/admin/access-requests/:id/approve` - Approve access request
- `POST /api/admin/access-requests/:id/reject` - Reject access request

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm run reset` - Reset database (drop and recreate)
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
server/
├── src/
│   ├── server.js              # Main server file
│   ├── config/                # Configuration files
│   ├── database/              # Database setup and migrations
│   ├── middleware/            # Express middleware
│   ├── controllers/           # Route controllers
│   ├── services/              # Business logic
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── uploads/               # File uploads
├── tests/                     # Test files
└── docs/                      # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License
