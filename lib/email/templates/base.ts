export function emailWrapper(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refraim AI</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
      padding: 40px 32px;
      text-align: center;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      text-decoration: none;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .content {
      padding: 48px 32px;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 16px;
      color: #475569;
      margin-bottom: 20px;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
      border-left: 4px solid #3b82f6;
      padding: 20px 24px;
      border-radius: 0 12px 12px 0;
      margin: 24px 0;
    }
    
    .highlight-box p {
      margin-bottom: 0;
      color: #1e40af;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 24px 0;
    }
    
    .stat-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #64748b;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      transition: transform 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
    }
    
    .secondary-button {
      display: inline-block;
      background: #f1f5f9;
      color: #475569 !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      margin: 8px 4px;
    }
    
    .feature-list {
      list-style: none;
      margin: 24px 0;
    }
    
    .feature-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 15px;
      color: #475569;
    }
    
    .feature-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #fff;
      font-size: 12px;
    }
    
    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 32px 0;
    }
    
    .footer {
      background: #f8fafc;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 12px;
    }
    
    .footer-links {
      margin-top: 16px;
    }
    
    .footer-links a {
      color: #64748b;
      text-decoration: none;
      font-size: 13px;
      margin: 0 12px;
    }
    
    .footer-links a:hover {
      color: #3b82f6;
    }
    
    .social-links {
      margin: 20px 0;
    }
    
    .social-links a {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: #e2e8f0;
      border-radius: 50%;
      margin: 0 6px;
      line-height: 36px;
      text-align: center;
      color: #64748b;
      text-decoration: none;
    }
    
    .preheader {
      display: none;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    
    @media only screen and (max-width: 600px) {
      .content {
        padding: 32px 20px;
      }
      
      .header {
        padding: 32px 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${preheader ? `<div class="preheader">${preheader}</div>` : ""}
  
  <div class="email-container">
    <div class="header">
      <a href="https://refraimai.com" class="logo">
        <div class="logo-icon">F</div>
        <span class="logo-text">Refraim AI</span>
      </a>
    </div>
    
    <div class="content">
      ${content}
    </div>
    
    <div class="footer">
      <p>Made with focus by Refraim AI</p>
      <div class="footer-links">
        <a href="https://refraimai.com/app">Dashboard</a>
        <a href="https://refraimai.com/app/help">Help</a>
        <a href="https://refraimai.com/pricing">Pricing</a>
      </div>
      <p style="margin-top: 20px;">
        You're receiving this email because you signed up for Refraim AI.<br>
        <a href="https://refraimai.com/unsubscribe" style="color: #64748b;">Unsubscribe</a> or 
        <a href="https://refraimai.com/app/settings/email" style="color: #64748b;">manage preferences</a>
      </p>
      <p style="font-size: 12px; color: #cbd5e1; margin-top: 16px;">
        &copy; ${new Date().getFullYear()} Refraim AI. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
