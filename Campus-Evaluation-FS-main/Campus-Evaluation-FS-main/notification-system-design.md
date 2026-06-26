# Notification System Design
# Stage 1

## Problem Statement

Design a notification platform that allows students to receive Placement, Result and Event notifications in real time.

---

## Architecture

Frontend (React)

↓

Notification Service (REST API)

↓

Database

↓

Real-time Notification Service (WebSocket / Server Sent Events)

---

## Notification Object

```json
{
  "id": "uuid",
  "studentId": 1042,
  "type": "Placement",
  "message": "Microsoft is hiring.",
  "isRead": false,
  "createdAt": "2026-04-22T17:50:00Z"
}
```

---

## REST APIs

### Get Notifications

GET /notifications

Query Parameters

- page
- limit
- notification_type

Response

```json
{
    "notifications":[]
}
```

---

### Mark Notification Read

PATCH /notifications/{id}

```json
{
    "isRead": true
}
```

---

### Delete Notification

DELETE /notifications/{id}

---

### Create Notification

POST /notifications

```json
{
    "studentId":1042,
    "type":"Placement",
    "message":"Microsoft Hiring"
}
```

---

## Status Codes

200 OK

201 Created

400 Bad Request

404 Not Found

500 Internal Server Error

---

## Real Time Notifications

Whenever HR publishes a notification

↓

Notification Service

↓

Database

↓

WebSocket

↓

Frontend instantly receives the notification.

---

## Folder Structure

notification-app-fe

src

api

components

pages

hooks

services

utils

---

## Error Handling

Invalid request

↓

Return proper HTTP status

↓

Log using Logging Middleware

↓

Display friendly error message

---

## Security

JWT Authorization

HTTPS

Input Validation

Rate Limiting



# Stage 2

## Database Selection

I recommend **PostgreSQL** as the primary database because:

- ACID compliance ensures reliable transactions.
- Excellent indexing support.
- Supports JSON/JSONB for flexible metadata.
- Handles millions of records efficiently.
- Powerful query optimizer.
- Supports partitioning for very large datasets.

---

## Database Schema

### Table: Students

| Column | Type |
|---------|------|
| student_id | BIGINT PRIMARY KEY |
| name | VARCHAR(100) |
| email | VARCHAR(150) |

---

### Table: Notifications

| Column | Type |
|---------|------|
| id | UUID PRIMARY KEY |
| student_id | BIGINT |
| notification_type | VARCHAR(30) |
| message | TEXT |
| is_read | BOOLEAN DEFAULT FALSE |
| created_at | TIMESTAMP |

---

## Relationship

One Student

↓

Many Notifications

(One-to-Many Relationship)

---

## SQL Schema

```sql
CREATE TABLE notifications (

id UUID PRIMARY KEY,

student_id BIGINT NOT NULL,

notification_type VARCHAR(30) NOT NULL,

message TEXT NOT NULL,

is_read BOOLEAN DEFAULT FALSE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
```

---

## Indexes

```sql
CREATE INDEX idx_student
ON notifications(student_id);

CREATE INDEX idx_notification_type
ON notifications(notification_type);

CREATE INDEX idx_created_at
ON notifications(created_at);

CREATE INDEX idx_student_read
ON notifications(student_id,is_read);
```

---

## Handling Large Volume

For millions of notifications:

- Use Pagination.
- Create Composite Indexes.
- Archive old notifications.
- Use Database Partitioning.
- Store only recent notifications in hot storage.
- Compress historical data.

---

## Pagination Query

```sql
SELECT *

FROM notifications

WHERE student_id=1042

ORDER BY created_at DESC

LIMIT 20

OFFSET 0;
```

---

## Fetch Unread Notifications

```sql
SELECT *

FROM notifications

WHERE student_id=1042

AND is_read=false;
```

---

## Mark Notification Read

```sql
UPDATE notifications

SET is_read=true

WHERE id='notification-id';
```

---

## Delete Notification

```sql
DELETE

FROM notifications

WHERE id='notification-id';
```

---

## Benefits

- Fast lookup.
- Easy pagination.
- Efficient indexing.
- High scalability.
- Supports millions of notifications.

# Stage 3

## Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Is this query accurate?

Yes, it correctly fetches all unread notifications for a student ordered by creation time.

However, it is **not optimized** for a database containing **50,000 students and 5,000,000 notifications**.

---

## Why is it slow?

The query becomes slow because:

- The database may perform a full table scan if no suitable indexes exist.
- `ORDER BY createdAt` requires sorting a large result set.
- Fetching all unread notifications without pagination increases memory usage.
- As the table grows, query execution time increases significantly.

Time Complexity (without indexes):

```
O(N)
```

where **N = Total Notifications**

---

## Should we create indexes on every column?

**No.**

Creating indexes on every column is a bad practice because:

- Increases storage usage.
- Slows INSERT, UPDATE, and DELETE operations.
- Requires additional index maintenance.
- Many indexes are never used by queries.

Indexes should only be created on frequently searched, filtered, or sorted columns.

---

## Recommended Index

Since the query filters by:

- studentID
- isRead

and sorts by:

- createdAt

the best index is a composite index.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

---

## Optimized Query

Instead of fetching every unread notification:

```sql
SELECT id,
       notification_type,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

---

## Why is this query better?

- Uses the composite index efficiently.
- Avoids full table scans.
- Returns only required columns instead of `SELECT *`.
- Fetches only the latest 20 notifications.
- Eliminates unnecessary sorting overhead.

---

## Complexity

Without Index

```
O(N)
```

With Composite Index

```
O(log N)
```

Retrieving 20 rows after index lookup is close to constant time for practical purposes.

---

## Additional Optimization

For very large systems:

- Use pagination with `LIMIT` and `OFFSET`.
- Archive old notifications.
- Partition the table by date.
- Cache frequently accessed notifications using Redis.
- Use asynchronous workers for notification generation.

---

## Conclusion

The optimized query, together with a composite index on `(studentID, isRead, createdAt)`, significantly reduces query execution time and scales efficiently for millions of notifications while avoiding unnecessary storage and maintenance overhead from excessive indexing.
# Stage 4

## Problem Statement

Fetching notifications directly from the database on every page refresh increases database load, response time, and infrastructure cost. As the number of users grows, the database becomes the bottleneck.

---

## Proposed Solution

Instead of querying the database on every request, introduce a caching layer.

Architecture

```
React App
     │
     ▼
Notification API
     │
     ▼
Redis Cache
     │
(Cache Miss)
     ▼
PostgreSQL Database
```

---

## Flow

1. User requests notifications.
2. API checks Redis Cache.
3. If notifications exist in cache (Cache Hit), return immediately.
4. If cache is empty (Cache Miss), fetch from PostgreSQL.
5. Store the fetched notifications in Redis with a TTL (Time-To-Live).
6. Return the notifications to the client.

---

## Advantages

- Reduces database queries.
- Faster response time.
- Better scalability.
- Lower infrastructure cost.
- Improved user experience.

---

## Trade-offs

### Redis Cache

Pros

- Extremely fast (milliseconds).
- Reduces DB load.
- Handles high traffic.

Cons

- Extra infrastructure cost.
- Cached data can become stale.
- Requires cache invalidation strategy.

---

### Pagination

Instead of loading every notification:

```sql
LIMIT 20 OFFSET 0
```

Pros

- Less network traffic.
- Faster API.
- Better UI responsiveness.

Cons

- Users need multiple requests to view all notifications.

---

### Lazy Loading

Load notifications only when the user scrolls.

Pros

- Faster initial page load.
- Reduced API requests.

Cons

- Slightly more frontend complexity.

---

### Database Indexing

Create indexes on:

- studentID
- isRead
- createdAt

Pros

- Faster query execution.

Cons

- Slower INSERT/UPDATE operations.

---

## Recommended Architecture

React Client

↓

Notification API

↓

Redis Cache

↓

PostgreSQL

↓

Archive Database (Old Notifications)

---

## Conclusion

Using Redis caching together with pagination, lazy loading, and proper database indexing significantly improves scalability and minimizes database load while maintaining excellent user experience.
# Stage 5

## Problems in Existing Implementation

The current implementation processes notifications sequentially.

```
Notify User

↓

Send Email

↓

Save to Database

↓

Push Notification
```

Problems:

- Slow execution.
- High response time.
- One failure blocks the remaining users.
- Not scalable.
- Cannot handle 50,000 users efficiently.

---

## Improved Design

Use asynchronous event-driven architecture.

```
HR Clicks Notify All

↓

Notification API

↓

Message Queue (RabbitMQ / Kafka)

↓

Worker Pool

↓

Email Service

Database Service

Push Notification Service
```

---

## Workflow

1. HR submits notification.
2. API validates request.
3. Store notification once.
4. Publish message to queue.
5. Multiple workers process users in parallel.
6. Each worker:
   - Saves notification.
   - Sends email.
   - Sends push notification.
7. Failed jobs are retried automatically.

---

## Advantages

- High scalability.
- Parallel processing.
- Better fault tolerance.
- Retry support.
- Fast response to HR.
- Can handle millions of notifications.

---

## Additional Improvements

- Batch database inserts.
- Batch email sending.
- Dead Letter Queue (DLQ) for failed jobs.
- Logging middleware integration.
- Monitoring dashboard.

---

## Conclusion

An event-driven architecture using a message queue and worker pool is significantly more scalable and reliable than sequential processing. It minimizes response time and efficiently handles notifications for tens of thousands of users.