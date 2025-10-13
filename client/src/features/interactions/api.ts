import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const interactionsApi = {
  sendInterest: (userId: string) =>
    api.post(`${API_ENDPOINTS.SEND_INTEREST}/${userId}`),
  cancelSentInterest: (userId: string) =>
    api.post(`${API_ENDPOINTS.CANCEL_INTEREST_REQUEST}/${userId}`),
  acceptInterest: (userId: string) =>
    api.post(`${API_ENDPOINTS.ACCEPT_INTEREST}/${userId}`),
  declineInterest: (userId: string) =>
    api.post(`${API_ENDPOINTS.DECLINE_INTEREST_REQUEST}/${userId}`),

  blockUser: (userId: string) =>
    api.post(`${API_ENDPOINTS.ADD_TO_BLOCKLIST}/${userId}`),
  removeBlockedUser: (userId: string) =>
    api.post(`${API_ENDPOINTS.REMOVE_FROM_BLOCKEDLIST}/${userId}`),

  shortlistUser: (userId: string) =>
    api.post(`${API_ENDPOINTS.ADD_TO_SHORTLIST}/${userId}`),
  removeShortlistUser: (userId: string) =>
    api.post(`${API_ENDPOINTS.REMOVE_FROM_SHORTLIST}/${userId}`),
};
