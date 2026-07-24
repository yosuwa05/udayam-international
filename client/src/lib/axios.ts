import axios from "axios";
import { BASE_URL } from "./config";

export const _axios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

if (typeof window !== "undefined") {
    _axios.interceptors.request.use((config) => {
        return config;
    });

    _axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    return Promise.reject(new Error("Unauthorized"));
                }
                if (error.response.status >= 500) {
                    return Promise.reject(
                        new Error("Server error, please try again later.")
                    );
                }
                return Promise.reject(
                    error.response.data || new Error("An error occurred")
                );
            } else if (error.request) {
                return Promise.reject(
                    new Error("No response from server, check your network.")
                );
            } else {
                return Promise.reject(new Error("Request failed, please try again."));
            }
        }
    );
}
