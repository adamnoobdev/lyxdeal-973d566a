
/**
 * Email styles
 */
export function getEmailStyles() {
  // Return a comprehensive set of styles for the email template
  return {
    // Layout and structure styles
    container: "max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;",
    header: "background-color: #520053; padding: 20px; text-align: center; color: white;",
    content: "padding: 20px;",
    footer: "background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;",
    
    // Text and content styles
    heading: "color: #520053; font-size: 24px; margin-bottom: 20px;",
    subheading: "color: #520053; font-size: 18px; margin-bottom: 10px;",
    paragraph: "margin-bottom: 15px; line-height: 1.5;",
    paragraphBold: "margin-bottom: 15px; line-height: 1.5; font-weight: bold;",
    link: "color: #520053; text-decoration: underline;",
    
    // Component styles
    codeContainer: "background-color: #f7f0f7; border: 1px solid #e0c6e0; border-radius: 6px; padding: 15px; margin: 15px 0; text-align: center;",
    code: "font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #520053; letter-spacing: 2px; margin: 0;",
    button: "display: inline-block; background-color: #520053; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 15px 0;",
    contentCell: "padding: 20px; border-bottom: 1px solid #eee;",
    
    // Additional components
    divider: "border-top: 1px solid #eee; margin: 20px 0;",
    logoContainer: "margin-bottom: 20px;",
    logoImage: "max-width: 150px; height: auto;"
  };
}

// Exportera styles för bakåtkompatibilitet
export const styles = getEmailStyles();
