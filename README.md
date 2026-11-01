# AI-Powered IT Service Desk & Ticket Management System

A full-stack, AI-powered ticket management platform designed to streamline customer support operations, improve issue tracking, and simplify support team coordination through intelligent ticket classification and role-based access control.

## Overview

Managing customer support requests through emails, spreadsheets, or disconnected channels often leads to inefficient ticket tracking, delayed issue resolution, poor prioritization, and limited visibility across support teams.

This project addresses these challenges by providing a centralized IT Service Desk platform where customers can raise support tickets, support agents can manage assigned issues, and managers can monitor team-level activities.

The platform also integrates OpenAI to assist users during ticket creation by generating ticket summaries, suggesting appropriate categories and priorities, and providing initial troubleshooting recommendations.

## Key Features

### 1. Authentication & Authorization
- Secure user registration and login using JWT-based authentication.
- Password hashing using bcrypt.
- Role-Based Access Control (RBAC) with granular permission management.
- Protected frontend routes and backend APIs.
- Permission-based access to application features and resources.

### 2. Role-Based Ticket Management

The application supports multiple user roles:

| Role | Responsibilities |
|---|---|
| Admin | Manage users, roles, permissions, and overall ticket visibility. |
| Manager | Monitor and access tickets belonging to assigned teams. |
| Support Agent | View and manage tickets assigned to them. |
| Customer | Create tickets and access their own support requests. |

### 3. Ticket Creation & Management
- Create support tickets with title, description, category, and priority.
- Configurable ticket categories and priority levels.
- Database-driven ticket lookup values.
- Centralized ticket listing interface.
- Role-aware ticket visibility and access restrictions.

### 4. AI-Powered Ticket Creation Assistant

Integrated OpenAI API to reduce manual effort during ticket creation.

**AI capabilities:**
- Generate meaningful ticket summaries from user descriptions.
- Suggest relevant ticket categories.
- Recommend appropriate ticket priorities.
- Generate initial troubleshooting steps.
- Return structured JSON responses using schema-constrained AI output.
- Allow users to review and apply AI suggestions before submitting tickets.

**AI Integration Flow:**

1. User describes the issue.
2. Angular sends the description to the Node.js backend.
3. Backend retrieves valid categories and priorities from PostgreSQL.
4. OpenAI processes the description with the available options.
5. Backend validates the AI-generated response.
6. Suggestions are returned to Angular for user review.
7. User applies the suggestions and submits the ticket through the existing ticket creation workflow.

AI recommendations are advisory only. Final ticket creation and business validation remain controlled by the backend.

### 5. Advanced Ticket Search
- Search tickets using supported filters.
- Filter by status, priority, category, team, and assigned agent.
- Pagination support.
- Role-based data visibility enforced at the backend.

### 6. Modular Backend Architecture
- Repository layer for database operations.
- Service layer for business logic.
- Controller layer for request and response handling.
- Express middleware for authentication, authorization, and request validation.
- Centralized error handling.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular 22, TypeScript, HTML5, CSS3, Bootstrap |
| State Management | Angular Signals, RxJS |
| Forms | Angular Reactive Forms |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 18 |
| Database Management | pgAdmin 4 |
| Authentication | JWT, bcrypt |
| Authorization | Role-Based Access Control (RBAC) |
| AI Integration | OpenAI API |
| API Communication | REST APIs, Angular HttpClient |
| Development Tools | VS Code, Postman, Git, GitHub |

## Application Architecture

The application follows a layered architecture to maintain separation of concerns and improve maintainability.

```text
                    Angular Frontend
                           |
                    Angular Services
                           |
                       REST APIs
                           |
                    Express Router
                           |
                 Authentication Middleware
                           |
                 Permission Middleware
                           |
                    Controllers
                           |
                      Services
                           |
                    Repositories
                           |
                     PostgreSQL
```

**AI Integration:**

```text
Angular Create Ticket Screen
           |
           v
Ticket Service
           |
           v
Node.js AI Controller
           |
           v
AI Service
      /         \
     v           v
PostgreSQL    OpenAI API
 Categories   AI Suggestions
 Priorities        |
     \             /
      \           /
       v         v
       Backend Validation
              |
              v
       Structured Response
              |
              v
       Angular AI Assistant
              |
              v
       User Reviews Suggestions
              |
              v
       Existing Ticket Creation API
```

## Database Design

The PostgreSQL database is designed around relational entities to support authentication, authorization, and ticket management.

Core entities include:

- `users` – Application user information.
- `roles` – Available application roles.
- `permissions` – Granular application permissions.
- `user_roles` – User-to-role mapping.
- `role_permissions` – Role-to-permission mapping.
- `teams` – Support team information.
- `team_members` – Team membership mapping.
- `tickets` – Ticket information and lifecycle data.
- Ticket lookup tables – Categories, priorities, and statuses.

The relational structure supports flexible role assignments and team-based ticket visibility.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js
- npm
- Angular CLI
- PostgreSQL 18
- pgAdmin 4
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Database Setup

1. Create a PostgreSQL database.
2. Execute the database schema scripts.
3. Configure the database connection in the backend environment file.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

Use the actual environment variable names expected by your backend configuration.

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using the required environment variables.

Example configuration:

```env
PORT=8000
NODE_ENV=development

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=your_supported_model
```

Configure your database variables as well.

Start the backend:

```bash
npm run dev
```

### 4. Frontend Setup

Navigate to the Angular frontend directory:

```bash
cd frontend
npm install
```

Configure the backend API URL in the Angular environment configuration.

Start the Angular application:

```bash
ng serve
```

Open the application:

```text
http://localhost:4200
```

*Note: Adjust directory names and npm scripts according to your repository structure.*

## Security Considerations

- Passwords are stored as bcrypt hashes.
- JWT-based authentication protects secured endpoints.
- Backend middleware validates user permissions.
- Ticket visibility is restricted according to user roles and team assignments.
- AI API credentials are maintained on the backend and are not exposed to the Angular application.
- AI-generated values are validated by the backend before being used.

## Future Enhancements

The following improvements are planned:

- Ticket assignment and reassignment workflows.
- Ticket status lifecycle management.
- Ticket comments and conversation history.
- Ticket activity timeline and audit logs.
- Dashboard analytics and reporting.
- AI request timeout and failure handling.
- Duplicate AI request prevention.
- Enhanced AI response validation and reliability.
- Cloud deployment and CI/CD integration.

## Learning Outcomes

This project provides hands-on experience with:

- Building full-stack applications using Angular and Node.js.
- Designing RESTful APIs and modular backend architectures.
- Implementing JWT authentication and granular RBAC.
- Designing relational database schemas using PostgreSQL.
- Working with Angular Signals, RxJS, and Reactive Forms.
- Integrating OpenAI APIs into real-world business workflows.
- Handling structured AI responses and backend validation.
- Implementing role-aware data access and API security.

## Author

**Developed as a full-stack portfolio project** to explore practical software engineering concepts, backend development, secure application architecture, and AI-powered business solutions.

