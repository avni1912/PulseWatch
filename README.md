# PulseWatch — API Monitoring and Incident Tracking

PulseWatch is a full-stack web application for monitoring API availability, tracking response latency, maintaining check history, and recording incidents when endpoints become unavailable.

## Features

* Create, edit, and delete API monitors
* Check endpoint availability and HTTP status codes
* Measure response latency
* Schedule automatic health checks at configurable intervals
* Trigger manual checks
* Store and view historical monitoring results
* Automatically create and resolve incidents based on monitor status
* View active and resolved incidents with duration
* Dashboard statistics for monitor health and latency

## Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Tools:** REST APIs, Fetch API, dotenv, Git, GitHub

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/avni1912/PulseWatch.git
cd PulseWatch
```

### 2. Start the backend

```bash
cd backend
npm install
```

Configure the database credentials in your backend `.env` file, then start the server:

```bash
node server.js
```

### 3. Start the frontend

Open another terminal, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite in the terminal.

## Database

Configure MySQL and create the required tables before running the application. Keep credentials in `.env`; never commit secrets.

## Project Status

Personal full-stack project. Features and setup may evolve as development continues.

## Repository

https://github.com/avni1912/PulseWatch
