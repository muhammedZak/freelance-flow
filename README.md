# FreelanceFlow

FreelanceFlow is a beginner-level React student project for managing clients, projects, tasks, invoices, and payments.

This project is built for learning and student submission. It is not a production-ready SaaS application. The code is kept simple, readable, and beginner-friendly.

## Project Idea

FreelanceFlow helps freelancers manage their basic workflow in one place.

The app includes:

- Client management
- Project management
- Task tracking
- Invoice management
- Payment tracking
- Dashboard summary
- Fake authentication
- Simple role-based access
- Light/dark theme support

## Tech Stack

- React 18+
- Vite
- JavaScript
- React Router v6
- Redux Toolkit
- Redux async thunks
- Context API
- JSON Server
- Tailwind CSS
- localStorage

## Main Learning Concepts

This project is created to practice these React concepts:

- Functional components
- `useState`
- `useEffect`
- `useContext`
- React Router routes
- Dynamic routes using `useParams`
- Navigation using `useNavigate`
- URL filters using `useSearchParams`
- Protected routes
- Redux Toolkit slices
- Async thunks
- Form validation
- JSON Server CRUD
- Search, filter, and sort
- localStorage persistence
- Responsive UI
- Loading, error, and empty states

## User Roles

The project uses simple role-based access.

| Role       | Access                                                      |
| ---------- | ----------------------------------------------------------- |
| freelancer | Can manage clients, projects, tasks, invoices, and payments |
| client     | Can view assigned projects and invoices                     |
| admin      | Can view all data and access admin page                     |

This role system is simple and beginner-friendly. It is not a production-level permission system.

## Main Routes

| Route                 | Page            |
| --------------------- | --------------- |
| `/`                   | Home page       |
| `/login`              | Login page      |
| `/register`           | Register page   |
| `/dashboard`          | Dashboard page  |
| `/clients`            | Clients list    |
| `/clients/new`        | Add client      |
| `/clients/:id`        | Client details  |
| `/clients/:id/edit`   | Edit client     |
| `/projects`           | Projects list   |
| `/projects/new`       | Add project     |
| `/projects/:id`       | Project details |
| `/projects/:id/edit`  | Edit project    |
| `/projects/:id/tasks` | Project tasks   |
| `/invoices`           | Invoices list   |
| `/invoices/new`       | Add invoice     |
| `/invoices/:id`       | Invoice details |
| `/payments`           | Payments page   |
| `/settings`           | Settings page   |
| `/admin`              | Admin page      |
| `*`                   | Not found page  |

## JSON Server Resources

The fake backend uses `db.json`.

Resources:

- users
- clients
- projects
- tasks
- invoices
- payments
- activities

## Demo Accounts

Use these accounts for testing:

### Freelancer

```txt
Email: freelancer@example.com
Password: 123456
```

### Client

```txt
Email: client@example.com
Password: 123456
```

### Admin

```txt
Email: admin@example.com
Password: 123456
```

## Installation

Clone the project and install dependencies.

```bash
npm install
```

## Run React App

Start the Vite development server.

```bash
npm run dev
```

React app will usually run on:

```txt
http://localhost:5173
```

## Run JSON Server

Start the fake backend in another terminal.

```bash
npm run server
```

JSON Server will run on:

```txt
http://localhost:3000
```

Example API endpoints:

```txt
http://localhost:3000/users
http://localhost:3000/clients
http://localhost:3000/projects
http://localhost:3000/tasks
http://localhost:3000/invoices
http://localhost:3000/payments
http://localhost:3000/activities
```

## Available Scripts

```bash
npm run dev
```

Runs the React app.

```bash
npm run server
```

Runs JSON Server using `db.json`.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Previews the production build locally.

## Project Status

FreelanceFlow has completed all planned student project phases.

Completed phases:

- Phase 0 — Project scope and planning
- Phase 1 — Vite setup, Tailwind, folder structure, and routes
- Phase 2 — JSON Server setup and seed data
- Phase 3 — Fake authentication with Redux and localStorage
- Phase 4 — Protected routes and simple role-based access
- Phase 5 — Dashboard summary cards
- Phase 6 — Clients CRUD
- Phase 7 — Projects CRUD
- Phase 8 — Tasks CRUD and project progress
- Phase 9 — Invoices CRUD and invoice total calculation
- Phase 10 — Payments tracker and invoice status synchronization
- Phase 11 — Search, filter, sort, and URL query parameters
- Phase 12 — ThemeContext light and dark mode
- Phase 13 — Responsive UI polish and final preparation

The application is ready for final testing, project submission, and viva demonstration.

## Project Folder Structure

```txt
src/
├── app/
│   └── store.js
├── components/
│   ├── common/
│   └── layout/
├── context/
├── features/
│   ├── auth/
│   ├── clients/
│   ├── projects/
│   ├── tasks/
│   ├── invoices/
│   ├── payments/
│   └── activities/
├── pages/
├── routes/
├── services/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

## How the Data Flow Works

The app follows a simple Redux data flow.

```txt
Component
→ dispatch async thunk
→ thunk calls JSON Server API
→ response goes to Redux slice
→ component reads data using useSelector
→ UI updates
```

Example:

```txt
DashboardPage
→ dispatch(fetchClients())
→ clientsService calls /clients API
→ clientsSlice stores data
→ DashboardPage displays total clients
```

## Authentication Flow

The app uses fake authentication.

```txt
Login form
→ dispatch loginUser
→ authService checks JSON Server users
→ Redux stores logged-in user
→ localStorage saves user session
→ user is redirected to dashboard
```

Logout clears:

- Redux auth state
- localStorage session

## Important Note

This project is for learning purposes only.

It does not include:

- Real backend
- Real authentication security
- JWT authentication
- Password hashing
- MongoDB
- Express.js
- Real payment gateway
- Production-level security

Passwords are stored in `db.json` only because this is a beginner student project using fake authentication.

## Author

Created as a beginner-level React student project.
