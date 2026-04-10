# GitHub Clone

GitHub Clone is a full-stack web application inspired by core GitHub workflows. It allows users to create accounts, manage repositories, follow other users, open issues, view pull requests, and interact with project data through a dashboard interface. The backend also includes a lightweight Git-style CLI for initializing repositories, staging files, committing changes, and syncing commit snapshots with AWS S3.

## Features

- User authentication with signup and login
- User profile pages with follower and following support
- Create, view, update, and delete repositories
- Public and private repository visibility
- Star and unstar repositories
- Issue creation, filtering, updating, and deletion
- Pull request and comment endpoints
- Dashboard with personal repositories and discovery sections
- Contribution heatmap view on user profiles
- Custom Git-style commands for init, add, commit, push, pull, and revert

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Primer React

### Backend

- Node.js
- Express
- Mongoose
- MongoDB
- Socket.IO
- JWT
- bcryptjs

### Cloud and Storage

- MongoDB for application data
- AWS S3 for commit snapshot storage used by the CLI workflow

## Project Structure

```text
Github-Clone/
|-- frontend/
`-- backend/
```

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a `backend/.env` file using `backend/.env.example` as reference.

```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET=your_s3_bucket_name
```

## Running the Project

### Start the backend server

```bash
cd backend
npm start
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend is configured to communicate with the backend at `http://localhost:3002`.

## CLI Commands

The backend includes a small Git-inspired command system:

```bash
cd backend
node index.js init
node index.js add path/to/file
node index.js commit "commit message"
node index.js push
node index.js pull
node index.js revert <commitID>
```

These commands store local repository data inside `.apnaGit/` and use AWS S3 for push and pull operations.

## API Overview

### User Routes

- `POST /signup`
- `POST /login`
- `GET /userProfile/:id`
- `PUT /updateProfile/:id`
- `DELETE /deleteProfile/:id`
- `POST /follow/:userId`
- `POST /unfollow/:userId`
- `GET /followers/:userId`
- `GET /following/:userId`

### Repository Routes

- `POST /repo/create`
- `GET /repo/all`
- `GET /repo/:id`
- `GET /repo/user/:userID`
- `PUT /repo/update/:id`
- `DELETE /repo/delete/:id`
- `PATCH /repo/toggle/:id`
- `POST /repo/star/:repoId`
- `POST /repo/unstar/:repoId`

### Issue Routes

- `POST /issue/create`
- `GET /issue/all`
- `GET /issue/:id`
- `PUT /issue/update/:id`
- `DELETE /issue/delete/:id`

### Pull Request Routes

- `POST /pr/create/:userId`
- `GET /prs`
- `GET /pr/:id`
- `PUT /pr/update/:id`
- `DELETE /pr/delete/:id`

## Notes

- Frontend and backend are managed separately with their own `package.json` files.
- AWS credentials are only required for the custom CLI push and pull workflow.
- Environment files and `node_modules` should not be committed to GitHub.

