import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000"
});

export const getNotifications = (page, limit, type) => {

    const params = {
        page,
        limit
    };

    if (type) {
        params.notification_type = type;
    }

    return api.get("/notifications", { params });

};

export const createNotification = (data) =>
    api.post("/notifications", data);

export const markAsRead = (id) =>
    api.patch(`/notifications/${id}`);

export const deleteNotification = (id) =>
    api.delete(`/notifications/${id}`);