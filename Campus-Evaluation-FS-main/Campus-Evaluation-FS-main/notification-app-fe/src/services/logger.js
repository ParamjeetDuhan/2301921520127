import apiClient from "../api/apiClient";
import { ACCESS_TOKEN } from "../utils/constants";

export const Log = async (
    stack,
    level,
    packageName,
    message
) => {
    try {
        const response = await apiClient.post(
            "/logs",
            {
                stack,
                level,
                package: packageName,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
    }
};