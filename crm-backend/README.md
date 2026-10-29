# CRM Lead Management System — REST API Backend

A production-grade, modular Node.js + Express + MongoDB REST API for managing prospective student enquiries, counselor authentication, and concurrent lead claiming.

Built using **pure functional programming patterns with zero class-based code** (pure functions, closures, factory helpers, and middleware).

---

## 1. Project Overview & Folder Structure

```text
crm-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Mongoose connection & lifecycle management
│   ├── controllers/
│   │   ├── auth.controller.js   # Counselor registration, login, and profile
│   │   ├── lead.controller.js   # Public leads, personal leads, claim, status, stats
│   │   └── public.controller.js # Unauthenticated prospective student enquiry submission
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT extraction & employee verification
│   │   ├── error.middleware.js  # Centralized error & 404 handler
│   │   ├── rateLimit.middleware.js # Express rate limiters (auth, enquiries, api)
│   │   └── validate.middleware.js  # Zod schema validation middleware
│   ├── models/
│   │   ├── Employee.js          # Counselor model with bcrypt password hashing hook
│   │   └── Lead.js              # Lead model with compound querying indexes
│   ├── routes/
│   │   ├── auth.routes.js       # /api/v1/auth routes
│   │   ├── lead.routes.js       # /api/v1/leads routes
│   │   └── public.routes.js     # /api/v1/public routes
│   ├── services/
│   │   ├── auth.service.js      # Authentication logic
│   │   └── lead.service.js      # Atomic conditional updates & lead queries
│   ├── utils/
│   │   ├── errors.js            # Functional error factories
│   │   ├── jwt.js               # JWT signing & verification
│   │   └── seed.js              # Seed script with sample data
│   ├── validators/
│   │   └── schemas.js           # Zod validation schemas
│   ├── app.js                   # Express application setup
│   └── server.js                # Server entrypoint
├── tests/
│   └── api.test.js              # Integration test suite (Supertest + Jest)
├── .env.example
├── package.json
└── README.md
```

---

## 2. Business Logic & Acceptance Criteria

1. **Unauthenticated Public Enquiries:**
   - Any prospective student can submit an enquiry via `POST /api/v1/public/enquiries`.
   - The backend validates input, ignores any incoming assignment or privileged fields, and sets `assignedTo: null` and `status: 'NEW'`.
2. **Employee Registration & Authentication:**
   - Counselors register via `POST /api/v1/auth/register` with name, email, and password.
   - Passwords are encrypted using `bcryptjs` with salt rounds = 10.
   - JWT tokens are signed using `JWT_SECRET` and verified on all protected routes.
   - Safe employee profiles are returned (password hashes are never exposed).
3. **Atomic Lead Claiming (Concurrency & Anti-Race Condition):**
   - Leads are claimed atomically via `PATCH /api/v1/leads/:id/claim`.
   - Utilizes MongoDB's atomic conditional update:
     ```javascript
     const claimedLead = await Lead.findOneAndUpdate(
       { _id: leadId, assignedTo: null },
       { $set: { assignedTo: counselorId } },
       { new: true, runValidators: true }
     );
     ```
   - If two counselors attempt to claim the exact same lead simultaneously, exactly one succeeds. The second receives an **HTTP 409 Conflict** (`"This lead has already been claimed by another counselor"`).
4. **Data Isolation & Anti-IDOR Authorization:**
   - Unclaimed leads (`GET /api/v1/leads/public`) strictly filter `{ assignedTo: null }`.
   - Personal leads (`GET /api/v1/leads/my`) strictly filter `{ assignedTo: req.user._id }`.
   - Direct lead access (`GET /api/v1/leads/:id`) and status mutation (`PATCH /api/v1/leads/:id/status`) verify ownership against the authenticated counselor (`req.user._id`). Attempting to inspect or update another counselor's lead returns **HTTP 403 Forbidden**.
   - The counselor identity is always extracted from the verified JWT payload and never trusted from client request parameters.

---

## 3. REST API Specification (`/api/v1`)

### Authentication Endpoints
- **`POST /api/v1/auth/register`**
  - **Body:** `{ "name": "Alice Johnson", "email": "counselor.alice@edtech.com", "password": "Password123!" }`
  - **Responses:** `201 Created` (returns token and safe employee object), `400 Bad Request`, `409 Conflict` (duplicate email).
- **`POST /api/v1/auth/login`**
  - **Body:** `{ "email": "counselor.alice@edtech.com", "password": "Password123!" }`
  - **Responses:** `200 OK` (returns token and safe employee object), `400 Bad Request`, `401 Unauthorized`.
- **`GET /api/v1/auth/me`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Responses:** `200 OK` (returns authenticated counselor profile), `401 Unauthorized`.

### Public Enquiries Endpoint
- **`POST /api/v1/public/enquiries`**
  - **Body:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1 555-234-5678",
      "courseInterest": "Full Stack Web Development",
      "city": "Seattle",
      "message": "Looking for weekend batch."
    }
    ```
  - **Responses:** `201 Created`, `400 Bad Request`, `429 Too Many Requests`.

### Lead Management Endpoints (Require `Authorization: Bearer <token>`)
- **`GET /api/v1/leads/public`**
  - **Query Params:** `page` (default 1), `limit` (default 10), `search`, `sortBy` (default `createdAt`), `order` (`asc` | `desc`).
  - **Responses:** `200 OK` (returns list of unclaimed leads with pagination metadata).
- **`GET /api/v1/leads/my`**
  - **Query Params:** `page`, `limit`, `status` (`NEW` | `CONTACTED` | `CONVERTED`), `search`, `sortBy`, `order`.
  - **Responses:** `200 OK` (returns list of leads claimed by the requesting counselor).
- **`PATCH /api/v1/leads/:id/claim`**
  - **Responses:** `200 OK` (claimed successfully), `404 Not Found`, `409 Conflict` (already claimed by another counselor).
- **`PATCH /api/v1/leads/:id/status`**
  - **Body:** `{ "status": "CONTACTED" }` (or `CONVERTED`, `NEW`)
  - **Responses:** `200 OK`, `400 Bad Request`, `403 Forbidden` (not your lead), `404 Not Found`.
- **`GET /api/v1/leads/:id`**
  - **Responses:** `200 OK`, `403 Forbidden` (claimed by another counselor), `404 Not Found`.
- **`GET /api/v1/leads/stats`**
  - **Responses:** `200 OK` (returns counts of available leads, personal total, contacted, converted, and recent enquiries).

### Standard Response Format:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

## 4. Setup & Running Instructions

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **MongoDB** running locally on port `27017`

### 2. Installation
```bash
cd crm-backend
npm install
```

### 3. Environment Configuration
Create `.env` based on `.env.example`:
```bash
cp .env.example .env
```
Default `.env` values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crm_leads
JWT_SECRET=production_crm_secret_jwt_key_2026_super_secure_random_string_987654321
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed Sample Database
Populates counselors and sample unassigned/assigned student leads:
```bash
npm run seed
```
Demo accounts created:
- `counselor.alice@edtech.com` / `Password123!`
- `counselor.bob@edtech.com` / `Password123!`

### 5. Run Automated Tests
```bash
npm test
```
Executes all 13 integration tests with Supertest against an isolated test database.

### 6. Start the API Server
```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm start
```
The server will start at `http://localhost:5000/api/v1`.
Health check available at: `http://localhost:5000/api/v1/health`.
