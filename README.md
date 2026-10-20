# How to Test the App

**Online Course Service — Web Application Development Final Examination**

The application consists of a Next.js backend (`next-backend/`), a React + Vite frontend (`react-frontend/`), and MongoDB. Authentication, roles, ownership, course status, capacity, and enrollment restrictions are enforced by the backend API.

## Student Information

- **Student Name:** Wai Yan Thet Min
- **Student ID:** 6715037

## Test Credentials

Run the backend seed scripts after configuring MongoDB. Six demonstration accounts are provided:

| Role | Username | Email | Password |
| --- | --- | --- | --- |
| Teacher | `teacher1` | `teacher1@example.com` | `CourseDemo2026!` |
| Teacher | `teacher2` | `teacher2@example.com` | `CourseDemo2026!` |
| Teacher | `teacher3` | `teacher3@example.com` | `CourseDemo2026!` |
| Student | `student1` | `student1@example.com` | `CourseDemo2026!` |
| Student | `student2` | `student2@example.com` | `CourseDemo2026!` |
| Student | `student3` | `student3@example.com` | `CourseDemo2026!` |

**Login:** Use either the username or email, together with the password above. These credentials are for exam testing only.

## Prerequisites

- Node.js **22 or later** and npm.
- MongoDB Atlas (or an accessible MongoDB server) with a valid connection string.
- Internet connection for installing dependencies.
- Two terminals for the backend and frontend.

## How to Run & Test

### 1. Backend Setup (`next-backend/`)

Open a terminal in the backend directory:

```bash
cd next-backend
npm install
```

Create `next-backend/.env.local` (you may copy `.env.example`) and set:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
DB_NAME=online_course_service
JWT_SECRET=REPLACE_WITH_YOUR_OWN_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
FRONTEND_URL=http://localhost:5173
```

Use your **actual** MongoDB URI and database name. Do not commit `.env.local` to GitHub.

To populate a **new** database with 3 Teachers, 3 Students, and 9 example courses:

```bash
npm run seed
```

**If the six users are already seeded**, add just the sample courses without resetting user passwords:

```bash
npm run seed:courses
```

The course seed includes Open, Close, and Cancel courses, with some Students already enrolled. Rerunning `seed:courses` does not duplicate existing sample courses or overwrite their edits. Rerunning `seed` also resets the six demo user passwords.

Start the API server:

```bash
npm run dev
```

Backend API: **http://localhost:3000/api/**. The page at `http://localhost:3000/` is only the original Next.js landing page; use the React site for the application interface.

### 2. Frontend Setup (`react-frontend/`)

Open a second terminal in the frontend directory:

```bash
cd react-frontend
npm install
```

The included `.env.development` uses the local backend. Confirm it contains:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173/** in your browser and sign in with a test account. The React app uses `HashRouter`.

### 3. Testing Walkthrough

1. **Authentication:** Open the frontend without logging in. The app should show the login page. Calling a protected API without credentials should return **401 Unauthorized**.
2. **Teacher course list:** Sign in as `teacher1`; the **My Courses** screen shows only teacher1's own courses.
3. **Create course:** Create a new **Open** course with a name, duration in days, multiple topics, price, and `Max Student = 1`.
4. **View/update course:** Open its details, check the enrolled Student list, and edit the course fields or status.
5. **Student search:** Sign out and sign in as `student1`. Use **Explore** to search by part of the course name or Teacher name.
6. **Enrollment:** Enroll in the new Open course. Verify it appears under **Enrolled / My Enrollments**.
7. **Duplicate enrollment:** Try enrolling in that course again. The backend must reject it.
8. **Maximum seats:** Sign in as `student2`; the one-seat course is full, so enrollment must be rejected.
9. **Delete restriction:** Return to `teacher1` and try deleting the enrolled course. Deletion must be rejected; its details should show the enrolled Student.
10. **Close status:** Change the course to **Close**. Students can still view it but cannot enroll.
11. **Cancel status:** Change the course to **Cancel**. It disappears from Student course discovery and cannot accept enrollment. Previously enrolled Students can still see it in their own enrollment list.
12. **Ownership:** Sign in as `teacher2` or `teacher3`. They must not view or modify teacher1's own courses through the Teacher API; the backend enforces this restriction.
13. **Delete empty course:** As a Teacher, create a course with no enrolled Students and delete it successfully.
14. **Logout:** Log out and confirm that protected API operations require a fresh login.
