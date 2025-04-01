# Real-Time Chat Application

A real-time chat application that allows multiple users to join and interact in different chat rooms. This project demonstrates real-time communication, token-based authentication, and a modular, scalable architecture.

## Features

- Real-time messaging using Socket.IO
- Token-based authentication
- Multiple chat rooms with real-time updates
- Room creation and management
- Display of active rooms and online users
- Secure user sessions with token persistence
- Modular, component-based architecture

## Tech Stack

- **Frontend**: React (Next.js), TypeScript, TailwindCSS
- **Backend**: Node.js, Express, Socket.IO

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the Application

The application consists of both a frontend (Next.js) and a backend (Express) server. You can run them both simultaneously using:

```bash
npm run dev:all
```

Or you can run them separately:

backend server:
```bash
npm run dev:server
```
frontend development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Enter a username and password on the login screen to authenticate.
2. After login, you'll see the available chat rooms.
3. Join any room by clicking on it.
4. Create a new room using the "Create New Room" button.
5. Send messages in the current room using the message input at the bottom.
6. Leave a room by clicking the "Leave Room" button.
7. Log out using the "Log Out" button in the room header.

