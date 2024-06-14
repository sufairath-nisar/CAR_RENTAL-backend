# Car Rental Management System

## Description

The Car Rental Management System is a web application designed to facilitate the rental of cars for clients and streamline the management processes for admins. The system includes two main front-end views: one for clients and one for admins. Clients can browse and order various types of cars, make payments online or via cash by submitting proof. Admins can manage car details, handle orders, and assign each order to staff members. Staff members can view and manage the orders assigned to them by the admin.

## Features

### Client View
- **Browse Cars**: Clients can view different types of cars available for rent.
- **Make Orders**: Clients can place orders for car rentals.
- **Payment Options**: Clients can make payments online or via cash by submitting proof of payment.

### Admin View
- **Manage Cars**: Admins can add, update, or remove car details.
- **Order Management**: Admins can view and change the status of orders.
- **Staff Assignment**: Admins can assign orders to specific staff members.

### Staff View
- **View Orders**: Staff can view the orders assigned to them by the admin.

## Installation

To install and run this project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/sufairath-nisar/CAR_RENTAL-backend.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd car-rental-management-system
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the root of the project and add your environment variables. Example:
    
    ```plaintext
    DATABASE_URL=your_database_url
    SECRET_KEY=your_secret_key
    ```

5. **Start the development server:**

    ```bash
    npm run dev
    ```

## Usage

### Client View
1. **Browse Available Cars**: Navigate to the cars listing page to view available cars.
2. **Place an Order**: Select a car, choose rental dates, and submit the order.
3. **Make Payment**: Choose to pay online or submit proof of cash payment.

### Admin View
1. **Manage Cars**: Add, update, or remove car details in the admin dashboard.
2. **Manage Orders**: View all orders, change their status, and assign them to staff members.

### Staff View
1. **View Assigned Orders**: Staff can log in to view the orders assigned to them and manage these orders.

## Deployment

To deploy the project to Vercel:

1. **Build the project:**

    ```bash
    npm run build
    ```

2. **Deploy to Vercel:**

    ```bash
    vercel
    ```