import { apiClient } from "@/lib/api";

export type KycStatus = "pending" | "approved" | "rejected";

export type KycRequestRow = {
  _id: string;
  user_id: string;
  pan_number: string;
  aadhaar_number: string;
  pan_doc_url: string;
  aadhaar_doc_url: string;
  status: KycStatus;
  admin_note?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const verificationService = {
  listPending: () =>
    apiClient.get<{ data: KycRequestRow[] }>("/verification/kyc/pending"),
  listAll: () =>
    apiClient.get<{ data: KycRequestRow[] }>("/verification/kyc/all"),
  review: (id: string, status: KycStatus, adminNote?: string) =>
    apiClient.put<{ data: KycRequestRow }>(`/verification/kyc/${id}/review`, {
      status,
      adminNote,
    }),
};
