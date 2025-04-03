
// Types used in the welcome email function
export interface WelcomeEmailRequest {
  email: string;
  business_name: string;
  temporary_password: string;
  subscription_info?: {
    plan: string;
    type: string;
    start_date: string;
    next_billing_date: string | null;
  }
}
