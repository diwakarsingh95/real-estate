# Real Estate

> Frontend: React + Vite + TypeScript + Firebase + Redux + TailwindCSS
> 
> Backend: Node + TypeScript + Express + MongoDB

## How to run:

Prerequisites: **Node** >= 20, **Yarn** >= 1.22

## Backend:

- Go to **backend** directory.
- Create `.env` file and add following ennvironment variables:
  
  ```
  PORT (default: 3000)
  MONGO_URI
  JWT_SECRET
  ```
- Run `yarn` to install dependencies.
- Run `yarn dev` to start the development server.
- To create production build, run `yarn build`.
- Run `yarn start` to start the production server.

## Client:

- Go to **client** directory.
- Create `.env` file and add following ennvironment variables:

  ```
  VITE_BACKEND_URL (default: http://localhost:3000/)
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
  ```

- Run `yarn` to install dependencies.
- Run `yarn dev` to start the development server.
- To create build, run `yarn build`.
- Run `yarn start` to preview the production build.
