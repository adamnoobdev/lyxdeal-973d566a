
/**
 * Email content section components
 */

export function createHeaderSection(title: string) {
  return `
    <div class="header">
      <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" />
      <h1>${title}</h1>
    </div>
  `;
}

export function createGreetingSection(name: string, dealTitle: string) {
  return `
    <p class="greeting">Hej ${name}!</p>
    <p>Tack för att du bokade erbjudandet <span class="highlight">"${dealTitle}"</span> via Lyxdeal!</p>
    <p>Här är din unika rabattkod:</p>
  `;
}

export function createDiscountCodeSection(code: string) {
  return `
    <div class="discount-code">${code}</div>
  `;
}

export function createInstructionsSection(bookingUrl?: string) {
  return `
    <div class="instructions">
      <h3>💜 Så här använder du din kod:</h3>
      <ul>
        <li>Visa denna kod när du besöker salongen</li>
        <li>Koden är giltig i 72 timmar</li>
        <li>Boka tid direkt med salongen om det behövs</li>
      </ul>
      ${bookingUrl ? `<p class="booking-link">Du kan boka din tid direkt här: <a href="${bookingUrl}" target="_blank" class="btn-booking">Boka nu</a></p>` : ''}
    </div>
  `;
}

export function createSignatureSection() {
  return `
    <div class="signature">
      <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
    </div>
  `;
}

export function createFooterSection(currentYear: number) {
  return `
    <div class="footer">
      <p>Detta är ett automatiskt genererat meddelande, vänligen svara inte på detta email.</p>
      <p>&copy; ${currentYear} Lyxdeal. Alla rättigheter förbehållna.</p>
    </div>
  `;
}
