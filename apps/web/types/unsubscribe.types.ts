export type UnsubscribeStatus =
  | "active"
  | "already_unsubscribed"
  | "unsubscribed"
  | "invalid"
  | "expired";

export interface UnsubscribeStatusResponse {
  status: UnsubscribeStatus;
}

export interface UnsubscribeRequest {
  token: string;
}

