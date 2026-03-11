# myDevices (Objective 7 Final Project)

myDevices is an Angular + Tailwind CRUD web app for the public API endpoint:

`https://api.restful-api.dev/objects`

## Implemented Requirements

- Multi-page Angular app with routing
- Required routes/pages:
  - Home/Dashboard
  - Objects List
  - Object Details
  - Create Object
  - Edit Object
  - Login/Register + Account area
  - 404 Not Found
- Full CRUD service methods with `HttpClient`
  - GET list
  - GET single
  - POST create
  - PUT update (full)
  - PATCH update (partial)
  - DELETE remove
- Loading and error states on API pages
- Validation form for create/edit:
  - Name: required, min length 3
  - Data fields: color (required), price (required, min 0), year (optional)
  - Submit disabled while invalid/submitting
- List page includes filtering, sorting, pagination, and View/Edit/Delete actions
- Detail page safely handles flexible/null `data`
- Tailwind utilities used throughout key pages
- Simple login/account flow with route protection

## Project Structure

- `src/app/features/objects` - list/detail/create/edit pages
- `src/app/features/auth` - login/register
- `src/app/features/account` - account page
- `src/app/features/not-found` - 404 page
- `src/app/shared` - reusable shared components
- `src/app/core/services` - API and auth services

## Run Front End

1. Install dependencies:

```bash
npm install
```

2. Start Angular dev server:

```bash
npm start
```

3. Open the app at the local URL printed by Angular (usually `http://localhost:4200`).

## Optional Local Backend (User Accounts + Saved Items)

A small backend with a JSON-file database is included to satisfy the final-project backend requirement:

- Backend file: `backend/server.mjs`
- Database file: `backend/data/db.json`

Start backend:

```bash
npm run backend:start
```

Health check:

- `GET http://localhost:3001/api/health`

Example endpoints:

- `POST /api/register`
- `POST /api/login`
- `GET /api/users/:userId/saved-items`
- `POST /api/users/:userId/saved-items`
- `DELETE /api/users/:userId/saved-items/:objectId`

## Test Account (Front End Mock Auth)

- Email: `admin@mydevices.app`
- Password: `Admin123!`

## Notes

- The app uses modern standalone Angular components and current tooling.
- If your environment has Node build issues, use Node `20.x` (see `.nvmrc` and `engines`).
