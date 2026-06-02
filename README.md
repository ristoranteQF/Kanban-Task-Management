# Kanban Task Management

A full-stack Kanban task management web app. Create boards, organize tasks into columns, break them into subtasks, and drag tasks between columns — all behind JWT authentication.

**Stack:** Angular 18 (frontend) · NestJS 10 + TypeORM + PostgreSQL (backend)

## Features

- User signup / login with JWT authentication
- Boards with custom columns
- Tasks with descriptions, status, and subtasks
- Toggle subtask completion
- Move tasks between columns (drag & drop)

## Project Structure

```
.
├── backend/    # NestJS REST API (auth, boards, tasks, subtasks)
└── frontend/   # Angular single-page app
```

## Prerequisites

- Node.js 18+
- PostgreSQL running locally

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run start:dev      # runs on http://localhost:5000
```

The API connects to PostgreSQL using these defaults (override via environment variables):

| Variable      | Default      |
| ------------- | ------------ |
| `DB_HOST`     | `localhost`  |
| `DB_PORT`     | `5432`       |
| `DB_USERNAME` | `postgres`   |
| `DB_PASSWORD` | `postgres`   |
| `DB_NAME`     | `kanban_db`  |

> Create the `kanban_db` database first. Schema is auto-synced in development (`synchronize: true`).

### 2. Frontend

```bash
cd frontend
npm install
npm start              # runs on http://localhost:4200
```

The frontend reads the API URL from `src/environments/environment.ts` (defaults to `http://localhost:5000`).

## API Overview

| Method  | Endpoint              | Description              |
| ------- | --------------------- | ------------------------ |
| `POST`  | `/auth/signup`        | Register a new user      |
| `POST`  | `/auth/login`         | Log in, returns JWT      |
| `GET`   | `/auth/me`            | Current user             |
| `GET`   | `/boards`             | List boards              |
| `POST`  | `/boards`             | Create a board           |
| `GET`   | `/boards/:id`         | Get a board              |
| `PATCH` | `/boards/:id`         | Update a board           |
| `DELETE`| `/boards/:id`         | Delete a board           |
| `POST`  | `/tasks`              | Create a task            |
| `PATCH` | `/tasks/:id`          | Update a task            |
| `PATCH` | `/tasks/:id/move`     | Move task to a column    |
| `DELETE`| `/tasks/:id`          | Delete a task            |
| `PATCH` | `/subtasks/:id/toggle`| Toggle subtask done      |
