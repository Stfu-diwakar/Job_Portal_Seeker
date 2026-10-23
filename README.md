# Seeker — High-Velocity Tech Career Platform
**Live**: [https://job-portal-seeker-two.vercel.app/](https://job-portal-seeker-two.vercel.app/)
A complete, production-grade Full Stack Job Portal Application built with **React 18, Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, and bcryptjs**.

Created by **Diwakar Jha**:
- 🌐 **Portfolio**: [portfolio-bpd3.onrender.com](https://portfolio-bpd3.onrender.com/)
- 💻 **GitHub**: [github.com/Stfu-diwakar](https://github.com/Stfu-diwakar)
- 💼 **LinkedIn**: [linkedin.com/in/diwakar-jha-064130229](https://www.linkedin.com/in/diwakar-jha-064130229/)

---

## 1. System Architecture

```text
       React Frontend (Vite + Bootstrap 5 + Magnetic Canvas)
                               │
                               ▼ [REST API: JSON & Bearer Tokens]
                  Node.js + Express.js API Server
                               │
                               ▼
               JWT Authentication & Role Middleware
                               │
                               ▼
             MongoDB Database / Mongoose Document Store
```

---

## 2. Technology Stack & Design System

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Bootstrap 5, Lucide Icons | Premium Obsidian Theme, High-Contrast Typography, Magnetic Mouse Physics Canvas, 3D Tilt Cards |
| **Backend** | Node.js, Express.js | Modular REST Architecture, Centralized Error Handling, CORS |
| **Database** | MongoDB / Mongoose | Production Atlas support with integrated zero-config document persistence fallback |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless Bearer token verification, 1-day expiration |
| **Password Security** | `bcryptjs` | 10 salt rounds cryptographic hashing |
| **Testing** | Postman & Jest / Supertest | 13 automated end-to-end tests passing |
| **Deployment** | Render & Vercel | `render.yaml` and `vercel.json` included |

---

## 3. Complete User Flow

```text
Registration ──► Login ──► JWT Token Generation ──► Dashboard Access
                                                          │
                                                          ▼
                                                      View Jobs
                                                          │
                                                          ▼
                                                   Apply for Jobs
                                                          │
                                                          ▼
                                              Real-Time Application Status
                                 (Submitted ➔ In Review ➔ Shortlisted ➔ Accepted)
```

---

## 4. Quickstart Guide (Local Development)

### Run Application:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Demo Credentials:
- **Jobseeker**: `alex@example.com` / `password123`
- **Recruiter**: `recruiter@techjobs.io` / `password123`

---

## 5. End-to-End Automated Testing

Run the test suite:
```bash
npm test
```

**13 / 13 Tests Passing:**
- `√ 1. Register User`: should register a new user successfully and return 201
- `√ 1b. Duplicate Email`: should reject registration if email is already taken (400)
- `√ 1c. Empty Fields`: should reject registration if fields are missing (400)
- `√ 2. Login User`: should authenticate user and generate valid JWT token (200)
- `√ 3. Invalid Password`: should return 401 Wrong Password for incorrect credentials
- `√ 3b. Invalid User`: should return 401 Invalid User if user email is not found
- `√ 4. Access Dashboard`: should allow access to protected profile with valid JWT token
- `√ 5. Access Dashboard Without Login`: should reject request without token (401)
- `√ 5b. Invalid Token`: should reject request with tampered/expired token (401)
- `√ 6. View Jobs`: should fetch list of available job listings (200)
- `√ 7. Apply Job`: should submit application and save to database (201)
- `√ 7b. Prevent Duplicate Application`: should reject second application for same job
- `√ 8. Fetch My Applications`: should return applications submitted by current user (200)

---

## 6. Postman API Collection

📁 [`postman/Job_Portal_API.postman_collection.json`](file:///a:/CU/SEM-3/TT-02/E06/postman/Job_Portal_API.postman_collection.json)
Import into Postman to test all authentication, job listing, and application tracking endpoints.
