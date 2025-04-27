# Secret Lovers Chat App
The place where secret lovers meet to chat!

## Features
- Real-time messaging using WebSockets
- User authentication and context-based routing
- Lightweight and easy to extend

## Prerequisites
- Node.js v14 or higher
- npm v6 or higher

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ChatApp
   ```

2. **Install dependencies**
   ```bash
   # Client
   cd Client
   npm install

   # Server
   cd ../Server
   npm install
   ```

## Running the App

1. **Start the server**
   ```bash
   cd Server
   nodemon
   ```

2. **Start the client**
   ```bash
   cd ../Client
   npm run dev
   ```

3. **Open** your browser at `http://localhost:5173` (default Vite port) to begin chatting.

## Project Structure
```
ChatApp/
├─ Client/       # React frontend
└─ Server/       # Express backend
```

## License
Distributed under the MIT License. Feel free to customize as needed.

