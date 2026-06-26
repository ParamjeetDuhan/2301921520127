const { v4: uuid } = require("uuid");
const notifications = require("../data/notifications");

// GET /notifications
exports.getNotifications = (req, res) => {

    let {
        page = 1,
        limit = 10,
        notification_type
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let result = [...notifications];

    if (notification_type) {
        result = result.filter(
            notification =>
                notification.type.toLowerCase() ===
                notification_type.toLowerCase()
        );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedNotifications = result.slice(
        startIndex,
        endIndex
    );

    return res.status(200).json({
    success: true,
    total: result.length,
    currentPage: page,
    totalPages: Math.ceil(result.length / limit),
    notifications: paginatedNotifications
});
};

// POST /notifications
exports.createNotification = (req, res) => {

    const { studentId, type, message } = req.body;

    if (!studentId || !type || !message) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const notification = {
        id: uuid(),
        studentId,
        type,
        message,
        isRead: false,
        createdAt: new Date()
    };

    notifications.push(notification);

    res.status(201).json(notification);
};

// PATCH /notifications/:id
exports.markAsRead = (req, res) => {

    const notification = notifications.find(
        n => n.id === req.params.id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification not found"
        });
    }

    notification.isRead = true;

    res.json(notification);
};

// DELETE /notifications/:id
exports.deleteNotification = (req, res) => {

    const index = notifications.findIndex(
        n => n.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Notification not found"
        });
    }

    notifications.splice(index, 1);

    res.json({
        message: "Notification deleted successfully"
    });
};