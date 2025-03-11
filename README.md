# Cafe Hop Backend

A NestJS backend application for Cafe Hop platform with Google OAuth and Phone OTP authentication.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Twilio Account (for OTP)
- Google OAuth Credentials

## Environment Setup

1. Clone the repository
```bash
git clone <repository-url>
cd cafe-hop-be
```

2. Copy the example environment file
```bash
cp .env.example .env
```

3. Update the `.env` file with your credentials:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# JWT
JWT_SECRET=your_jwt_secret

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cafe_hop
```

## Database Setup

### Using Docker (Recommended)

1. Start the database:
```bash
docker-compose up -d
```

2. Stop the database:
```bash
docker-compose down
```

### Database Migrations

Create a new migration:
```bash
npx mikro-orm migration:create
```

Apply migrations:
```bash
npx mikro-orm migration:up
```

Revert last migration:
```bash
npx mikro-orm migration:down
```

## Installation

Install dependencies:
```bash
npm install
```

## Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Authentication Endpoints

### Google OAuth

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback

### Phone OTP

- `POST /otp/request` - Request OTP
  ```json
  {
    "phone": "5551234567"
  }
  ```

- `POST /otp/verify` - Verify OTP
  ```json
  {
    "phone": "5551234567",
    "code": "123456"
  }
  ```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

Build the image:
```bash
docker build -t cafe-hop-be .
```

Run the container:
```bash
docker run -p 3000:3000 cafe-hop-be
```

## Development

### Database Management

View current schema:
```bash
npx mikro-orm schema:update --dump
```

Drop schema (careful!):
```bash
npx mikro-orm schema:drop
```

### Useful Commands

Generate a new resource:
```bash
nest generate resource
```

Generate a new migration:
```bash
npx mikro-orm migration:create
```

## Troubleshooting

1. If migrations fail:
   ```bash
   # Drop schema and recreate
   npx mikro-orm schema:drop
   npx mikro-orm migration:up
   ```

2. If Docker container won't start:
   ```bash
   # Remove containers and volumes
   docker-compose down -v
   docker-compose up -d
   ```

## License

[MIT licensed](LICENSE)
```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

docker-compose up


