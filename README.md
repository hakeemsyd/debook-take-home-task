<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# Debook Take Home Task

# User Authentication and Profile Management API

## Author: Hakeem Abbas

## Description

This project is a robust API for user authentication and profile management, built with NestJS, MongoDB, and featuring JWT-based authentication.

## Features

- User registration and login
- JWT-based authentication
- Token refresh mechanism
- User profile management (get and update)
- Swagger API documentation
- Winston logging

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or later)
- MongoDB
- Yarn or npm

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/hakeemsyd/debook-take-home-task.git
   cd debook-take-home-task
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=expire_time
   ```

## Running the Application

```bash
development
$ yarn run start
watch mode
$ yarn run start:dev
production mode
$ yarn run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

http://localhost:3000/api


This provides an interactive interface to explore and test the API endpoints.

## Running Tests

```bash
unit tests
$ yarn run test
e2e tests
$ yarn run test:e2e
test coverage
$ yarn run test:cov
```


## API Endpoints

### Authentication

- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Log in a user
- `POST /auth/refresh-session`: Refresh the user's session

### User Profile

- `GET /users/get`: Get the current user's profile
- `PUT /users/update`: Update the current user's profile

## Authentication Flow

1. **Sign Up**: Use the `/auth/signup` endpoint to create a new user account.
2. **Login**: Use the `/auth/login` endpoint to authenticate and receive access and refresh tokens.
3. **Accessing Protected Routes**: Include the access token in the Authorization header as a Bearer token for protected routes.
4. **Token Refresh**: Use the `/auth/refresh-session` endpoint with the refresh token to obtain a new access token when it expires.

## Error Handling

The API uses standard HTTP status codes for error responses. Detailed error messages are included in the response body.

## Logging

Winston is used for logging. Logs are output to the console and saved in the `logs` directory:
- `logs/error.log`: Contains error-level logs
- `logs/combined.log`: Contains all log levels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---