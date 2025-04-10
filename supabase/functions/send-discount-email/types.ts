
// Types for the request payload and other data structures
export interface EmailRequest {
  email: string;
  name: string;
  phone: string;
  code: string;
  dealTitle: string;
  subscribedToNewsletter?: boolean;
  bookingUrl?: string | null;
}
