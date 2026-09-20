# TaskFlow

TaskFlow is a full-stack task management application built with the MERN stack.

It allows users to create an account, securely log in, and manage their personal tasks with features such as priorities, due dates, search, filtering, sorting, and task completion tracking.

The project was built as a practical full-stack assignment with a focus on clean application structure, persistent data storage, authentication, and a usable frontend experience.

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected task APIs
- User-specific task data
- Automatic logout/access protection through authentication

### Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Mark completed tasks as pending again
- Add task descriptions
- Set task priority
  - Low
  - Medium
  - High
- Set due dates
- Task creation and update timestamps

### Task Organization

- Search tasks by title and description
- Filter by:
  - All
  - Pending
  - Completed
- Sort tasks by:
  - Newest
  - Oldest
  - Priority
  - Alphabetical order
- Task statistics
- Empty-state handling
- Loading states
- Error states
- Responsive interface

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### Database

MongoDB Atlas is used as the persistent database.

Task data is stored in MongoDB rather than in application memory or local JSON files, so data persists across server restarts.

---
## Project Structure
```text
taskflow/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```
---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account or a MongoDB instance
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/tinachelwanii/taskflow.git
cd taskflow
````

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

Open another terminal or return to the project root:

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

The `.env` file should not be committed to GitHub. It is excluded through `.gitignore`.

---

## Running the Application

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal and navigate to the `client` directory:

```bash
cd client
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use TaskFlow.

---

## Data Model

### User

Each user contains:

* Name
* Email
* Hashed password
* Created timestamp
* Updated timestamp

Passwords are hashed using bcrypt before being stored in the database.

### Task

Each task contains:

* Title
* Description
* Completion status
* Due date
* Priority
* User reference
* Created timestamp
* Updated timestamp

Each task is associated with the authenticated user through a MongoDB reference. This keeps task data separated between users.

---

## Authentication Flow

TaskFlow uses JWT-based authentication.

1. A user registers an account.
2. The password is hashed using bcrypt before being stored.
3. The user logs in using their email and password.
4. The backend verifies the credentials.
5. A JWT token is generated after successful authentication.
6. The frontend stores the token locally.
7. Protected task requests send the token in the `Authorization` header.
8. Authentication middleware verifies the token before allowing access to protected task routes.

---

## Design Decisions

### Persistent Database

MongoDB was selected for persistent task storage so that data survives server restarts instead of relying on in-memory storage or JSON files.

### User-Specific Tasks

Each task stores a reference to the user who created it. This allows multiple users to use the application while keeping their task data separated.

### JWT Authentication

JWT was used to provide a straightforward authentication mechanism for protecting task-related API routes.

### Password Security

Passwords are hashed using bcrypt before being stored in the database. Plain-text passwords are never stored.

### Task Organization

Instead of keeping tasks as a simple flat list, TaskFlow includes priorities, due dates, search, filtering, sorting, and task statistics.

### Frontend Structure

The frontend separates pages and API communication into different directories to keep the code organized and easier to maintain.

---

## Validation and Error Handling

The application handles common invalid states and API errors, including:

* Empty required fields
* Invalid login credentials
* Existing email during registration
* Missing authentication token
* Invalid authentication token
* Empty task titles
* Invalid task requests
* API and network errors
* Loading states during API requests

The frontend provides user feedback when an operation is loading or when an error occurs.

---

## Testing

The application was manually tested across the main user flows, including:

* User registration
* User login
* Invalid login credentials
* Task creation
* Task editing
* Task completion and reopening
* Task deletion
* Search
* Filtering
* Sorting
* Task priority
* Due dates
* Page refresh and persistent database data
* Authentication-protected routes
* Empty input validation
* Multiple browser tabs

## Deliberately Not Built

To keep the scope focused on the core task-management experience within the assignment timeframe, I intentionally did not build:

- Real-time collaboration
- Task sharing between users
- Notifications and reminders
- Recurring tasks
- File attachments
- Admin functionality

These could be considered in a future version depending on actual user needs.

## Future Improvements

If TaskFlow were developed further, I would consider:

- Task categories or tags
- Recurring tasks
- Notifications and reminders
- Pagination for larger task lists
- Automated unit and integration tests
- More advanced accessibility improvements
- Production deployment and monitoring
