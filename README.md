# Full-Stack CRM Lead Management System

A production-grade, full-stack CRM Lead Management System built for an EdTech organization to manage prospective student course enquiries, counselor assignments, atomic lead claiming, and enrollment lifecycle progression.

Built with a modular monorepo architecture separating the **React (Vite) Frontend** and **Node.js (Express) REST API Backend**.

---

## 1. Architecture & Design Principles

```text
crm-lead-management/
├── frontend/                     # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/           # Reusable UI components (pure functional)
│   │   ├── context/              # AuthContext (React Context API)
│   │   ├── pages/                # Route pages (pure functional)
│   │   ├── services/             # Axios API clients (crmApi & fastorApi)
│   │   ├── App.jsx               # Router & App root
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Tailwind CSS & custom scrollbars
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── backend/                      # Node.js + Express + Mongoose REST API
│   ├── src/
│   │   ├── config/               # Database connection
│   │   ├── controllers/          # Request handlers (pure functions)
│   │   ├── middleware/           # Auth, Validation, Rate Limit, Error handling
│   │   ├── models/               # Mongoose schemas (Employee & Lead)
│   │   ├── routes/               # Express routers
│   │   ├── services/             # Business logic & atomic database operations
│   │   ├── validators/           # Zod validation schemas
│   │   ├── utils/                # JWT, errors, seed script
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server listener
│   ├── tests/                    # Integration & concurrency tests (Supertest + Jest)
│   ├── .env.example
│   └── package.json
├── README.md                     # Comprehensive documentation
├── .gitignore
└── package.json                  # Root monorepo scripts
```

### Pure Functional Programming Paradigm
Per strict architecture guidelines, **no class-based code** is used anywhere in the codebase:
- **Backend:** Plain functions, factory functions, arrow functions, and functional middleware. No `class` keywords.
- **Frontend:** Pure functional React components with hooks (`useState`, `useEffect`, `useCallback`, `useContext`, `useMemo`). Zero class components.

---

## 2. Postman Collection Inspection & External API Integration

Before implementation, the assigned Postman collection was inspected:
- **Collection URL:** `https://www.postman.com/lunar-sunset-956052/react-task/collection/8878133-877a3a64-7f42-4f37-bdbe-00c428296471`
- **Collection ID:** `8878133-877a3a64-7f42-4f37-bdbe-00c428296471`

### Endpoints Identified:
| # | Name | HTTP Method | Endpoint | Headers / Body | Purpose |
|---|------|-------------|----------|----------------|---------|
| 1 | Register & Get OTP | `POST` | `https://staging.fastor.ai/v1/pwa/user/register` | `Content-Type: application/x-www-form-urlencoded`<br>Body: `phone=9818979450&dial_code=+91` | Triggers OTP dispatch |
| 2 | Login with OTP | `POST` | `https://staging.fastor.ai/v1/pwa/user/login` | `Content-Type: application/x-www-form-urlencoded`<br>Body: `phone=9818979450&otp=123456&dial_code=+91` | Returns Fastor user profile and JWT |
| 3 | Fetch Restaurant | `GET` | `https://staging.fastor.ai/v1/m/restaurant?city_id=118` | `Authorization: Bearer <fastor_token>` | Lists restaurants for city ID 118 |

### Architectural Findings:
1. **External Assignment Distinction:** The collection corresponds to an external Fastor food delivery/PWA task. None of those endpoints provide CRM Lead Management (counselor email authentication, prospective student enquiries, unassigned lead pools, atomic lead claims, or lead status progression).
2. **Clean Separation of Concerns:** As instructed, the external Postman collection APIs are integrated via an independent client (`frontend/src/services/fastorApi.js`) and can be tested live via the **Postman API Inspector** tab (`/external-api`), leaving the internal CRM database and REST API clean, secure, and decoupled.

---

## 3. CRM Lead Management Business Rules & Atomic Claiming

1. **Public Enquiry Submission:** Prospective students can submit enquiries without any authentication at `POST /api/v1/public/enquiries`. The backend strictly sanitizes inputs and forces `assignedTo: null` and `status: 'NEW'`.
2. **Atomic Race-Condition Protection:** When multiple counselors attempt to claim the same unclaimed lead simultaneously, MongoDB conditional atomic updates are enforced:
   ```javascript
   const claimedLead = await Lead.findOneAndUpdate(
     { _id: leadId, assignedTo: null },
     { $set: { assignedTo: counselorId } },
     { new: true, runValidators: true }
   );
   ```
   If two counselors claim at the exact same millisecond, exactly one update succeeds. The second receives an **HTTP 409 Conflict** (`"This lead has already been claimed by another counselor"`).
3. **Private Lead Isolation (Anti-IDOR):** 
   - Public leads (`GET /api/v1/leads/public`) returns only leads where `assignedTo: null`.
   - Private leads (`GET /api/v1/leads/my`) returns only leads where `assignedTo: req.user._id`.
   - Direct lead access (`GET /api/v1/leads/:id`) and status update (`PATCH /api/v1/leads/:id/status`) enforce that counselors can only view and mutate leads that belong to them (or unclaimed leads). Viewing another counselor's lead returns **HTTP 403 Forbidden**.
4. **No Client Trust:** The counselor ID is never accepted from request query parameters or request body; it is always derived securely from the verified JWT payload (`req.user._id`).

---

## 4. Backend REST API Reference (`/api/v1`)

### Authentication
- `POST /api/v1/auth/register` — Register a counselor account. Returns 201 with JWT and safe employee profile (password excluded). Returns 409 on duplicate email.
- `POST /api/v1/auth/login` — Authenticate counselor. Returns 200 with JWT. Returns 401 on invalid credentials.
- `GET /api/v1/auth/me` — Retrieve current authenticated counselor profile. Returns 200.

### Public Enquiries
- `POST /api/v1/public/enquiries` — Public submission for prospective students. Returns 201 with created lead (`assignedTo: null`).

### Lead Management (Requires JWT)
- `GET /api/v1/leads/public?page=1&limit=10&search=web` — Returns unclaimed leads (`assignedTo: null`) with pagination metadata.
- `GET /api/v1/leads/my?page=1&limit=10&status=NEW&search=john` — Returns leads assigned to the logged-in counselor.
- `PATCH /api/v1/leads/:id/claim` — Atomically claims the lead. Returns 200 on success, 404 if not found, 409 if already claimed.
- `PATCH /api/v1/leads/:id/status` — Updates status to `NEW`, `CONTACTED`, or `CONVERTED`. Returns 403 if lead belongs to another counselor.
- `GET /api/v1/leads/:id` — Returns lead details if unclaimed or assigned to the requester. Returns 403 if claimed by another counselor.
- `GET /api/v1/leads/stats` — Returns dashboard summary counts (available leads, counselor's leads by status).

### Standard Pagination Response Format:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

## 5. Getting Started

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v22 tested)
- **MongoDB**: v6.0 or higher running on `127.0.0.1:27017`

### 1. Clone & Setup Workspace
```bash
cd "/Users/anupamgupta/Desktop/FullStack_ assignment"
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file (pre-configured)
cp .env.example .env

# Seed the database with sample counselors and student leads
npm run seed

# Run automated integration tests
npm test

# Start backend server (starts on port 5000)
npm run dev
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start Vite dev server (starts on http://localhost:5173)
npm run dev
```

---

## 6. Pre-Configured Demo Credentials

The seed script (`npm run seed`) populates the database with two ready-to-test counselor accounts:

| Counselor | Email | Password | Role |
|-----------|-------|----------|------|
| **Alice Johnson** | `counselor.alice@edtech.com` | `Password123!` | Academic Counselor |
| **Bob Smith** | `counselor.bob@edtech.com` | `Password123!` | Academic Counselor |

*(Quick-fill buttons are provided on the Login page for one-click testing)*

---

## 7. Frontend Pages Overview

1. **Public Enquiry Portal (`/`):**
   - High-conversion landing page with institute overview, course options, and prospective student enquiry form.
   - Client-side validation with React Hook Form + Zod.
   - Immediate success confirmation card with reference ID and reset option.
   - Zero counselor assignment controls exposed to the public.
2. **Counselor Login (`/login`):**
   - Email and password validation, show/hide password toggle, loading spinner, error banners, and demo quick-fill buttons.
3. **Counselor Registration (`/register`):**
   - Full name, email, password, and confirmation password validation. Direct auto-login upon registration.
4. **CRM Dashboard (`/dashboard`):**
   - Metric cards: Available Unclaimed Leads, My Assigned Leads, In Progress (Contacted), and Converted Students.
   - Live stream of recent enquiries.
   - Modal preview of student notes and details.
5. **Available Leads Pool (`/leads/public`):**
   - Displays only unclaimed leads.
   - Live debounced search across names, emails, courses, and cities.
   - Sorting by date or name.
   - Single-click **Claim** button with confirmation modal and loading prevention.
   - Automatic 409 conflict detection with auto-refresh if another counselor claims the lead first.
6. **My Claimed Leads (`/leads/my`):**
   - Displays only leads assigned to the logged-in counselor.
   - Quick status filter tabs (All, NEW, CONTACTED, CONVERTED).
   - In-line dropdown to update status (`NEW` → `CONTACTED` → `CONVERTED`) with instant optimistic feedback.
   - Full lead details modal with prospect's questions and timestamps.
7. **Postman API Inspector (`/external-api`):**
   - Live 3-step interactive runner testing the external Fastor Postman collection endpoints (`register`, `login with OTP`, `fetch restaurants with Bearer token`).

---

## 8. Automated Testing

The backend includes a comprehensive integration test suite built with **Jest** and **Supertest** covering:
- Public enquiry submissions and payload sanitization
- Counselor registration, duplicate prevention, and password security
- Counselor login and invalid credential rejections
- Atomic lead claiming and simultaneous claim conflict (409) prevention
- Counselor private lead isolation (403 Forbidden on foreign leads)
- Status validation and transitions

Run the test suite anytime:
```bash
cd backend
npm test
```
Result: **13/13 tests passing.**
