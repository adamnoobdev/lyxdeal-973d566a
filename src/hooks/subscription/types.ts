
export interface PurchaseDetails {
  id?: string;
  business_name: string;
  email: string;
  plan_title?: string;
  plan_payment_type?: string;
  status?: string;
  created_at?: string;
  stripe_session_id?: string;
}

export interface SalonAccount {
  id: number;
  email: string;
  name?: string;
}

export interface SubscriptionDetailsState {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
  timeElapsed: number;
  maxRetries: number;
}

export interface SubscriptionDetailsActions {
  manualRetry: () => void;
}

export interface SubscriptionDetailsHook extends SubscriptionDetailsState, SubscriptionDetailsActions {}
