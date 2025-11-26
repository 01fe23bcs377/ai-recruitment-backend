# RecruitAI - Cloud-Based AI Recruitment Verification System

## Overview
This is a cloud-based recruitment system that leverages AI for resume parsing and candidate matching, with blockchain-based certificate verification.

## Issues Fixed

### 1. Authentication Issues
- Fixed the authentication middleware to properly protect API routes
- Updated frontend API configuration to work with deployed environment

### 2. API Endpoint Issues
- Implemented missing backend controllers for dashboard, ranking, and verification
- Added proper error handling and response formatting
- Fixed file serving for uploaded resumes and certificates

### 3. Database Schema Issues
- Updated Candidate model with additional fields needed for ranking and dashboard
- Added matchScore and verified fields for better candidate tracking

### 4. Frontend-Backend Integration
- Fixed API base URL configuration for production deployment
- Ensured proper CORS configuration for cross-origin requests

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gemini API key for AI features

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   - PORT: Server port (default: 5000)
   - MONGO_URI: MongoDB connection string
   - JWT_SECRET: Secret key for JWT tokens
   - GEMINI_API_KEY: API key for Gemini AI services

4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints
- Authentication: `/api/auth`
- Resume Management: `/api/resume`
- AI Parsing: `/api/ai`
- Candidate Ranking: `/api/rank`
- Certificate Verification: `/api/verify`
- Dashboard: `/api/dashboard`

## Features
1. **User Authentication**: Secure login and registration
2. **Resume Upload**: PDF resume upload and storage
3. **AI Parsing**: Automatic extraction of skills, experience, and education
4. **Candidate Ranking**: AI-powered candidate matching based on job requirements
5. **Certificate Verification**: Blockchain-based academic certificate verification
6. **Dashboard**: Analytics and candidate overview

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **Authentication**: JWT
- **File Upload**: Multer
- **Blockchain**: Simulated verification (can be extended with actual blockchain integration)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.
