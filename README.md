# Ride Simulation Frontend

Web application for user signup/login and ride‑hailing simulation.

---

## Features

- User signup & login with email/password validation
- Location input: specify pickup and drop‑off points
- Ride simulation: estimated distance & fare
- Request a driver and track ride status:  
  “Request Driver”, “Driver in Route”, “In Transit”, “Arrived”
- Interactive map (Leaflet + Routing Machine) with user & driver markers
- Ride history: total number of completed rides
- User profile page: email and ride count

---

## Prerequisites

- Node.js ≥ 16.x
- npm ≥ 8.x
- Angular CLI ~14.0.0

```bash
npm install -g @angular/cli@14
```

## Installation & Local Execution
```bash
git clone https://github.com/afonsocadu/ride-simulation-fr
cd ride-simulation-fr
npm install
ng serve 
```

## Tech Stack

- **Angular 14**, **Angular Material**, **SCSS**
- **Leaflet**, **leaflet-routing-machine**, **leaflet-control-geocoder**
- **Axios**, **RxJS**




