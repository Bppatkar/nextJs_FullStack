// import nodemailer from 'nodemailer';

// let transporter: nodemailer.Transporter | null = null;

// export async function initializeTransporter() {
//   // let nodeEnv = process.env.NODE_ENV || 'development';
//   let nodeEnv = 'production';
//   nodeEnv = nodeEnv.replace(/^===?\s*['"]?|['"]$/g, '').trim();

//   console.log('📧 NODE_ENV cleaned:', nodeEnv);

//   if (nodeEnv === 'development') {
//     console.log('📧 Initializing development email transporter...');

//     // Create test account for development

//     const testAccount = await nodemailer.createTestAccount();
//     console.log('📧 Ethereal Test Account:', testAccount.user);

//     transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass,
//       },
//     });
//     try {
//       await transporter.verify();
//       console.log('✅ Ethereal Email transporter verified successfully');
//       console.log(
//         '📧 All emails will be sent to Ethereal (no real emails in dev)'
//       );
//     } catch (error) {
//       console.error('❌ Failed to verify Ethereal Email transporter:', error);
//     }
//   } else {
//     console.log('📧 Initializing production email transporter (MailerSend)...');
//     const smtpUser = process.env.SMTP_USER;
//     const smtpPass = process.env.SMTP_PASS;

//     if (!smtpUser || !smtpPass) {
//       throw new Error('SMTP credentials are required for production');
//     }

//     transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.mailersend.net',
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: false,
//       auth: {
//         user: smtpUser,
//         pass: smtpPass,
//       },
//     });
//     try {
//       await transporter.verify();
//       console.log('✅ MailerSend Email transporter verified successfully');
//     } catch (error) {
//       console.error('❌ Failed to verify MailerSend transporter:', error);
//     }
//   }
//   return transporter;
// }

// let initPromise: Promise<nodemailer.Transporter> | null = null;

// async function getTransporter(): Promise<nodemailer.Transporter> {
//   if (transporter) {
//     return transporter;
//   }

//   if (!initPromise) {
//     initPromise = initializeTransporter();
//   }

//   transporter = await initPromise;
//   return transporter;
// }

// // Call initialize on startup
// getTransporter().catch((error) => {
//   console.error('Failed to initialize email transporter:', error);
// });

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   html: string
// ): Promise<void> => {
//   try {
//     const emailTransporter = await getTransporter();
//     const fromEmail = process.env.FROM_EMAIL;
//     const fromName = process.env.FROM_NAME || 'Your App';

//     console.log('📤 Sending email to:', to);
//     console.log('📤 Using FROM:', `${fromName} <${fromEmail}>`);

//     if (!html || html.trim().length === 0) {
//       console.error('❌ HTML content is undefined or empty');
//       throw new Error('HTML content is required for email');
//     }
//     const text = html
//       .replace(/<[^>]*>/g, '')
//       .replace(/\s+/g, ' ')
//       .trim();

//     const info = await emailTransporter.sendMail({
//       from: `"${fromName}" <${fromEmail}>`,
//       to: to,
//       subject: subject,
//       html: html,
//       text: text,
//     });

//     console.log('✅ Email sent successfully!');
//     console.log('📨 Message ID:', info.messageId);
//     console.log('📊 Response:', info.response);

//     if (process.env.NODE_ENV === 'development') {
//       const previewUrl = nodemailer.getTestMessageUrl(info);
//       console.log('📧 Preview URL:', previewUrl);
//       console.log('👉 Open this URL in browser to view the email');
//     } else {
//       console.log('📊 Response:', info.response);
//     }
//   } catch (error: any) {
//     console.error('❌ MailerSend error:', error.message);

//     if (error.response) {
//       console.log('Response:', error.response);
//     }
//     throw error;
//   }
// };

import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export async function initializeTransporter() {
  console.log('📧 Initializing email transporter...');

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log('⚠️ SMTP credentials not found. Using console transport.');
    // Create a simple console logger
    transporter = createConsoleTransport();
    return transporter;
  }

  console.log('📧 Using MailerSend SMTP...');

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailersend.net',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
  } catch (error: any) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('⚠️ Falling back to console transport');
    transporter = createConsoleTransport();
  }

  return transporter;
}

function createConsoleTransport(): nodemailer.Transporter {
  // Create a transport that logs to console
  return nodemailer.createTransport({
    jsonTransport: true,
    logger: true,
    debug: true,
  } as any);
}

let initPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) {
    return transporter;
  }

  if (!initPromise) {
    initPromise = initializeTransporter();
  }

  return await initPromise;
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const emailTransporter = await getTransporter();
    const fromEmail = process.env.FROM_EMAIL || 'noreply@clashapp.com';
    const fromName = process.env.FROM_NAME || 'Clash App';

    console.log('📤 Sending email to:', to);
    console.log('📤 Subject:', subject);
    console.log('📤 From:', `${fromName} <${fromEmail}>`);

    const info = await emailTransporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
      text: html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    });

    console.log('✅ Email processed successfully');

    // For console transport, log the email details
    if (info.messageId) {
      console.log('📨 Message ID:', info.messageId);
    }

    // Extract and log verification URL for debugging
    const urlMatch = html.match(/href="([^"]+)"/);
    if (urlMatch && urlMatch[1]) {
      console.log('🔗 Verification Link in email:', urlMatch[1]);
    }
  } catch (error: any) {
    console.error('❌ Email processing error:', error.message);
    console.log('⚠️ Continuing without email...');
  }
};
