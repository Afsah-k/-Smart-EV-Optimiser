# Smart EV Optimiser

A cloud-based EV charging recommendation app built with React and AWS.

## Features
- Vehicle selector with 15+ EV models
- Real-time nearby charger search
- Battery range and cost calculations
- Interactive Leaflet map with charger pins
- GPS auto-location
- Supports Slow / Fast / Rapid charging

## Tech Stack
- Frontend: React.js (deployed on AWS Amplify)
- Backend: AWS Lambda (Python 3.11)
- API: AWS API Gateway
- Data: Open Charge Map API
- Map: Leaflet + OpenStreetMap
- Geocoding: postcodes.io + Nominatim

## Live Demo
[https://smart-ev-optimiser.amplifyapp.com](https://main.d3bah2m7t3pga7.amplifyapp.com/)

## Architecture
React → API Gateway → Lambda → Open Charge Map API
