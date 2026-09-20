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
