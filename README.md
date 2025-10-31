# Node.js Express Demo Server

A simple Node.js Express server demo application with RESTful API endpoints and middleware configuration.

## Features

- Express.js web server
- CORS enabled
- Request logging with Morgan
- Environment variable configuration
- RESTful API endpoints
- Health check endpoint

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager) - comes with Node.js

You can check if you have them installed by running:
```bash
node --version
npm --version
```

## Step-by-Step Setup Instructions

### Step 1: Clone or Navigate to the Project

If you have the project from a repository, clone it:
```bash
git clone <repository-url>
cd node-demo
```

Or if you already have the project folder, navigate to it:
```bash
cd node-demo
```

### Step 2: Install Dependencies

Install all required npm packages:
```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing middleware
- `morgan` - HTTP request logger
- `dotenv` - Environment variable loader
- `nodemon` - Development tool for auto-restarting server

### Step 3: Configure Environment Variables

The `.env` file has been created with the default configuration. The server will run on port 3000 by default.

You can modify the `.env` file to change the port if needed:
```
PORT=3000
```

### Step 4: Start the Server

You have two options to start the server:

**Option A: Development Mode (with auto-reload)**
```bash
npm run dev
```

**Option B: Production Mode**
```bash
npm start
```

You should see a message like:
```
✅ Server running on http://localhost:3000
```

### Step 5: Test the Server

Open your browser or use a tool like `curl` to test the endpoints:

- **Health Check:**
  ```bash
  curl http://localhost:3000/health
  ```

- **API Name Endpoint:**
  ```bash
  curl http://localhost:3000/api/name?name=John
  ```

- **API Watch Endpoint:**
  ```bash
  curl http://localhost:3000/api/watch?v=10
  ```

- **Dynamic User Route:**
  ```bash
  curl http://localhost:3000/api/users/123
  ```

- **POST Echo Endpoint:**
  ```bash
  curl -X POST http://localhost:3000/api/echo \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello World"}'
  ```

## API Endpoints

### GET `/health`
Health check endpoint that returns server status.

**Response:**
```json
{
  "ok": true,
  "uptime": 123.45
}
```

### GET `/api/name`
Returns a personalized greeting message.

**Query Parameters:**
- `name` (optional): Name to greet (default: "World")

**Example:** `/api/name?name=John`

**Response:**
```json
{
  "message": "Hello, John!"
}
```

### GET `/api/watch`
Watch endpoint with video filtering.

**Query Parameters:**
- `v` (optional): Video ID to filter

### GET `/api/users/:id`
Returns user information by ID.

**URL Parameters:**
- `id`: User ID

**Example:** `/api/users/123`

**Response:**
```json
{
  "id": "123",
  "note": "Dynamic route param demo"
}
```

### POST `/api/echo`
Echo endpoint that returns the request body.

**Request Body:** Any JSON object

**Response:**
```json
{
  "you_sent": { /* your request body */ }
}
```

## Project Structure

```
node-demo/
├── node_modules/      # Dependencies (generated)
├── .env              # Environment variables
├── package.json      # Project configuration and dependencies
├── server.js         # Main server file
└── README.md         # This file
```

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload (nodemon)

## Troubleshooting

### Port Already in Use

If you see an error that port 3000 is already in use:
1. Change the `PORT` value in `.env` to a different port (e.g., `PORT=3001`)
2. Or stop the process using port 3000

### Dependencies Not Installing

If `npm install` fails:
1. Make sure you have a stable internet connection
2. Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
3. Check your Node.js version: `node --version`

### Server Not Starting

1. Check that all dependencies are installed: `npm list`
2. Verify `.env` file exists and has `PORT=3000`
3. Check the console for error messages

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management
- **Nodemon** - Development utility

## License

ISC
