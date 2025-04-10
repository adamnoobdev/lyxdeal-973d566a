
/**
 * Email content section components
 */

export function createHeaderSection(title: string) {
  return `
    <div class="header">
      <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/Lyxdeal-logo.svg" alt="Lyxdeal" />
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

// Add the missing functions that are imported in emailTemplate.ts
export function getHeaderSection(styles: Record<string, string>) {
  return `
    <div style="${styles.logoContainer}">
      <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/Lyxdeal-logo.svg" alt="Beauty Deals" style="${styles.logoImage}" />
    </div>
  `;
}

export function getFooterSection(styles: Record<string, string>) {
  const currentYear = new Date().getFullYear();
  return `
    <div style="${styles.footer}">
      <p style="margin: 5px 0;">© ${currentYear} Beauty Deals. Alla rättigheter förbehållna.</p>
      <p style="margin: 5px 0;">Det här är ett automatiskt meddelande, svara inte på detta mail.</p>
    </div>
  `;
}

export function getCodeSection(code: string, styles: Record<string, string>) {
  return `
    <div style="${styles.codeContainer}">
      <p style="${styles.code}">${code}</p>
    </div>
  `;
}

export function getBookingSection(bookingUrl: string, styles: Record<string, string>) {
  return `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${bookingUrl}" target="_blank" style="${styles.button}">Boka nu</a>
    </div>
  `;
}
