import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import NotificationCard from "../components/NotificationCard";
import NotificationFilter from "../components/NotificationFilter";
import PaginationComponent from "../components/Pagination";
import CreateNotification from "../components/CreateNotification";

import { getNotifications } from "../api/notificationApi";

export default function Dashboard() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [type, setType] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const response = await getNotifications(
                page,
                5,
                type
            );

            setNotifications(response.data.notifications);
            setTotalPages(response.data.totalPages);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchNotifications();

    }, [page, type]);

    return (

        <>

            <Header />

            <Container
                maxWidth="md"
                sx={{ mt: 5 }}
            >

                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                >

                    Notification Dashboard

                </Typography>

                <StatsCards
                    notifications={notifications}
                />

                <CreateNotification
                    reload={fetchNotifications}
                />

                <NotificationFilter
                    type={type}
                    setType={setType}
                />

                {

                    loading ?

                        <Box
                            display="flex"
                            justifyContent="center"
                            mt={5}
                        >

                            <CircularProgress />

                        </Box>

                        :

                        notifications.length === 0 ?

                            <Typography
                                align="center"
                                mt={5}
                            >

                                No Notifications Found

                            </Typography>

                            :

                            notifications.map(notification => (

                                <NotificationCard

                                    key={notification.id}

                                    notification={notification}

                                    reload={fetchNotifications}

                                />

                            ))

                }

                <PaginationComponent

                    page={page}

                    totalPages={totalPages}

                    setPage={setPage}

                />

            </Container>

        </>

    );

}