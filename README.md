# Kasatria Three.js Assignment

3D Data Visualization using Three.js CSS3DRenderer with Google Sheets integration.

## Features
- Google OAuth login
- Data from Google Sheets
- 4 Layout modes: Table (20x10), Sphere, Double Helix, Grid (5x4x10)
- Net worth color coding: Red (<$100K), Yellow (≥$100K), Green (≥$200K)
- Click tiles to focus camera

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env` and fill in:
   ```
   PORT=8080
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_SHEET_ID=your-sheet-id
   GOOGLE_SHEET_RANGE=A1:F201
   ```

3. **Run the app**
   ```bash
   npm start
   ```

4. Open `http://localhost:8080`

## Google Cloud Setup

1. Create project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Sheets API
3. Configure OAuth consent screen
4. Create OAuth 2.0 Client ID (Web application)
5. Add `http://localhost:8080` to authorized origins

## Data Format

Google Sheet should have columns: Name, Photo, Age, Country, Interest, Net Worth
