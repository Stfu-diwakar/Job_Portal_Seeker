# Seeker — Job Portal Platform

<p align="center">
  <strong>A full-stack job portal for discovering opportunities, applying for jobs, and managing recruitment workflows.</strong>
  <br />
  <a href="https://job-portal-seeker-two.vercel.app/">Live Demo</a> ·
  <a href="https://github.com/Stfu-diwakar/Job_Portal_Seeker">Source Code</a>
</p>

---

## Overview

**Seeker** is a full-stack job portal built with React and Node.js. It provides separate experiences for job seekers and recruiters, with JWT-based authentication and a REST API for jobs and applications.

The frontend is built with React, Vite, Bootstrap, and Lucide icons. The backend uses Express and Mongoose, with MongoDB support.

## Features

### For job seekers
- Create an account and sign in securely.
- Browse available job listings and view job details.
- Search and filter opportunities by relevant criteria.
- Apply for jobs with application details.
- Track submitted applications and their statuses.

### For recruiters
- Sign in with a recruiter account.
- Post new job listings.
- Review applications associated with job listings.
- Update application statuses.

### Platform
- Role-aware, protected application routes.
- JWT authentication with bearer tokens.
- Password hashing using bcryptjs.
- REST API with centralized error handling.
- Responsive React interface with an interactive visual background.
- Demo data for trying the application.

## Preview

<p align="center">
  <a href="https://job-portal-seeker-two.vercel.app/">
    <img src="https://img.shields.io/badge/Visit%20Live%20Application-Open%20Seeker-6C5CE7?style=for-the-badge" alt="Visit Seeker live application" />
  </a>
</p>

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| UI | Bootstrap 5, Lucide React, CSS |
| HTTP client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Testing | Jest, Supertest |
| Deployment configuration | Vercel (frontend), Render (backend) |

## Architecture

```text
┌─────────────────────────────────────┐
│         React + Vite Frontend       │
│  Pages · Components · React Router  │
└──────────────────┬──────────────────┘
                   │ HTTP / JSON
                   │ Bearer JWT
┌──────────────────▼──────────────────┐
│          Express REST API           │
│  Auth · Jobs · Applications         │
│  Middleware · Error Handling        │
└──────────────────┬──────────────────┘
                   │ Mongoose
┌──────────────────▼──────────────────┐
│              MongoDB                │
│       Users · Jobs · Applications   │
└─────────────────────────────────────┘
```

## Run Locally

### 1. Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local instance or MongoDB Atlas)

### 2. Clone the repository

```bash
git clone https://github.com/Stfu-diwakar/Job_Portal_Seeker.git
cd Job_Portal_Seeker
```

### 3. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs the root, backend, and frontend dependencies.

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory. You can use `backend/.env.example` as a starting point:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Use your own strong, private `JWT_SECRET`. Do not commit real credentials or environment files to GitHub.

For the frontend, the API defaults to `http://localhost:5000/api`. If your backend runs elsewhere, create `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:5000
```

The frontend appends `/api` automatically when needed.

### 5. Start the application

From the project root:

```bash
npm run dev
```

| Service | Local URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend health check | http://localhost:5000/ |
| API base | http://localhost:5000/api |

To run either service separately:

```bash
npm run server
npm run client
```

## Demo Accounts

The project includes seeded demo accounts for exploring the application:

| Role | Email | Password |
|---|---|---|
| Job seeker | alex@example.com | password123 |
| Recruiter | recruiter@techjobs.io | password123 |

These are **demo credentials only**. Do not use them for a production deployment or store real personal information in a demo environment. Seed data is initialized when the jobs collection is empty.

> **Database note:** The backend contains a fallback data-store mode when MongoDB cannot be reached. Treat fallback data as temporary; use a properly configured MongoDB database for persistent data.

## API Overview

The API is mounted under `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Sign in and receive a JWT |
| GET | `/api/auth/me` | Get the authenticated user's profile |
| GET | `/api/jobs` | List jobs; supports query filters |
| GET | `/api/jobs/:id` | Get a job by ID |
| POST | `/api/jobs` | Create a job (authenticated) |
| DELETE | `/api/jobs/:id` | Delete a job (authenticated) |
| POST | `/api/applications` | Submit a job application |
| GET | `/api/applications/my` | List the current user's applications |
| GET | `/api/applications/job/:jobId` | List applications for a job |
| PUT | `/api/applications/:id/status` | Update an application status |

Protected endpoints expect this header:

```http
Authorization: Bearer <your-jwt-token>
```

Job listing filters include `search`, `category`, `type`, `experience`, `location`, and `featured`.

## Tests

Run the backend test suite from the project root:

```bash
npm test
```

The test command uses Jest and runs tests serially with open-handle detection.

## Deployment

The repository includes a `render.yaml` blueprint for the backend service.

### Backend — Render
Configure the backend service with:
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`

Use a persistent MongoDB database such as MongoDB Atlas and set a strong secret in the hosting provider's environment settings.

### Frontend — Vercel
Deploy the `frontend` directory as the Vercel project root, using the Vite framework preset. Set `VITE_API_URL` to the deployed backend origin (the frontend will append `/api`).

The public demo is available at **[job-portal-seeker-two.vercel.app](https://job-portal-seeker-two.vercel.app/)**.

## Project Structure

```text
Job_Portal_Seeker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── data/            # Seed data
│   │   ├── middleware/      # Authentication and error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Auth, jobs, applications APIs
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── render.yaml
└── package.json
```

## Author

**Diwakar Jha**

- Portfolio: [portfolio-bpd3.onrender.com](https://portfolio-bpd3.onrender.com/)
- GitHub: [@Stfu-diwakar](https://github.com/Stfu-diwakar)
- LinkedIn: [Diwakar Jha](https://www.linkedin.com/in/diwakar-jha-064130229/)

---

<p align="center">
  Built with React, Node.js, and MongoDB.
  <br />
  <a href="https://job-portal-seeker-two.vercel.app/">Explore Seeker</a>
</p>
