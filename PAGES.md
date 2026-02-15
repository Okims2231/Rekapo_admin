# Pages

This file describes each app page and its purpose, along with the API endpoints it calls.

## Admin Pages

### [AdminInterface.jsx](src/pages/AdminInterface.jsx)
Admin dashboard with overview stats, charts, and navigation to other admin areas.
- **API Calls:**
  - `GET /admin/statistics` - Get latest statistics

### [AdminLogs.jsx](src/pages/AdminLogs.jsx)
Log monitoring console with stats, recent errors/logs, filters, user log search, and auto refresh.
- **API Calls:**
  - `GET /admin/logs/stats` - Get log statistics
  - `GET /admin/logs/recent` - Get recent logs with optional level filter
  - `GET /admin/logs/errors/recent` - Get recent errors from last N hours
  - `GET /admin/logs/user/{userId}` - Search logs by user ID
  - `GET /admin/logs/user/email/{email}` - Search logs by user email

### [SystemStatistics.jsx](src/pages/SystemStatistics.jsx)
System statistics table with paging and delete actions.
- **API Calls:**
  - `GET /admin/statistics` - Get paginated statistics
  - `DELETE /admin/statistics/{statId}` - Delete a statistics entry

## User Management Pages

### [UserManagement.jsx](src/pages/UserManagement.jsx)
User directory with search, filters, enable/disable, admin role changes, and per-user analytics expansion.
- **API Calls:**
  - `GET /admin/users` - Get paginated users list with search/filter
  - `GET /admin/users/{userId}/analytics` - Get analytics for a specific user
  - `POST /admin/users/{userId}/disable` - Disable user account
  - `POST /admin/users/{userId}/enable` - Enable user account
  - `PATCH /admin/users/{userId}/admin-status` - Update admin status (promote/demote)

### [UserAnalytics.jsx](src/pages/UserAnalytics.jsx)
Aggregated user analytics with sorting, time filters, and account enable/disable actions.
- **API Calls:**
  - `GET /admin/analytics/users` - Get all users analytics with pagination and time period filter
  - `POST /admin/users/{userId}/disable` - Disable user account
  - `POST /admin/users/{userId}/enable` - Enable user account

## Session Pages

### [SessionManagement.jsx](src/pages/SessionManagement.jsx)
Sessions list with search and filters, paging, and delete actions.
- **API Calls:**
  - `GET /admin/sessions` - Get paginated sessions list with optional filters (search, status, training consent, deleted)
  - `DELETE /admin/sessions/{sessionId}` - Delete session with optional reason

### [SessionDetails.jsx](src/pages/SessionDetails.jsx)
Detailed view of a single session, including training data and consent handling.
- **API Calls:**
  - `GET /admin/training-data/sessions/{sessionId}` - Get training data for a session (enforces consent check)

## Authentication Pages

### [Login.jsx](src/pages/Login.jsx)
Admin login screen that initiates Google sign-in and shows auth errors.
- **API Calls:**
  - `GET /admin/auth/login` - Initiate Google OAuth2 login flow

### [AuthCallback.jsx](src/pages/AuthCallback.jsx)
OAuth callback handler that reads token or error from query params and routes to login or the dashboard.
- **API Calls:** None (handles callback from OAuth provider)

## Other Pages

### [Stats.jsx](src/pages/Stats.jsx)
Lightweight stats page using the admin context to query and display basic system metrics.
- **API Calls:** None (uses admin context hook)
