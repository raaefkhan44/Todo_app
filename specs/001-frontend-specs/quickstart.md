# Quickstart Guide: Frontend for Phase II Todo Application

**Date**: 2026-01-13
**Feature**: Frontend Specifications for Phase II Todo Application
**Branch**: 001-frontend-specs

## Overview

This guide provides instructions for setting up, running, and understanding the frontend for the Phase II Todo application.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- A modern web browser for testing

## Setup Instructions

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <repository-root>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_NAME=Todo App
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── page.tsx         # Landing page
│   │   ├── login/page.tsx   # Login page
│   │   ├── signup/page.tsx  # Signup page
│   │   └── dashboard/
│   │       └── page.tsx     # Dashboard page
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication related components
│   │   ├── todos/           # Todo management components
│   │   ├── ui/              # Base UI primitives (buttons, inputs, etc.)
│   │   ├── layout/          # Layout components
│   │   └── theme/           # Theme provider and toggle
│   ├── lib/                 # Utility functions and constants
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API client and auth service
│   └── styles/              # Global styles and theme definitions
├── public/                  # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## Key Features Walkthrough

### 1. Landing Page (`/`)
- Hero section with motion entrance animation
- Features overview section
- Call-to-action buttons for login/signup
- Responsive design for all screen sizes

### 2. Authentication Pages
- **Login Page** (`/login`): Email/password form with loading states and error handling
- **Signup Page** (`/signup`): Registration form with validation feedback

### 3. Dashboard Page (`/dashboard`)
- Todo list with add/edit/delete functionality
- Mark todos as complete/incomplete
- Responsive layout for desktop and mobile
- Empty state when no todos exist

## Running Tests

### Unit Tests
```bash
npm run test
# or
yarn test
```

### End-to-End Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Building for Production

```bash
npm run build
# or
yarn build
```

To run the production build locally:
```bash
npm run start
# or
yarn start
```

## API Integration

The frontend communicates with the backend API through a centralized client located in `src/services/api-client.ts`. All API requests include authentication headers automatically.

## Theming

The application supports both light and dark themes. The theme can be toggled using the theme switcher component and is persisted in browser local storage.

## Accessibility

The application follows WCAG 2.1 AA guidelines:
- Proper semantic HTML structure
- Keyboard navigation support
- Sufficient color contrast ratios
- ARIA attributes where appropriate

## Troubleshooting

### Common Issues
1. **API requests failing**: Ensure backend server is running and URL is correctly configured in environment variables
2. **Authentication not working**: Verify Better Auth configuration and secret keys
3. **Styles not loading**: Check Tailwind configuration and CSS imports

### Development Tips
- Use the Next.js development server for hot reloading during development
- Enable React Developer Tools in your browser for debugging components
- Check browser console for any error messages during development