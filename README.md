# Product Management Dashboard

A modern, high-performance Product Management Dashboard built with Next.js, oRPC, TanStack Query, and Zustand. This application integrates with the DummyJSON API to provide a comprehensive suite of tools for managing products, featuring a professional UI/UX.

## Features

- **Authentication**: Secure login and session persistence using Zustand and DummyJSON auth endpoints.
- **Route Protection**: Next.js App Router-based protection, redirecting unauthenticated users.
- **Product Management**:
  - Comprehensive listing with pagination.
  - Advanced search and filtering (category, price range).
  - Admin tools: Add, Edit, and Delete products using oRPC.
- **Shopping Cart**:
  - Fully responsive cart managed with Zustand.
  - Persistent state (local storage).
  - Add/Remove items and update quantities.
  - Mock checkout flow with success notifications.
- **UI/UX**:
  - Premium design using Shadcn UI and Tailwind CSS.
  - Smooth animations with Framer Motion.
  - Fully responsive for mobile, tablet, and desktop.
  - Clear loading, empty, and error states.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Typed APIs**: oRPC (Typed server procedures)
- **Server State**: TanStack Query (Caching, refetching)
- **Client State**: Zustand (Auth, Cart, Filters)
- **Forms**: React Hook Form + Zod (Validation)
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Language**: TypeScript (Strict mode)

## Architecture Explanation

The project follows a clean separation of concerns:
- **Server Layer**: oRPC procedures in `src/server/orpc.ts` handle API interactions, ensuring type safety between the server and client.
- **State Management**: 
  - **Server State**: TanStack Query manages data fetching, caching, and synchronization with the DummyJSON API.
  - **Client State**: Zustand handles transient and persistent client-side data like authentication sessions and the shopping cart.
- **Components**: UI components are built using Shadcn UI primitives, customized for a professional look and feel. Reusable components like `ProductForm` ensure consistency across the admin section.
- **Route Protection**: The application uses a custom `AuthGuard` and `AdminGuard` component to protect routes based on the authenticated user's state and roles.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd product-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Login Credentials

Use these credentials to test the application:

### Admin Account
- **Username**: `emilys`
- **Password**: `emilyspass`
- **Access**: Full admin privileges (can add, edit, and view products)


## Key Challenges and Solutions

- **Internal Server Error in Admin**: I identified and fixed a 500 status error caused by a mismatch between the client's expectations and the oRPC handler's error catching logic. I improved the `addProduct` procedure with robust error handling and implemented the missing `editProduct` and `deleteProduct` procedures.
- **State Persistence**: Ensuring the authentication session and shopping cart survived page reloads was achieved by integrating Zustand's `persist` middleware.
- **Type Safety**: I converted the `orpcClient` from a type-casted `any` to a fully typed client using the `AppRouter` interface, providing full IntelliSense and compile-time checks.

## Assumptions Made

- **User Roles**: Assumed that users from DummyJSON (like 'emilys') have a `role` property for admin access control.
- **API Persistence**: DummyJSON mock API does not persist data; additions and edits are simulated but return correct response formats.
- **Deployment**: The application is configured for deployment on Vercel.

## Future Improvements

- **Real Image Upload**: Integrate with a cloud storage provider (e.g., Cloudinary) for actual product image uploads.
- **Order History Persistence**: Implement a backend database (e.g., PostgreSQL with Prisma) to store real order history.
- **Dark Mode**: Add a theme switcher for better accessibility and user preference.
- **Optimistic Updates**: Further refine the UI with full optimistic updates for product deletions and edits.
