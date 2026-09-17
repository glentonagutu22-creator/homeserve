# HomeServe

HomeServe is a full-stack service-booking platform for connecting
customers with professional service providers. The platform currently
focuses on **cleaning, moving, and electrical installation/repair
services** and includes customer booking, addresses, quotations, staff
assignment, payments, notifications, reviews, and administrative
management.

The project is implemented as a **modular monolith**: business domains
are separated into modules inside a single Express backend rather than
being deployed as microservices.

## Table of Contents

- [HomeServe](#homeserve)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Services](#services)
    - [Cleaning](#cleaning)
    - [Moving](#moving)
    - [Electrical](#electrical)
  - [Features](#features)
    - [Customers](#customers)
    - [Staff](#staff)
    - [Administrators](#administrators)
  - [Architecture](#architecture)
  - [Technology Stack](#technology-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Data](#data)
    - [Integrations](#integrations)
  - [Repository Structure](#repository-structure)
  - [Application Routes](#application-routes)
    - [Public](#public)
    - [Customer](#customer)
    - [Staff](#staff-1)
    - [Admin](#admin)
  - [Backend Architecture](#backend-architecture)
  - [Authentication and Authorization](#authentication-and-authorization)
    - [Google Authentication](#google-authentication)
  - [Booking System](#booking-system)
    - [Instant Booking](#instant-booking)
    - [Quote Request](#quote-request)
    - [Booking Cancellation](#booking-cancellation)
  - [Pricing and Quotes](#pricing-and-quotes)
  - [Address Management](#address-management)
  - [Staff Management](#staff-management)
  - [Payments](#payments)
  - [Notifications](#notifications)
  - [Email and SMS](#email-and-sms)
    - [Email](#email)
    - [SMS](#sms)
  - [Real-Time Communication](#real-time-communication)
  - [Database](#database)
    - [Neon Migration](#neon-migration)
  - [Frontend](#frontend-1)
    - [Branding](#branding)
  - [Security](#security)
  - [Environment Variables](#environment-variables)
  - [Local Development](#local-development)
    - [Backend](#backend-1)
    - [Frontend](#frontend-2)
  - [Database Development](#database-development)
  - [Backend Scripts](#backend-scripts)
  - [API Health Check](#api-health-check)
  - [Deployment](#deployment)
  - [Current Status](#current-status)
    - [Backend](#backend-2)
    - [Frontend](#frontend-3)
    - [Infrastructure](#infrastructure)
    - [Production Preparation](#production-preparation)
  - [Future Enhancements](#future-enhancements)
  - [Project Goals](#project-goals)
    - [Real-world service platform](#real-world-service-platform)
    - [Modular backend](#modular-backend)
    - [Backend authority](#backend-authority)
    - [Production readiness](#production-readiness)
    - [Extensibility](#extensibility)
    - [Maintainability](#maintainability)
  - [Design Philosophy](#design-philosophy)
  - [License](#license)
  - [Project Stack](#project-stack)

## Overview

HomeServe provides customers with a complete service-booking workflow:

1.  Browse services.
2.  Select a service.
3.  Manage saved addresses.
4.  Submit service-specific requirements.
5.  Receive server-calculated pricing where applicable.
6.  Request quotations for services requiring assessment.
7.  View, manage, and cancel eligible bookings.
8.  Accept or reject quotations.
9.  Track payments.
10. Receive in-app, email, and SMS notifications.
11. View assigned staff information.
12. Manage their profile and account settings.
13. Review completed services.

Administrators manage customers, staff, services, pricing, bookings,
payments, quotations, reports, and system settings. Staff have their own
assignment, availability, schedule, profile, and service-status
workflows.

## Services

### Cleaning

-   Home Cleaning
-   Deep Cleaning
-   Move-In Cleaning
-   Move-Out Cleaning
-   Office Cleaning
-   Post-Construction Cleaning

Cleaning requests can capture requirements such as bedrooms, bathrooms,
property size, and additional requirements. Services may be
calculated-price or quotation-based.

### Moving

-   House Moving
-   Local Transportation
-   Office Moving
-   Packing and Moving
-   Single-Item Moving

Moving requests contain information required to process the move and
determine the applicable pricing or quotation workflow.

### Electrical

The electrical domain covers services such as:

-   Electrical Fault Diagnosis
-   Electrical Inspection
-   Electrical Installation
-   Electrical/wiring installation and repair

Electrical services can use fixed pricing or quotation workflows.

## Features

### Customers

-   Registration and login
-   Google authentication
-   JWT authentication
-   HTTP-only authentication cookies
-   Role-aware navigation
-   Customer dashboard
-   Customer profile management
-   Kenyan phone-number validation
-   Saved addresses
-   Service browsing
-   Cleaning bookings
-   Moving bookings
-   Electrical bookings
-   Server-side pricing
-   Instant bookings
-   Quote-request bookings
-   Booking history
-   Booking details
-   Booking cancellation
-   Quote management
-   Quote acceptance/rejection
-   Payment status
-   In-app notifications
-   Real-time notifications
-   Reviews
-   Account settings

### Staff

-   Staff profiles
-   Qualifications
-   Availability
-   Staff status
-   Booking assignments
-   Assignment/unassignment
-   Schedule
-   Staff dashboard
-   Booking details
-   Service-status updates
-   Profile/settings

### Administrators

-   Admin dashboard
-   Customer management
-   Staff management
-   Service catalog management
-   Pricing management
-   Booking management
-   Payment management
-   Quote management
-   Reports
-   System settings
-   Administrative notifications

## Architecture

``` text
                         Next.js Frontend
                                |
                              REST
                                |
                                v
                         Express Backend
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
      Auth              Business Domains          Operations
                            |                    Users / Staff
                 +----------+----------+        Quotes / Pricing
                 |          |          |        Payments / Reviews
             Cleaning     Moving    Electrical  Notifications
                 |          |          |        Settings
                 +----------+----------+
                            |
                            v
                         Prisma 7
                            |
                            v
                     Neon PostgreSQL
```

External integrations:

``` text
Express Backend
   |
   +-- Neon PostgreSQL
   +-- Google Identity Services
   +-- Resend
   +-- Infobip
   +-- Socket.IO
```

## Technology Stack

### Frontend

-   Next.js 16
-   React
-   TypeScript
-   App Router
-   Tailwind CSS
-   shadcn/ui
-   Lucide React
-   Socket.IO Client

### Backend

-   Node.js
-   Express
-   TypeScript
-   REST API
-   Socket.IO
-   JWT
-   bcryptjs
-   Google Identity Services
-   Axios
-   cookie-parser

### Data

-   PostgreSQL
-   Neon PostgreSQL
-   Prisma 7
-   `@prisma/adapter-pg`
-   `pg`

### Integrations

-   Google Identity Services
-   Resend email
-   Infobip SMS
-   Socket.IO

## Repository Structure

``` text
service-platform/
|
+-- backend/
|   +-- prisma/
|   |   +-- schema.prisma
|   |   +-- migrations/
|   |   +-- seed.ts
|   |
|   +-- src/
|       +-- config/
|       +-- middleware/
|       +-- modules/
|       |   +-- auth/
|       |   +-- cleaning/
|       |   +-- moving/
|       |   +-- electrical/
|       |   +-- bookings/
|       |   +-- quotes/
|       |   +-- pricing/
|       |   +-- users/
|       |   +-- staff/
|       |   +-- notifications/
|       |   +-- reviews/
|       |   +-- payments/
|       |   +-- settings/
|       |
|       +-- utils/
|       +-- app.ts
|       +-- server.ts
|
+-- frontend/
|   +-- app/
|   +-- components/
|   +-- lib/
|   +-- public/
|   |   +-- images/
|   +-- types/
|
+-- .gitignore
+-- README.md
```

## Application Routes

### Public

``` text
/
/services
/services/cleaning
/services/moving
/services/electrical
/about
/contact
/faq
/pricing
/login
/register
```

### Customer

``` text
/dashboard
/dashboard/bookings
/dashboard/profile
/dashboard/settings
/book/cleaning
/book/moving
/book/electrical
/checkout
/addresses
/bookings
/bookings/:id
/quotes
/quotes/:id
```

### Staff

``` text
/staff
/staff/bookings
/staff/bookings/:id
/staff/schedule
/staff/profile
/staff/settings
```

### Admin

``` text
/admin
/admin/bookings
/admin/customers
/admin/staff
/admin/staff/:id
/admin/services
/admin/pricing
/admin/payments
/admin/reports
/admin/settings
/admin/quotes
/admin/quotes/:id
```

## Backend Architecture

The backend follows a strict flow:

``` text
Request
  -> Route
  -> Validator
  -> Controller
  -> Service
  -> Prisma / External API
```

Routes define endpoints and middleware. Validators handle input
validation. Controllers handle HTTP concerns only. Services contain
business rules and coordinate database and external operations.

The backend uses centralized error handling and an async request wrapper
rather than repeating try/catch logic throughout controllers.

There is intentionally no generic backend `services` business module.
Cleaning, moving, and electrical are independent domains. The Prisma
`Service` model represents the service catalog and configuration used by
those domains.

## Authentication and Authorization

Authentication uses JWTs stored primarily in HTTP-only cookies.
Bearer-token fallback is also supported.

JWT payload:

``` json
{
  "userId": "user-id",
  "role": "CUSTOMER"
}
```

Authorization is enforced through authentication and role middleware.

Supported roles include:

``` text
CUSTOMER
STAFF
ADMIN
```

When a user's role changes, the user should log out and log back in so a
new JWT containing the new role is issued.

### Google Authentication

Google Identity Services provides a Google credential to the frontend.
The frontend sends the credential to:

``` text
POST /api/auth/google
```

The backend verifies the ID token against the configured Google client
ID, checks that the email is verified, finds or creates the user, and
issues a HomeServe JWT.

The current implementation is credential-based rather than a traditional
backend redirect callback flow.

## Booking System

Bookings contain:

-   Customer
-   Service
-   Address
-   Service category
-   Booking type
-   Scheduled date
-   Scheduled time
-   Notes
-   Amount
-   Status
-   Category-specific request
-   Payment
-   Quote
-   Staff assignment
-   Review

Important business rules are enforced by the backend. The frontend does
not determine the authoritative final price.

### Instant Booking

Used for fixed and calculated services:

``` text
Customer requirements
        |
        v
Server-side pricing
        |
        v
Booking created
        |
        v
Notifications
```

### Quote Request

Used for services requiring assessment:

``` text
Customer requirements
        |
        v
Booking created
        |
        v
Quote generated
        |
        v
Admin review
        |
        v
Quote sent
        |
        v
Customer accepts/rejects
```

### Booking Cancellation

Eligible bookings can be cancelled through the backend, which updates
the booking state and triggers the relevant notification workflow.

## Pricing and Quotes

Services can use:

``` text
FIXED
CALCULATED
QUOTE
```

The frontend maps these to the appropriate booking experience:

``` text
FIXED       -> Instant booking
CALCULATED  -> Instant booking with calculation
QUOTE       -> Quote request
```

Pricing rules are stored in PostgreSQL and calculated server-side.

Quote states include:

``` text
PENDING
SENT
ACCEPTED
REJECTED
EXPIRED
```

Accepting a quote confirms the associated booking and triggers the
relevant customer and administrative notifications.

## Address Management

Customers can create, view, update, and delete saved addresses.

Backend endpoints:

``` text
POST   /api/addresses
GET    /api/addresses
GET    /api/addresses/:id
PATCH  /api/addresses/:id
DELETE /api/addresses/:id
```

Addresses are user-scoped. Deletion is prevented when an address is
required by existing booking relationships.

Booking forms preserve the selected service when customers navigate to
address management and return to the booking flow.

## Staff Management

The staff domain supports:

-   Staff creation
-   Staff listing
-   Staff details
-   Staff profiles
-   Qualifications
-   Availability
-   Status
-   Assignments
-   Unassignments
-   Scheduling
-   Staff self-service

Assignment validation checks relevant constraints including
qualification, availability, duplicate assignments, and same-day
conflicts.

Assignment can transition a booking into an assigned state. Removing the
last active assignment can return an appropriate booking to confirmed
status.

Staff service-status updates can trigger customer notifications.

## Payments

Supported payment methods:

``` text
MPESA
CARD
CASH
```

Payment statuses:

``` text
PENDING
COMPLETED
FAILED
REFUNDED
```

The payment domain is structured so payment-provider integrations can be
implemented without placing payment business logic directly inside
booking controllers.

## Notifications

The notification module is centralized and supports:

-   In-app notifications
-   Real-time Socket.IO notifications
-   Email
-   SMS

Notification events include:

-   Welcome
-   Booking created
-   Booking confirmed
-   Booking cancelled
-   Staff assigned
-   Staff unassigned
-   Booking started
-   Booking completed
-   Quote requested
-   Quote sent
-   Quote accepted
-   Quote rejected
-   Quote expired
-   Payment completed
-   Payment failed

External email and SMS delivery is best-effort so an external delivery
failure does not unnecessarily break the underlying business operation.

## Email and SMS

### Email

Email is implemented with Resend.

Supported email notifications include:

-   Welcome
-   Booking created
-   Booking confirmed
-   Booking cancelled
-   Staff assigned
-   Job completed
-   Quote sent
-   Quote accepted
-   Quote rejected
-   Quote expired
-   Payment completed
-   Payment failed

For production, a verified sending domain should be configured.

### SMS

SMS is implemented through Infobip.

Supported SMS notifications include:

-   Booking created
-   Booking confirmed
-   Booking cancelled
-   Staff assigned
-   Job started
-   Job completed
-   Quote sent
-   Quote accepted
-   Quote rejected
-   Quote expired
-   Payment completed
-   Payment failed

Infobip demo/testing accounts can restrict destinations. Production
sender configuration is therefore required for unrestricted production
delivery.

## Real-Time Communication

Socket.IO is initialized alongside the Express server.

The notification flow is:

``` text
Business event
      |
      v
Notification created
      |
      v
Socket.IO emission
      |
      v
Authenticated frontend client
      |
      v
Notification UI update
```

## Database

HomeServe uses PostgreSQL with Neon as the cloud database.

The main database models are:

``` text
User
Address
Service
Booking
CleaningRequest
MovingRequest
ElectricalRequest
Quote
Payment
PricingRule
StaffProfile
StaffAssignment
Notification
Review
SystemSetting
UserSetting
_prisma_migrations
```

The current migrated development database contains:

-   6 users
-   18 services
-   24 bookings
-   10 pricing rules
-   7 Prisma migrations

These values describe the current database state and will change as the
system is used.

### Neon Migration

The original local PostgreSQL database was migrated to Neon by:

1.  Creating a PostgreSQL backup.
2.  Creating the Neon project.
3.  Establishing a secure connection.
4.  Restoring the HomeServe database.
5.  Verifying all application tables.
6.  Verifying Prisma migration history.
7.  Introspecting the database with Prisma.
8.  Generating Prisma Client.
9.  Building the backend.
10. Running Express against Neon.
11. Verifying the API health endpoint.

The backend now uses the Neon PostgreSQL database through
`DATABASE_URL`.

## Frontend

The frontend uses Next.js App Router and is responsible for:

-   Public pages
-   Service pages
-   Authentication UI
-   Customer dashboard
-   Booking flows
-   Address management
-   Quotes
-   Staff dashboard
-   Admin dashboard
-   Notifications
-   Responsive navigation
-   Account settings

The API helper is located at:

``` text
frontend/lib/api.ts
```

API requests include credentials so the authentication cookie can be
used.

`AuthProvider` is the single frontend authentication source.

### Branding

HomeServe uses a professional service-platform visual system based
around:

``` text
Navy: #061F35
Dark blue: #082B49
Blue: general/cleaning accents
Green: moving accents
Amber: electrical accents
```

Static images are stored under:

``` text
frontend/public/images
```

The interface is responsive across desktop and mobile screens.

## Security

Security measures include:

-   HTTP-only authentication cookies
-   JWT authentication
-   Role-based authorization
-   bcrypt password hashing
-   Server-side input validation
-   Server-side authoritative pricing
-   User-scoped resources
-   Centralized error handling
-   CORS configuration
-   Environment-based secrets
-   No credentials in source code

The following must never be committed to Git:

``` text
.env
.env.local
DATABASE_URL
JWT_SECRET
GOOGLE_CLIENT_SECRET
RESEND_API_KEY
INFOBIP_API_KEY
```

Database backups such as:

``` text
*.dump
*.sql
*.backup
```

should also remain outside the repository unless there is an intentional
secure storage strategy.

## Environment Variables

Backend configuration is similar to:

``` env
PORT=5001
DATABASE_URL=your_neon_database_url
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_sender
INFOBIP_BASE_URL=https://api.infobip.com
INFOBIP_API_KEY=your_infobip_api_key
INFOBIP_SENDER=ServiceSMS
```

Frontend configuration:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Real secrets belong in local environment files or the deployment
platform's secret/environment-variable manager.

## Local Development

### Backend

``` bash
cd backend
npm install
npm run dev
```

Backend:

``` text
http://localhost:5001
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

## Database Development

Generate Prisma Client:

``` bash
npx prisma generate
```

Inspect an existing database:

``` bash
npx prisma db pull
```

Create/apply development migrations when appropriate:

``` bash
npx prisma migrate dev
```

The production Neon database should never be reset casually.

Avoid running destructive commands such as:

``` bash
npx prisma migrate reset
```

against the production database.

## Backend Scripts

Development:

``` bash
npm run dev
```

Build:

``` bash
npm run build
```

Production start:

``` bash
npm start
```

## API Health Check

The backend provides:

``` text
GET /api/health
```

Expected response:

``` json
{
  "success": true,
  "message": "Service Platform API is running"
}
```

## Deployment

The intended production architecture is:

``` text
Internet
   |
   v
Next.js Frontend
   |
   | REST
   v
Express Backend
   |
   +---- Neon PostgreSQL
   +---- Resend
   +---- Infobip
   +---- Google Identity Services
   +---- Socket.IO
```

Frontend and backend can be deployed independently while communicating
through the configured API URL.

Production environment variables should be configured in the hosting
provider.

The frontend should use a production API URL such as:

``` env
NEXT_PUBLIC_API_URL=https://your-api-domain/api
```

The backend should use the production Neon connection string and
production frontend URL.

Google authentication must have the production frontend origin
configured.

For production email delivery, a verified domain should be used with
Resend.

For production SMS, the appropriate Infobip sender and destination
configuration should be used.

## Current Status

### Backend

Completed:

-   Modular Express backend
-   TypeScript
-   PostgreSQL
-   Prisma 7
-   Authentication
-   JWT
-   HTTP-only cookies
-   Role-based authorization
-   Google authentication
-   Cleaning domain
-   Moving domain
-   Electrical domain
-   Booking domain
-   Server-side pricing
-   Address domain
-   Quote domain
-   Staff domain
-   Notification domain
-   Email infrastructure
-   SMS infrastructure
-   Payment domain
-   Review domain
-   Settings
-   Centralized error handling
-   Async request handling
-   Socket.IO

### Frontend

Completed:

-   Next.js App Router
-   Public pages
-   Cleaning pages
-   Moving pages
-   Electrical pages
-   Login
-   Registration
-   Google login
-   Authentication-aware navigation
-   Customer dashboard
-   Customer profile
-   Address management
-   Cleaning booking flow
-   Moving booking flow
-   Electrical booking flow
-   Booking list
-   Booking details
-   Booking cancellation
-   Quote list
-   Quote details
-   Quote acceptance/rejection
-   Staff dashboard
-   Staff bookings
-   Staff schedule
-   Staff profile
-   Staff settings
-   Admin management interfaces
-   Notifications UI
-   Responsive navigation
-   HomeServe branding

### Infrastructure

Completed:

-   Local PostgreSQL development
-   PostgreSQL backup
-   Neon project
-   Database migration to Neon
-   Schema verification
-   Data verification
-   Prisma introspection
-   Prisma Client generation
-   Backend build
-   Express connection to Neon
-   API health verification
-   Resend email integration
-   Infobip SMS integration
-   Socket.IO integration

### Production Preparation

Remaining deployment-oriented work includes:

-   GitHub repository
-   Production frontend deployment
-   Production backend deployment
-   Production environment variables
-   Production Google origin configuration
-   Verified email domain
-   Production SMS sender configuration
-   Production payment integration
-   Automated testing
-   CI/CD
-   Production logging
-   Monitoring
-   Backups and recovery procedures
-   API documentation
-   Rate limiting and additional hardening

## Future Enhancements

Potential future features include:

-   Full M-Pesa integration
-   Card payment integration
-   Automated booking reminders
-   Automated quote-expiry jobs
-   Advanced staff calendar
-   Improved availability management
-   Customer support functionality
-   Service-provider onboarding
-   Quote-request image/document uploads
-   Advanced reports and analytics
-   Review moderation
-   Search and filtering
-   Automated tests
-   API documentation
-   Rate limiting
-   Observability and monitoring
-   CI/CD
-   Automated database backups
-   Additional service categories

## Project Goals

HomeServe is designed around the following principles:

### Real-world service platform

Provide a practical system for booking professional services.

### Modular backend

Keep cleaning, moving, electrical, bookings, quotes, staff, payments,
notifications, and other business domains logically separated while
keeping deployment simple through a modular monolith.

### Backend authority

Critical rules such as pricing, authorization, availability, booking
state transitions, and quote processing are enforced by the backend.

### Production readiness

Use cloud PostgreSQL, external transactional services, secure
environment variables, and deployable frontend/backend applications.

### Extensibility

Make it possible to add additional service categories and integrations
without restructuring the entire application.

### Maintainability

Keep routes, validators, controllers, services, database access, and
infrastructure responsibilities clearly separated.

## Design Philosophy

-   **Backend authority** --- important business rules are enforced
    server-side.
-   **Domain separation** --- business domains remain modular.
-   **Single responsibility** --- each backend layer has a defined
    responsibility.
-   **Security by default** --- credentials remain outside source
    control and authentication uses secure cookies.
-   **Real integrations** --- external services are implemented through
    dedicated infrastructure.
-   **Responsive UX** --- customer, staff, and admin workflows are
    separated by role.
-   **Incremental development** --- completed milestones are verified
    before being considered complete.

## License

HomeServe is currently a private development project. Licensing terms
can be added when the project is released publicly.

## Project Stack

Next.js
React
TypeScript
Node.js
Express
Prisma 7
PostgreSQL
Neon
Socket.IO
Google Identity Services
Resend
Infobip

