import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailersend.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const fromEmail = process.env.FROM_EMAIL;
    const fromName = process.env.FROM_NAME || 'Your App';

    console.log('📤 Sending email to:', to);
    console.log('📤 Using FROM:', `${fromName} <${fromEmail}>`);

    if (!html) {
      console.error('❌ HTML content is undefined or empty');
      throw new Error('HTML content is required for email');
    }
    const text = html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
      text: text,
    });

    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
  } catch (error: any) {
    console.error('❌ MailerSend error:', error.message);

    if (error.response) {
      console.log('Response:', error.response);
    }
    throw error;
  }
};
