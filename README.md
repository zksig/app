# ZKsig application

This is the web application for zksig made with next.js.

## Getting Started

### Dependencies

- docker [homebrew install](https://formulae.brew.sh/formula/docker)
- docker compose [homebrew install](https://formulae.brew.sh/formula/docker-compose)

### Startup

Use `docker-compose up` to start the application. This will:

- start postgres
- start pgadmin on port 8000
- start the application on port 3000

#### pgadmin

You can use pgadmin to explore the database. Open [http://localhost:8000](http://localhost:8000).
Login with:

- **Email** dev@zksig.io
- **Password** d3vzk5!9

The database password is `postgres`

### Developer Accounts

Use the following application login:

- **Email** dev@zksig.io
- **Password** d3vzk5!9

This will give you access to preloaded data.
