# OpenDX Production Deployment Guide

This directory contains the Docker configuration for deploying the OpenDX application in production.

## Architecture

- **Backend (API)**: FastAPI application running on Python 3.11+, exposed on port 9627
- **Frontend (Web)**: Vue 3 SPA served by nginx, exposed on port 80
- **Reverse Proxy**: External (cloud load balancer or separate nginx instance)
- **Domains**:
  - Frontend: `opendx.clinicalnlp.org`
  - Backend: `opendx-api.clinicalnlp.org`

## Prerequisites

### 1. Docker and Docker Compose

Ensure you have Docker and Docker Compose installed:
```bash
docker --version
docker-compose --version
```

### 2. Environment Files

You must create `.env` files for both the backend and frontend before building.

#### Backend `.env` (`api/.env`)

Create this file in the `api/` directory with the variables in `api/dotenv.tpl` for all available configuration options.

#### Frontend `.env` (`web/.env`)

Create this file in the `web/` directory with the variables in the `web/dotenv.tpl` for reference.

**Important**: The `VITE_API_URL` must point to your production backend domain as these values are baked into the frontend bundle at build time.

## Build and Deploy

**Note**: A `.dockerignore` file in the project root excludes unnecessary files (node_modules, cache files, etc.) from the Docker build context for faster and cleaner builds.

### 1. Navigate to the production configuration directory

```bash
cd conf/prod
```

### 2. Build the Docker images

```bash
docker-compose build
```

This will:
- Build the backend API container from `dockerfile.api`
- Build the frontend web container from `dockerfile.web`
- Automatically exclude files listed in `.dockerignore` (node_modules, build outputs, etc.)

### 3. Start the services

```bash
docker-compose up -d
```

This starts both services in detached mode.

### 4. Verify the deployment

Check that both services are running:

```bash
docker-compose ps
```

View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

## Security Notes

- Both containers run as non-root users
- The API container uses a multi-stage build to minimize image size and attack surface
- Security headers are configured in the nginx configuration
- Ensure `.env` files are not committed to version control (already in `.gitignore`)

## Support

For issues or questions, refer to the main project repository.
