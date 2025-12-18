# Portfolio CMS (Admin Dashboard)

This is the Content Management System (CMS) for the Portfolio Project. It allows authorized users (admins) to add, edit, and delete portfolio content such as Projects, Skills, Services, and Testimonials.

## Features
- **Secure Authentication**: Firebase Authentication for admin login.
- **CRUD Operations**: Full Create, Read, Update, Delete capabilities for all content types.
- **Image Uploads**: Integration with Firebase Storage for uploading project images and icons.
- **Real-time Updates**: Changes are immediately reflected in the database.

## Technologies Used
- React (Vite)
- Tailwind CSS
- Firebase (Auth, Storage)
- React Router DOM
- Helper API Client

## Prerequisites
- Node.js (v14 or higher)
- A Firebase Project.
- The **Backend** server must be running to handle data persistence commands.

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Populate `.env` with your Firebase Project configuration and Backend URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    # ... and other firebase config keys
    ```

## Running the Dashboard

- **Development Mode**:
  ```bash
  npm run dev
  ```
  The CMS will generally run at a different port (e.g., `http://localhost:5174`) to avoid conflict with the Frontend.

## Usage Guide
1.  **Login**: Use your Firebase credentials to log in. (Signup is disabled for security; users must be created in Firebase Console).
2.  **Dashboard**: View an overview of your content counts.
3.  **Manage Content**: Navigate to specific sections (Projects, Skills, etc.) via the sidebar to add or edit items.
4.  **Logout**: Securely sign out when finished.

## Security Note
This CMS is intended for internal usage by the portfolio owner. Ensure your `.env` file is git-ignored and never shared publicly.
