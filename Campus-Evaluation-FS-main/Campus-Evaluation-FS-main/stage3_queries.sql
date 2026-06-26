-- Existing Query
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;

-- Composite Index
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);

-- Optimized Query
SELECT id,
       notification_type,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;