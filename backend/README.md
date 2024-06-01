# Backend

This is the backend part of our application, built with Node.js, Express, and Sequelize.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AdrianRusan/restaurant_management
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Navigate to the backend directory:

```bash
npm install
```

4. Navigate to the backend directory:

```
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
DB_HOST=your_host
```

5. Run the database migrations:

```bash
npx sequelize-cli db:migrate
```

6. (Optional) Seed the database:
  
```bash
npx sequelize-cli db:seed:all
```

7. Start the server:

```bash
npm start
```

The server will start on http://localhost:4000.

## Project Structure

- `config/`: Contains the configuration for the database.
- `migrations/`: Contains the database migration files.
- `models/`: Contains the Sequelize models for the database.
- `resolvers.js`: Contains the GraphQL resolvers.
- `schema.js`: Contains the GraphQL schema.
- `server.js`: The entry point for the server.
- `index.js`: The main application file.
- `package.json`: Contains the list of npm dependencies.

## Testing

To run the tests:

```bash
npm test
```

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [GraphQL](https://graphql.org/)
