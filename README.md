# GitHub Clone

A full-stack GitHub clone built with React, Vite, Express, MongoDB, Socket.IO, and AWS S3. The project includes authentication, user profiles, repository management, starring, following, issues, pull requests, and a custom CLI-inspired workflow for init, add, commit, push, pull, and revert operations.

## GitHub Repo Description

Use this in the GitHub repository description field:

`Full-stack GitHub clone with React, Express, MongoDB, Socket.IO, and AWS S3 for repositories, profiles, issues, pull requests, starring, and custom Git-style commands.`

Suggested topics:

`react` `vite` `express` `mongodb` `socket-io` `aws-s3` `github-clone` `full-stack`

## Features

- User signup and login with JWT-based authentication
- User profiles with followers and following
- Create, view, update, and delete repositories
- Public/private repository visibility toggle
- Star and unstar repositories
- Issue creation, filtering, updating, and deletion
- Pull request and comment APIs
- Dashboard with repository discovery and trending suggestions
- Contribution heatmap view
- Custom CLI-style repository commands backed by local storage and AWS S3

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Primer React
- Backend: Node.js, Express, Mongoose, MongoDB, Socket.IO, JWT, bcryptjs
- Storage: MongoDB for app data, AWS S3 for CLI push/pull snapshots

## Project Structure

```text
Github-Clone/
|-- frontend/   # React + Vite client
`-- backend/    # Express API + custom git-style CLI commands
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env` from `backend/.env.example`.

Required variables:

```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET=your_s3_bucket_name
```

Notes:

- The frontend currently calls the backend at `http://localhost:3002`, so keep the backend running on port `3002` unless you also update the frontend API URLs.
- MongoDB must be running or accessible through the provided connection string.
- AWS credentials and `S3_BUCKET` are only required for the custom CLI push/pull workflow.

### 3. Start the backend

```bash
cd backend
npm start
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

## Custom CLI Commands

The backend also exposes a lightweight Git-inspired CLI:

```bash
cd backend
node index.js init
node index.js add path/to/file
node index.js commit "your message"
node index.js push
node index.js pull
node index.js revert <commitID>
```

These commands create local data inside `.apnaGit/` and use AWS S3 for push/pull.

## Main API Areas

- Auth and users: signup, login, profile, followers, following
- Repositories: create, list, view, update, delete, visibility, stars
- Issues: create, list, update, delete
- Pull requests: create, list, update, delete
- Comments: create, list, update, delete

## Before Uploading To GitHub

- Do not commit `node_modules/`
- Do not commit `.env`
- Do not commit `.apnaGit/` local snapshot data
- Keep AWS keys and database credentials only in local env files

## Upload Steps

If you have not initialized Git yet:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

## Current Notes

- There is no root `package.json`; frontend and backend are managed separately.
- The frontend entry renders routed pages from `frontend/src/Routes.jsx`.
- Backend startup and CLI commands are defined in `backend/index.js`.
