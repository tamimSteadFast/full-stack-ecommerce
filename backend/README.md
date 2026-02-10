# E-commerce Backend API

This is a complete e-commerce backend API built with Node.js, Express.js, TypeScript, MySQL, and Drizzle ORM.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Authentication:** JWT

## Prerequisites

- Node.js installed
- MySQL Server running

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy `.env.example` to `.env` and update the values.
    ```bash
    cp .env.example .env
    ```
    Make sure your `DATABASE_URL` is correct.

4.  Generate and Push Database Schema:
    ```bash
    npm run db:generate
    npm run db:push
    ```
    *Note: Ensure your MySQL database exists before pushing.*

5.  Run the server:
    ```bash
    npm run dev
    ```

## Scripts

- `npm run dev`: Start the development server with hot reload.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm start`: Run the production server.
- `npm run db:generate`: Generate SQL migrations from Drizzle schema.
- `npm run db:push`: Push schema changes directly to the database.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile

### Products
- `GET /api/products` - List products (pagination, filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/:id/variants` - Get product variants

### Inventory
- `GET /api/inventory/:variantId` - Check stock
- `PUT /api/inventory/:variantId` - Update stock (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments & Shipments
- `POST /api/payments` - Process payment
- `GET /api/payments/:orderId` - Get payment details
- `PUT /api/payments/:id/status` - Update payment status (Admin)
- `GET /api/shipments/:orderId` - Get shipment details
- `POST /api/shipments` - Create shipment (Admin)
- `PUT /api/shipments/:id` - Update shipment/tracking (Admin)
