# Event Management App - Frontend

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Project Description
The **Event Management App - Frontend** is a React-based web application that allows users to manage and participate in events. It provides a user-friendly interface for both participants and organizers to interact with the system. Participants can browse events, make reservations, and view their bookings, while organizers can create, edit, and manage events.

This frontend communicates with the backend API to handle authentication, event management, and reservations.

---

## Features
- **Authentication**: Login and registration for participants and organizers.
- **Event Browsing**: View a list of available events with filtering options.
- **Reservations**: Participants can reserve seats for events and view their reservations.
- **Event Management**: Organizers can create, edit, and delete events.
- **Participant Management**: Organizers can view participants for their events.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Technologies Used
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Material-UI (MUI)**: Component library for styling and responsive design.
- **Axios**: HTTP client for API communication.
- **React Router**: For client-side routing.
- **JWT**: For authentication and authorization.

---

## Requirements
- Node.js (v16+)
- npm or yarn

---

## Installation and Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/LukasZaw/event-management-app.git
   cd event-management-app/frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```
4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`.

---

## Project Structure
```
frontend/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/                    # Application source code
│   ├── api/                # Axios instance for API communication
│   ├── auth/               # Authentication context and utilities
│   ├── components/         # Reusable components (e.g., Navbar)
│   ├── pages/              # Application pages
│   │   ├── auth/           # Login and registration pages
│   │   ├── organizer/      # Organizer-specific pages
│   │   └── participant/    # Participant-specific pages
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Application entry point
│   └── ...                 # Other configuration files
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## Available Scripts
In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It bundles React in production mode and optimizes the build for the best performance.

---

## License
This project is licensed under the MIT License.

