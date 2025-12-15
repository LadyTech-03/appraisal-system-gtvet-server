# TVET Appraisal System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "Lecturer",
  "division": "Academic Affairs",
  "unit": "Engineering",
  "position": "Lecturer",
  "grade": "Grade 14"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employee_id": "EMP001",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Lecturer",
    ...
  }
}
```

### Users

#### GET /users
Get all users (Admin/Manager only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role
- `division` (optional): Filter by division
- `unit` (optional): Filter by department
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### POST /users
Create new user (Admin only).

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "role": "Assistant Lecturer",
  "division": "Academic Affairs",
  "unit": "Engineering",
  "position": "Assistant Lecturer",
  "grade": "Grade 13"
}
```

#### GET /users/:id
Get user by ID.

#### PUT /users/:id
Update user.

#### DELETE /users/:id
Delete user (Admin only).

### Appraisals

#### GET /appraisals
Get all appraisals (Manager/Admin only).

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `employee_id` (optional): Filter by employee
- `appraiserId` (optional): Filter by appraiser
- `status` (optional): Filter by status
- `periodStart` (optional): Filter by period start
- `periodEnd` (optional): Filter by period end

#### POST /appraisals
Create new appraisal.

**Request Body:**
```json
{
  "employee_id": "uuid",
  "appraiserId": "uuid",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-12-31",
  "employeeInfo": {
    "title": "Mr.",
    "surname": "Doe",
    "firstName": "John",
    "gender": "Male",
    "grade": "Grade 14",
    "position": "Lecturer",
    "department": "Engineering",
    "appointmentDate": "2020-01-01"
  },
  "appraiserInfo": {
    "title": "Dr.",
    "surname": "Smith",
    "firstName": "Jane",
    "position": "Head of Department"
  },
  "trainingReceived": [],
  "keyResultAreas": [],
  "endOfYearReview": {
    "targets": [],
    "totalScore": 0,
    "averageScore": 0,
    "weightedScore": 0
  },
  "coreCompetencies": {},
  "nonCoreCompetencies": {},
  "overallAssessment": {
    "performanceScore": 0,
    "coreCompetenciesScore": 0,
    "nonCoreCompetenciesScore": 0,
    "overallTotal": 0,
    "overallPercentage": 0,
    "overallRating": 1,
    "ratingDescription": "Needs Improvement"
  }
}
```

#### GET /appraisals/:id
Get appraisal by ID.

#### PUT /appraisals/:id
Update appraisal.

#### PATCH /appraisals/:id/status
Update appraisal status.

**Request Body:**
```json
{
  "status": "submitted"
}
```

#### POST /appraisals/:id/signatures
Add signature to appraisal.

**Request Body:**
```json
{
  "signatoryType": "appraiser",
  "signatoryId": "uuid",
  "signatureData": "base64_signature_data",
  "signatureFileUrl": "https://example.com/signature.png"
}
```

#### GET /appraisals/:id/signatures
Get appraisal signatures.

#### DELETE /appraisals/:id
Delete appraisal (Manager/Admin only).

### Reviews

#### POST /reviews/mid-year/:appraisalId
Create mid-year review.

#### GET /reviews/mid-year/:appraisalId
Get mid-year review.

#### PUT /reviews/mid-year/:appraisalId
Update mid-year review.

#### POST /reviews/end-year/:appraisalId
Create end-year review.

#### GET /reviews/end-year/:appraisalId
Get end-year review.

#### PUT /reviews/end-year/:appraisalId
Update end-year review.

### Admin

#### GET /admin/dashboard
Get dashboard statistics (Admin only).

#### GET /admin/analytics
Get analytics data (Admin only).

#### GET /admin/access-requests
Get all access requests (Admin only).

#### POST /admin/access-requests/:id/approve
Approve access request (Admin only).

#### POST /admin/access-requests/:id/reject
Reject access request (Admin only).

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Authentication: 5 requests per 15 minutes per IP

## File Uploads

Supported file types:
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX

Maximum file size: 10MB
