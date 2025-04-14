
export interface ResetPasswordRequest {
  /** The email address to send the password reset link to */
  email: string;
  /** The base URL to use for constructing the reset link */
  resetUrl: string;
}
