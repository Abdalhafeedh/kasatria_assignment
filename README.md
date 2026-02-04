# Kasatria – 3D Data Visualization

A modern, interactive Three.js CSS3D visualization that displays data from a Google Sheet in a "periodic table" style layout.

![Demo](https://img.shields.io/badge/Three.js-CSS3D-blue)
![OAuth](https://img.shields.io/badge/Google-OAuth%202.0-red)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Google OAuth Login** – Secure authentication using Google Identity Services
- **Google Sheets Integration** – Real-time data loading from your Google Sheet
- **Express Backend** – Node.js server with environment variable configuration
- **4 Layout Modes:**
  - **Table** – 20 × 10 grid layout
  - **Sphere** – Fibonacci spiral sphere
  - **Double Helix** – DNA-style double helix
  - **Grid** – 5 × 4 × 10 3D grid
- **Net Worth Color Coding:**
  - 🔴 Red: < $100K
  - 🟠 Orange: ≥ $100K
  - 🟢 Green: ≥ $200K
- **Smooth Animations** – Powered by Tween.js
- **Interactive Controls** – Orbit, zoom, and pan with TrackballControls

## 📁 Project Structure

```
kasatria-threejs-assignment/
├── .env                    # Environment variables (GITIGNORED)
├── .env.example            # Environment template
├── .gitignore              # Git ignore file
├── package.json            # Node.js dependencies
├── README.md               # This file
├── public/                 # Static frontend files
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Application styles
│   └── src/
│       ├── main.js         # Application entry point
│       ├── auth.js         # Google OAuth authentication
│       ├── api.js          # Backend API integration
│       ├── scene.js        # Three.js scene management
│       ├── tiles.js        # Tile creation logic
│       ├── layouts.js      # Layout algorithms
│       ├── ui.js           # DOM and UI management
│       ├── constants.js    # Application constants
│       └── utils.js        # Utility functions
└── server/
    ├── index.js            # Express server entry point
    ├── routes/
    │   └── sheets.js       # Google Sheets API routes
    └── services/
        └── googleSheets.js # Google Sheets service
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Project with OAuth credentials
- A Google Sheet with your data

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Add **Authorized JavaScript origins**:
     - `http://localhost:8080` (for local development)
     - Your production URL
   - Copy the **Client ID**

### 2. Google Sheet Setup

1. Create a Google Sheet
2. Import the provided CSV data
3. Ensure headers are in the first row: `Name`, `Photo`, `Age`, `Country`, `Interest`, `Net Worth`
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
5. Make sure the sheet is shared with anyone who needs access (or use "Anyone with the link" for testing)

### 3. Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```env
   PORT=8080
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_SHEET_ID=your-spreadsheet-id
   GOOGLE_SHEET_RANGE=A1:F201
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Open http://localhost:8080 in your browser.

## 📊 Expected Data Format

Your Google Sheet should have these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Name | Person's name | John Doe |
| Photo | Image URL | https://... |
| Age | Age in years | 35 |
| Country | Country code/name | USA |
| Interest | Area of interest | Technology |
| Net Worth | Net worth value | $150,000 |

## 🔒 Security Best Practices

- ✅ Environment variables are used for all sensitive configuration
- ✅ The `.env` file is gitignored
- ✅ Server-side Google Sheets API calls protect credentials
- ✅ OAuth tokens are handled securely via Google Identity Services

**Never commit your `.env` file to version control!**

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start with file watching (auto-reload) |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Serves the frontend application |
| `GET /api/config` | Returns public config (Client ID) |
| `GET /api/sheets/data` | Returns sheet data (requires auth) |
| `GET /api/health` | Health check endpoint |

### File Responsibilities

| File | Purpose |
|------|---------|
| `server/index.js` | Express server setup and routing |
| `server/services/googleSheets.js` | Google Sheets API integration |
| `public/src/main.js` | Application orchestration and lifecycle |
| `public/src/auth.js` | Google OAuth 2.0 token management |
| `public/src/api.js` | Backend API calls |
| `public/src/scene.js` | Three.js scene, camera, renderer |
| `public/src/tiles.js` | CSS3D tile creation |
| `public/src/layouts.js` | Position calculations for all layouts |
| `public/src/ui.js` | DOM manipulation and events |
| `public/src/constants.js` | Centralized configuration values |
| `public/src/utils.js` | Helper functions |

### Adding New Layouts

1. Open `public/src/layouts.js`
2. Add a new generator function following the pattern
3. Export the function
4. Update `generateAllTargets()` to include it
5. Add a button in `public/index.html`
6. Wire it up in `public/src/main.js`

## 📦 Dependencies

### Backend (Node.js)
- **express** – Web server framework
- **dotenv** – Environment variable management
- **cors** – Cross-origin resource sharing
- **googleapis** – Google Sheets API client
- **google-auth-library** – OAuth authentication

### Frontend (CDN)
- [Three.js r160](https://threejs.org/) – 3D rendering
- [CSS3DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS3DRenderer) – CSS 3D objects
- [TrackballControls](https://threejs.org/docs/#examples/en/controls/TrackballControls) – Camera controls
- [Tween.js](https://github.com/tweenjs/tween.js) – Animation tweening
- [Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/overview) – OAuth

## 🎯 Assignment Requirements Checklist

- [x] Google login credential
- [x] Load data from Google Sheet
- [x] Display tiles with: Photo, Name, Age, Country, Interest, Net Worth
- [x] Color by Net Worth (Red < $100K, Orange ≥ $100K, Green ≥ $200K)
- [x] Table layout – 20 × 10
- [x] Sphere layout
- [x] Double Helix layout
- [x] Grid layout – 5 × 4 × 10
- [x] Environment variables for configuration
- [x] Node.js/Express backend

## 📝 License

MIT License – feel free to use and modify for your projects.

---

Made with ❤️ for the Kasatria Software Developer position
