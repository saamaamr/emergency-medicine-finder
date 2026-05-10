const nodemailer = require('nodemailer');

/**
 * Creates a nodemailer transporter with environment configuration
 * @returns {Object} Nodemailer transporter instance
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Sends an email using the configured transporter
 * @param {string} toMail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} textMessage - Plain text message
 * @param {string} htmlMessage - HTML formatted message
 * @returns {Promise} Promise that resolves with sendMail results
 */
const sendMail = async (toMail, subject, textMessage, htmlMessage) => {
  try {
    const transporter = createTransporter();
    
    // Use SMTP_USER as the sender if available, otherwise use default
    const fromEmail = process.env.SMTP_USER || 'emflocal0@gmail.com';
    
    const results = await transporter.sendMail({
      from: `EMF Service 🔓📨 <${fromEmail}>`,
      to: toMail,
      subject,
      text: textMessage,
      html: htmlMessage,
    });
    
    return results;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
  createTransporter
};