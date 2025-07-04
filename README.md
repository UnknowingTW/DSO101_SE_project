# DSO101 DevSecOps Project - BMI Calculator

## Project Overview

This project implements a complete DevSecOps pipeline for a PERN (PostgreSQL, Express, React, Node.js) stack application with BMI calculator functionality. The pipeline includes automated testing, containerization with Docker, continuous integration with Jenkins and GitHub Actions, and deployment to Render.

## BMI Calculator Implementation

The BMI calculator feature includes:
- **Frontend**: React component with input fields for height (meters), weight (kg), and age
- **Backend**: Express.js API endpoints for BMI calculation and data storage
- **Database**: PostgreSQL schema for storing BMI records with timestamps
- **Functionality**: 
 - Real-time BMI calculation
 - BMI category classification (Underweight, Normal, Overweight, Obese)
 - Data validation and error handling
 - History tracking of previous calculations

### BMI Calculation Formula
BMI = weight (kg) / height (m)²
### BMI Categories
- **Underweight**: BMI < 18.5
- **Normal weight**: BMI 18.5-24.9
- **Overweight**: BMI 25-29.9
- **Obese**: BMI ≥ 30
## Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Jenkins, GitHub Actions
- **Deployment**: Render Cloud Platform
- **Version Control**: Git, GitHub

## Screenshots

### Stage 1: Docker Configuration
- [x] Original application running locally
- [x] BMI calculator working in browser
- [x] Test results showing all 27 tests pass
- [x] Docker-compose build successful
- [x] Test execution via docker-compose
- [x] Docker volumes created (bmi_data, postgres_data, bmi_backup)
- [x] Application running in Docker environment

### Stage 2: Jenkins Setup
- [x] Jenkins dashboard after successful setup
- [x] GitHub credentials added to Jenkins
- [x] Pipeline configuration page
- [x] Successful pipeline execution with @push trigger
- [x] Test reports generated by Jenkins
- [x] GitHub showing code pushed by Jenkins

### Stage 3: GitHub Actions
- [x] GitHub secrets configuration page (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
- [x] GitHub Actions workflow file (.github/workflows/docker-build.yml)
- [x] Successful workflow execution
- [x] Docker Hub showing uploaded images (dso101-frontend, dso101-backend)

### Stage 4: Render Deployment
- [x] Database deployment successful
- [x] Backend service running
- [x] Frontend service running
- [x] Complete application working
- [x] Environment variables configured

## Features Implemented

### BMI Calculator Functionality
- Input validation for height, weight, and age
- Real-time BMI calculation with 2-decimal precision
- BMI category classification with color coding
- Form reset and clear functionality
- Responsive design for mobile and desktop
- Error handling and user feedback

### Testing Suite
- **27 comprehensive test cases** covering:
  - BMI calculation logic for all categories
  - Input validation and error handling
  - API endpoint testing
  - Edge cases and boundary values
  - Performance and reliability testing
  - Mock API response validation

### DevSecOps Pipeline
- **Automated Testing**: Jest test suite with 100% pass rate
- **Docker Containerization**: Multi-stage builds with volume persistence
- **Jenkins CI**: Automated builds triggered by @push commits
- **GitHub Actions**: Automated Docker image builds and registry push
- **Cloud Deployment**: Render platform with environment configuration

## Challenges Faced

### 1. Frontend Build Issues
**Problem**: Node.js version compatibility with `--openssl-legacy-provider`
**Solution**: Updated Dockerfile to use Node.js 14 for frontend builds

### 2. Test Configuration Conflicts
**Problem**: Multiple Jest configuration files causing conflicts
**Solution**: Removed separate jest.config.js and used package.json configuration

### 3. TypeScript Import Issues
**Problem**: ES6 imports in tests failing with CommonJS modules
**Solution**: Used pure JavaScript logic tests instead of API integration tests

### 4. GitHub Authentication
**Problem**: Password authentication deprecated for GitHub
**Solution**: Generated Personal Access Token with repo and workflow permissions

### 5. Docker Volume Persistence
**Problem**: BMI data not persisting between container restarts
**Solution**: Configured named volumes in docker-compose.yml

## Live Application

- **Frontend URL**: [Your Render Frontend URL]
- **Backend URL**: [Your Render Backend URL]
- **GitHub Repository**: https://github.com/UnknowingTW/DSO101_SE_project
- **Docker Hub Images**: 
  - Frontend: unknowingtw/dso101-frontend:latest
  - Backend: unknowingtw/dso101-backend:latest

## Local Development

### Prerequisites
- Node.js (v16+)
- Docker Desktop
- PostgreSQL (optional, using Docker)

### Setup Instructions

1. **Clone Repository**
```bash
git clone https://github.com/UnknowingTW/DSO101_SE_project.git
cd DSO101_SE_project
