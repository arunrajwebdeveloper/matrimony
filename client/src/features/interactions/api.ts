import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const interactionsApi = {
  sendInterest: (userId: string) =>
    api.post(`${API_ENDPOINTS.SEND_INTEREST}/${userId}`),
  acceptInterest: (userId: string) =>
    api.post(`/interactions/accept/${userId}`),
  declineInterest: (userId: string) =>
    api.post(`/interactions/decline/${userId}`),
  blockUser: (userId: string) => api.post(`/interactions/block/${userId}`),
  removeUser: (userId: string) => api.delete(`/interactions/remove/${userId}`),
};
