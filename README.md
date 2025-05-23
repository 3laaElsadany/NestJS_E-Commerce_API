
# NestJS_E-Commerce_API

## Description

**NestJS_E-Commerce_API** is a backend project that provides a robust and scalable API for an E-Commerce platform built with NestJS, TypeORM and MYSQL.

## 🧰 Tech Stack

- **NestJS** – A progressive Node.js framework
- **TypeORM** – ORM for TypeScript and JavaScript
- **MYSQL** – Relational database
- **JWT** – Authentication

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- MYSQL

### Installation

```bash
git clone https://github.com/3laaElsadany/NestJS_E-Commerce_API.git
cd NestJS_E-Commerce_API
npm install
```

## 📁 Project Structure

```bash
src/
├── categories/          # Category management
├── orders/              # Order handling
├── products/            # Product management
├── reviews/             # Review management
├── users/               # User management
├── utility/             # Shared modules (guards, middlewares, etc.)
├── app.module.ts        # Root module
├── main.ts              # Application entry point
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_TYPE=mysql
DB_HOST=localhost 
DB_PORT=3306
DB_USERNAMEyour_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SYNC=false
DB_LOGGING=false
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_expire_time
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

