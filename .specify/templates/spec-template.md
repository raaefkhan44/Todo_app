# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  Must comply with constitution: locked tech stack, auth requirements, API contract, etc.
-->

### Functional Requirements

- **FR-001**: System MUST use Next.js 16+ with App Router for frontend
- **FR-002**: System MUST use Python FastAPI for backend API
- **FR-003**: System MUST use SQLModel for database ORM
- **FR-004**: System MUST use Neon Serverless PostgreSQL as database
- **FR-005**: System MUST use Better Auth for authentication
- **FR-006**: System MUST implement JWT-based authentication with shared BETTER_AUTH_SECRET
- **FR-007**: System MUST enforce user isolation - each user can only access their own tasks
- **FR-008**: System MUST implement the specified API contract with exact endpoints:
  - GET /api/{user_id}/tasks (List all tasks)
  - POST /api/{user_id}/tasks (Create task)
  - GET /api/{user_id}/tasks/{id} (Get task)
  - PUT /api/{user_id}/tasks/{id} (Update task)
  - DELETE /api/{user_id}/tasks/{id} (Delete task)
  - PATCH /api/{user_id}/tasks/{id}/complete (Toggle completion)
- **FR-009**: System MUST verify JWT tokens on all backend requests and decode user identity
- **FR-010**: System MUST reject unauthenticated requests with 401 status
- **FR-011**: System MUST store all user data in Neon PostgreSQL with SQLModel schemas
- **FR-012**: System MUST be responsive and work on mobile, tablet, and desktop

### Key Entities *(include if feature involves data)*

- **User**: Represents an authenticated user with unique identifier, username, and email
- **Task**: Represents a todo item that belongs to a user, with title, description, completion status, and timestamps
- **Session**: Represents an authenticated session with JWT token for API authentication

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
