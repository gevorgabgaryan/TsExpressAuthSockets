# TsExpressAuthSocket

This project, `TsExpressAuthSocket`, is an Express-based application utilizing TypeScript for robust server-side development. It implements authentication, database interactions, and real-time communication.

## Features

- **Authentication**: Secure handling of user authentication processes.
- **Database Operations**: Using TypeORM for database interactions.
- **Real-time Communication**: Integrated WebSocket for real-time client-server communication.



## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Dependencies

- Node.js
- Express
- TypeScript
- Postgres
- TypeORM

### Installing
- Clone the repository: `git clone https://github.com/gevorgabgaryan/TsExpressAuthSockets `
- Change directory to the project folder: `cd NodeJS-Chat-Server`
- Copy the sample environment  .env.prof  file to .env: `cp .env.prod .env`


### Building and Running the Application

   1. Build and start the application with Docker Compose: `docker-compose up --build -d`

   2. The application will be running on
      -  http://localhost
      -  ws://localhost/ws

### Testing

- Execute tests using: `npm test`

### Contact
   For any inquiries, please contact Gevorg
   at gevorg.gak@gmail.com