# Test Concreate AI Application

## Overview

This application is built with Node.js, Prisma, Fastify, and MongoDB. It provides user management and account management functionalities, including transactions. 

## Features

- User registration and login
- JWT-based authentication
- Account creation and management
- Transaction handling (deposit and withdrawal)
- Secure password hashing with bcrypt
- MongoDB as the database
- Prisma as the ORM

## Technologies

- Node.js
- Fastify
- Prisma
- MongoDB
- Docker
- Docker Compose

## Prerequisites

- Node.js (v16 or later)
- Docker
- Docker Compose

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Firosmalik000/test-concreateAI
   cd test-concreateAI
   ```

2. Create a `.env` file in the root directory and add your environment variables:

   ```bash
   DATABASE_URL="mongodb://root:root123@ac-ufjoenx-shard-00-00.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-01.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-02.wv5qisj.mongodb.net:27017/TestConcreateAI?ssl=true&replicaSet=atlas-xeklsr-shard-0&authSource=admin&retryWrites=true&w=majority"
   PORT=5000
   ```

3. Build and run the application with Docker:

   ```bash
   docker-compose up --build
   ```

## API Endpoints

### User Endpoints

- `GET /users`: Get all users
- `GET /users/:id`: Get user by ID
- `POST /users`: Create a new user
- `PUT /users/:id`: Update user
- `DELETE /users/:id`: Delete user
- `POST /login`: User login
- `GET /me`: Get logged-in user details
- `POST /logout`: Logout user

### Account Endpoints

- `GET /accounts`: Get all accounts
- `POST /accounts`: Create a new account
- `POST /transactions`: Add a transaction

## Docker Commands

To build and run the Docker container:

```bash
docker-compose up --build
```

To stop the Docker container:

```bash
docker-compose down
```

To access the running container:

```bash
docker exec -it <container_id> /bin/sh
```

## Database Migration

Run the following command to generate Prisma client and apply database migrations:

```bash
npx prisma generate
```

## Running Locally

If you prefer to run the application locally without Docker:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the Prisma generate command:

   ```bash
   npx prisma generate
   ```

3. Start the application:

   ```bash
   node index.js / nodemon index.js
   ```

## Contact

For any inquiries or issues, please contact [firosmalik.job@gmail.com].

---
