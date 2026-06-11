import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "./config";

export const _axios = axios.create({
    baseURL: BASE_URL,
});

_axios.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
});

_axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.clear();
            toast.error("Session Expired! Login Again");
            window.location.href = "/admin/";
            window.alert("Session Expired! Login Again");
        }
        return Promise.reject(error);
    }
);
