![Status](https://img.shields.io/badge/Status-Completed-8A2BE2?labelColor=2E2E2E)
![Course](https://img.shields.io/badge/Course-SOFT207%20Angular-8A2BE2?labelColor=2E2E2E)
![Language](https://img.shields.io/badge/Language-TypeScript-8A2BE2?labelColor=2E2E2E)
![Duration](https://img.shields.io/badge/Duration-Objective%207%20Final-8A2BE2?labelColor=2E2E2E)
![Program](https://img.shields.io/badge/Program-Software%20Development%20Pathway-8A2BE2?labelColor=2E2E2E)
![Focus](https://img.shields.io/badge/Focus-Angular%20CRUD%2C%20Validation%2C%20Routing%2C%20Auth-8A2BE2?labelColor=2E2E2E)
![Final Project](https://img.shields.io/badge/Final%20Project-myDevices%20Inventory%20Manager-8A2BE2?labelColor=2E2E2E)
![Interface](https://img.shields.io/badge/Interface-Web%20App-8A2BE2?labelColor=2E2E2E)

# myDevices - Objective 7 Final Project by mp3li

This folder documents completed coursework for the **SOFT207 Angular final project**.  
It is organized as a final-project portfolio artifact that delivers a full Angular CRUD application using the required Public API.

### What This Portfolio Shows:
- End-to-end Angular app delivery for a final objective
- Multi-page routed application architecture
- Full CRUD integration against `https://api.restful-api.dev/objects`
- Reactive forms with validation and disabled invalid submit
- Detail/list/create/edit workflows with loading and error states
- Login/register/account pages with guarded routes
- Optional backend service with JSON database support

--------------------------------------------------

### Table of Contents:
<details>
<summary><em>Open Table of Contents</em></summary>

- [Portfolio Summary](#portfolio-summary)
- [How to Run Projects](#how-to-run-projects)
- [Objective Portfolio (All Objectives)](#objective-portfolio-all-objectives)
  - [Objective 7 - Final Project: Angular CRUD Web App](#objective-7---final-project-angular-crud-web-app)
- [Skills Demonstrated Across the Full Course](#skills-demonstrated-across-the-full-course)
- [Notes](#notes)

</details>

--------------------------------------------------

### Portfolio Summary:
<details>
<summary><em>Open Portfolio Summary</em></summary>

- Course: **SOFT207 Angular**
- Portfolio artifact: **Objective 7 final project folder**
- Required API: `https://api.restful-api.dev/objects`
- Structure:
  - Objective prompt file
  - Final project README
  - Angular app folder (`learning-angular-app-mydevices`)
  - Optional backend + JSON database (`backend/`)
- Final deliverable:
  - A complete Angular CRUD web app with validated forms, list/detail views, routing, error/loading states, and account/auth pages

</details>

--------------------------------------------------

### How to Run Projects:
<details>
<summary><em>Open How to Run Projects</em></summary>

- General: Open terminal in this folder, `cd` into the Angular app folder, install dependencies, then run the app.
- Frontend app (`learning-angular-app-mydevices`):
  - `cd "myDevices - Final Project - Angular CRUD Web App /learning-angular-app-mydevices"`
  - `npm install`
  - `npm start`
- Optional checks:
  - `npm test -- --watch=false`
  - `npx tsc -p tsconfig.app.json --noEmit`
- Optional backend:
  - `npm run backend:start`
  - Health check: `GET http://localhost:3001/api/health`

</details>

--------------------------------------------------

### Objective Portfolio (All Objectives):

#### Objective 7 - Final Project: Angular CRUD Web App
<details>
<summary><em>Open Objective 7 Details</em></summary>

- Objective focus:
  - Build a beginner-friendly end-to-end Angular web app with full CRUD, validated data collection, and clear data presentation.
- Contains:
  - `Objective 7 - Final Project - Angular CRUD Web App .txt`
  - `learning-angular-app-mydevices/` (Angular app)
  - `learning-angular-app-mydevices/backend/` (small backend + JSON db)
- Implementation highlights:
  - Required routes/pages:
    - Home/Dashboard
    - Objects List
    - Object Details
    - Create Object
    - Edit Object
    - Login/Register + Account
    - Not Found (404)
  - API service methods implemented:
    - GET list
    - GET single
    - POST create
    - PUT update
    - PATCH update
    - DELETE remove
  - Form validation implemented:
    - `name` required + minimum length 3
    - data fields include required validated entries (`color`, `price`)
    - submit disabled while invalid or submitting
  - User experience and handling:
    - loading indicators and user-friendly error messages
    - table/list presentation + detail presentation
    - safe handling of null/flexible `data` payloads
- Skills demonstrated:
  - Angular route-driven app structure
  - Public API CRUD integration
  - Form validation and UX feedback
  - Full feature delivery for a final objective

</details>

--------------------------------------------------

### Skills Demonstrated Across the Full Course:
<details>
<summary><em>Open Skills Demonstrated Across the Full Course</em></summary>

- Angular routing and multi-page app organization
- Guarded navigation and account/auth flows
- Reactive forms and validation messaging
- Typed API services and model handling
- CRUD lifecycle implementation (list/details/create/edit/delete)
- Loading/error state management
- Tailwind-based UI implementation
- Documentation and final-project submission packaging

</details>

--------------------------------------------------

### Notes:
<details>
<summary><em>Open Notes</em></summary>

- This folder is organized for final-project review and submission clarity.
- The frontend uses a local mock auth flow for UI/session behavior.
- A separate optional backend implementation is included in:
  - `learning-angular-app-mydevices/backend/`

</details>

--------------------------------------------------
