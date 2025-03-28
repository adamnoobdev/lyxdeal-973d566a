
/**
 * Validerar om en e-postadress verkar giltig
 * 
 * @param email E-postadressen som ska valideras
 * @returns true om e-postadressen verkar giltig, annars false
 */
export const validateEmail = (email: string): boolean => {
  // Enkel validering av e-postadress med regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Kontrollera om domänen ser rimlig ut
  const domain = email.split('@')[1];
  
  // Blockera vanliga temporära e-posttjänster
  const blockedDomains = [
    'tempmail.com', 'temp-mail.org', 'fakeinbox.com', 
    'guerrillamail.com', 'yopmail.com', 'mailinator.com',
    'throwawaymail.com', '10minutemail.com', 'trashmail.com'
  ];
  
  // Kontrollera om domänen finns i blocklistan
  if (blockedDomains.some(blocked => domain.includes(blocked))) {
    return false;
  }
  
  return true;
};

/**
 * Validerar om ett telefonnummer ser ut att vara ett svenskt mobilnummer
 * 
 * @param phone Telefonnumret som ska valideras
 * @returns true om telefonnumret ser ut att vara ett giltigt svenskt mobilnummer, annars false
 */
export const validatePhone = (phone: string): boolean => {
  // Ta bort mellanslag från telefonnumret
  const cleaned = phone.replace(/\s+/g, '');
  
  // Kontrollera om numret är ett svenskt mobilnummer (börjar med 07)
  // Stödjer både format: 07XXXXXXXX och +467XXXXXXXX
  const phoneRegex = /^(?:\+46|0)7[0-9]{8}$/;
  
  return phoneRegex.test(cleaned);
};
