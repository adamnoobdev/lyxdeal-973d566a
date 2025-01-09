import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    console.error('Complete auth error:', {
      message: error.message,
      status: error.status,
      name: error.name,
      code: error.code
    });
    
    if (error.status === 400) {
      return "Kontrollera dina inloggningsuppgifter och försök igen";
    }
    
    switch (error.message) {
      case 'Invalid login credentials':
        return "Felaktigt användarnamn eller lösenord";
      case 'Email not confirmed':
        return "Vänligen bekräfta din e-postadress först";
      case 'Invalid email or password':
        return "Ogiltig e-postadress eller lösenord";
      default:
        return `Ett fel uppstod: ${error.message}`;
    }
  }
  console.error('Unexpected error:', error);
  return "Ett oväntat fel inträffade. Vänligen försök igen";
};