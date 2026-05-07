# Full-Stack Developer Portfolio

A deploy-ready MERN portfolio with a modern React/Tailwind frontend, Express/Mongoose REST API, JWT-protected admin dashboard, dynamic projects, dark mode, validation, and local image uploads. For local demos, the API can fall back to a JSON data store when MongoDB is not running.

## Project Structure

```text
developer-portfolio-fullstack/
  backend/
    src/
      config/db.js
      controllers/authController.js
      controllers/projectController.js
      middleware/authMiddleware.js
      middleware/errorMiddleware.js
      middleware/uploadMiddleware.js
      middleware/validate.js
      models/Project.js
      models/User.js
      routes/authRoutes.js
      routes/projectRoutes.js
      utils/generateToken.js
      utils/seedAdmin.js
      utils/seedProjects.js
      app.js
      server.js
    uploads/
    .env.example
    package.json
  frontend/
    public/
    src/
      api/client.js
      components/Footer.jsx
      components/Navbar.jsx
      components/ProjectCard.jsx
      components/ProjectForm.jsx
      components/ProtectedRoute.jsx
      context/AuthContext.jsx
      context/ThemeContext.jsx
      pages/AdminDashboard.jsx
      pages/AdminLogin.jsx
      pages/Contact.jsx
      pages/Home.jsx
      pages/Projects.jsx
      App.jsx
      main.jsx
      styles.css
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
  package.json
  README.md
```

## API Routes

Base URL: `http://localhost:5000/api`

Projects:

- `GET /projects` fetch all projects
- `GET /projects/:id` fetch one project
- `POST /projects` create project, protected
- `PUT /projects/:id` update project, protected
- `DELETE /projects/:id` delete project, protected

Auth:

- `POST /auth/login`
- `GET /auth/me`, protected

## Setup

1. Install root tooling:

```bash
npm install
```

2. Install backend and frontend dependencies:

```bash
npm run install:all
```

3. Create backend env file:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your MongoDB URL and a strong `JWT_SECRET`.

4. Create frontend env file:

```bash
cp frontend/.env.example frontend/.env
```

5. Start MongoDB locally or use MongoDB Atlas. If MongoDB is not available and `ALLOW_FILE_DB_FALLBACK=true`, the backend will run with `backend/data/projects.json` for local development.

6. Seed an admin user:

```bash
npm run seed --prefix backend
```

7. Optional sample projects:

```bash
npm run seed:projects --prefix backend
```

8. Run backend and frontend together:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Admin login: `http://localhost:5173/admin/login`

Default admin values come from `backend/.env.example`; change them before deploying.

## Deployment Notes

- The repo includes `render.yaml` for a free Render web service named `vikas-bhardwaj-portfolio`.
- The Render service builds the React frontend and serves it from the Express backend, so the live app, admin dashboard, and API can run from one URL.
- Create a free MongoDB Atlas database and set `MONGO_URI` in Render. Keep `ALLOW_FILE_DB_FALLBACK=false` in production so admin-added projects, profile data, messages, and categories persist.
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Render. On startup, the backend creates the admin user if it does not already exist.
- Set `CLIENT_URL` to the final Render URL, for example `https://vikas-bhardwaj-portfolio.onrender.com`.
- Admin login will be available at `/admin/login`.
- Render free web services use ephemeral disk. Project/profile image and resume URL fields are production-safe, but uploaded local files in `/uploads` can disappear after redeploys or restarts. For permanent uploads, use external URLs or replace local upload storage with Cloudinary/S3.

## Features Checklist

- React functional components and hooks
- Tailwind CSS responsive UI
- React Router navigation
- Projects fetched dynamically from backend API
- Loading and error states
- Express REST API with MVC structure
- MongoDB and Mongoose models
- JWT admin authentication
- Protected admin routes
- Add, edit, delete projects
- Environment variable examples
- API validation and centralized error handling
- Dark mode toggle
- Local image upload
- Contact form validation
- SEO metadata with React Helmet
