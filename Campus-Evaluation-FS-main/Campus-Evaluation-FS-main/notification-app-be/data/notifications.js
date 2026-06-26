const { v4: uuid } = require("uuid");

const notifications = [
    {
        id: uuid(),
        studentId: 1042,
        type: "Placement",
        message: "Microsoft Hiring Drive",
        isRead: false,
        createdAt: new Date()
    },
    {
        id: uuid(),
        studentId: 1042,
        type: "Event",
        message: "Hackathon Registration Open",
        isRead: false,
        createdAt: new Date()
    },
    {
        id: uuid(),
        studentId: 1043,
        type: "Result",
        message: "Semester Result Published",
        isRead: true,
        createdAt: new Date()
    }
];

module.exports = notifications;