import {
    ApiResponse,
    Reward,
    RewardFormData,
    Token,
    TokenFormData,
    Transaction,
} from "../types";

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token API calls
export const tokenApi = {
    getAll: async (): Promise<ApiResponse<Token[]>> => {
        const response = await api.get("/api/tokens");
        return response.data;
    },

    create: async (tokenData: TokenFormData): Promise<ApiResponse<Token>> => {
        const response = await api.post("/api/tokens", tokenData);
        return response.data;
    },

    update: async (
        id: string,
        tokenData: Partial<TokenFormData>
    ): Promise<ApiResponse<Token>> => {
        const response = await api.put(`/api/tokens/${id}`, tokenData);
        return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/tokens/${id}`);
        return response.data;
    },

    addTokens: async (
        id: string,
        amount: number,
        description: string
    ): Promise<ApiResponse<Token>> => {
        const response = await api.post(`/api/tokens/${id}/add`, {
            amount,
            description,
        });
        return response.data;
    },

    spendTokens: async (
        id: string,
        amount: number,
        description: string
    ): Promise<ApiResponse<Token>> => {
        const response = await api.post(`/api/tokens/${id}/spend`, {
            amount,
            description,
        });
        return response.data;
    },
};

// Reward API calls
export const rewardApi = {
    getAll: async (): Promise<ApiResponse<Reward[]>> => {
        const response = await api.get("/api/rewards");
        return response.data;
    },

    create: async (
        rewardData: RewardFormData
    ): Promise<ApiResponse<Reward>> => {
        const response = await api.post("/api/rewards", rewardData);
        return response.data;
    },

    update: async (
        id: string,
        rewardData: Partial<RewardFormData>
    ): Promise<ApiResponse<Reward>> => {
        const response = await api.put(`/api/rewards/${id}`, rewardData);
        return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/api/rewards/${id}`);
        return response.data;
    },

    toggleActive: async (id: string): Promise<ApiResponse<Reward>> => {
        const response = await api.patch(`/api/rewards/${id}/toggle`);
        return response.data;
    },
};

// Transaction API calls
export const transactionApi = {
    getAll: async (): Promise<ApiResponse<Transaction[]>> => {
        const response = await api.get("/api/transactions");
        return response.data;
    },

    getByToken: async (
        tokenId: string
    ): Promise<ApiResponse<Transaction[]>> => {
        const response = await api.get(`/api/transactions/token/${tokenId}`);
        return response.data;
    },
};

export default api;
