# Employee Management System

A simple employee management system built with React, TypeScript, and Vite. This application allows you to login, view, update, and delete employee records.

## Prerequisites

- Node.js (version 16.x or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd EmployeeManagement1
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or with yarn:
   ```
   yarn
   ```

## Running the Application

To start the development server:

```
npm run dev
```

The application will be available at http://localhost:5173

To build for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

## Features

- User authentication (login)
- View list of employees
- Update employee information
- Delete employees

## API

This project uses [ReqRes](https://reqres.in/) as a mock API for demonstration purposes. The API endpoints include:

- `POST /api/login`: User authentication
- `GET /api/users`: Fetch list of users (paginated)
- `PUT /api/users/{id}`: Update user data
- `DELETE /api/users/{id}`: Delete a user

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `api.ts`: API calls and services
  - `types.ts`: TypeScript type definitions
  - `App.tsx`: Main application component
  - `main.tsx`: Entry point

## Technologies Used

- React 18
- TypeScript
- Vite
- React Router
- React Hot Toast for notifications
- TailwindCSS for styling

## Notes and Considerations

- This is a demo application using a mock API. In a production environment, you would need to connect to a real backend service.
- User authentication uses a simple token system. In a real application, you would want to implement proper JWT or OAuth authentication.
- The current implementation does not persist data beyond API calls. Real applications would typically use state management libraries like Redux or React Context API for more complex state management. 