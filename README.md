# GH-100-May-12-2026

[![Test](https://github.com/msftnutta/GH-100-May-12-2026/actions/workflows/test.yml/badge.svg)](https://github.com/msftnutta/GH-100-May-12-2026/actions/workflows/test.yml)

> **GH-100 Course** – This repository is part of the GH-100 training program demonstrating GitHub workflows, CI/CD, and cloud service integration.

## Overview

A Node.js web application that displays a live world clock with real-time weather information powered by **Azure Maps**. The app shows your local date/time, client IP address, and world clocks with current conditions and a 5-day forecast for cities across multiple time zones.

## How to Use This Web App

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- An Azure Maps account with a valid subscription key

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/msftnutta/GH-100-May-12-2026.git
   cd GH-100-May-12-2026
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example env file and add your Azure Maps key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your `AZURE_MAPS_KEY`.

4. **Start the server**

   ```bash
   npm start
   ```

5. **Open in your browser**

   Navigate to `http://localhost:3000` to view the world clock and weather dashboard.

### Features

- **Local Clock** – Displays your current date and time, updating every second.
- **Client IP Detection** – Shows your public IP address.
- **World Clocks** – Displays live time for Australia, Singapore, Thailand, India, and the United Kingdom.
- **Current Weather** – Shows current temperature and conditions for each city.
- **5-Day Forecast** – Displays a short daily forecast with temperature ranges.
- **Refresh Button** – Manually fetches the latest server time and weather data.

## Azure Maps Integration

This application uses the [Azure Maps Weather Service](https://learn.microsoft.com/azure/azure-maps/weather-services-concepts) to provide weather data.

### How It Works

1. The frontend requests weather data from the Node.js backend (`/api/weather?lat=...&lon=...`).
2. The backend proxies the request to Azure Maps, keeping the subscription key secure on the server side.
3. Two Azure Maps endpoints are called:
   - **Current Conditions** – `GET /weather/currentConditions/json`
   - **Daily Forecast** – `GET /weather/forecast/daily/json` (5-day duration)
4. The server normalizes the response and returns it to the frontend.

### Setting Up Azure Maps

1. Create an [Azure Maps account](https://learn.microsoft.com/azure/azure-maps/how-to-manage-account-keys) in the Azure portal.
2. Copy the **Primary Key** from the Authentication blade.
3. Paste the key into your `.env` file as `AZURE_MAPS_KEY`.
4. Optionally set `AZURE_MAPS_ENDPOINT` if you need a regional endpoint (defaults to `https://atlas.microsoft.com`).

## Running Tests

```bash
npm test
```

Tests use [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) to validate the API endpoints.

## License

See [LICENSE](LICENSE) for details.
