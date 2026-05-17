const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

async function sendEmailOTP(email, otp, purpose) {
  const subject = `EMF Service - ${purpose} OTP Verification`;
  const htmlMessage = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #188bde;">EMF Service OTP Verification</h2>
      <p>Your verification code is:</p>
      <div style="background: #f5f5f5; padding: 15px 30px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      <p style="color: #666; font-size: 12px;">If you did not request this code, please ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: 'EMF Service <emflocal0@gmail.com>',
      to: email,
      subject,
      text: `Your OTP is: ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: htmlMessage,
    });
    return true;
  } catch (error) {
    console.error('Email OTP send error:', error);
    return false;
  }
}

async function sendSMSOTP(phone, otp, purpose) {
  if (!process.env.SMS_API_URL || !process.env.SMS_API_KEY) {
    console.warn('SMS not configured. Skipping SMS OTP.');
    return true;
  }

  const message = `EMF Service: Your ${purpose} verification code is ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`;

  try {
    const response = await fetch(process.env.SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
      },
      body: JSON.stringify({
        to: phone.startsWith('+') ? phone : `+88${phone}`,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('SMS OTP send error:', error);
    return false;
  }
}

function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp + process.env.OTP_SECRET).digest('hex');
}

const OTPService = {
  generate: generateOTP,
  hash: hashOTP,
  sendEmail: sendEmailOTP,
  sendSMS: sendSMSOTP,
  expiryMinutes: OTP_EXPIRY_MINUTES,
  maxAttempts: MAX_OTP_ATTEMPTS,

  /**
   * Send OTP to email only (first step of sequential verification)
   */
  async sendEmailOTPOnly(email, phone, purpose) {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const emailSent = await sendEmailOTP(email, otp, purpose);

    return {
      success: emailSent,
      emailSent,
      hashedOTP,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    };
  },

  /**
   * Send OTP to phone only (second step of sequential verification)
   */
  async sendPhoneOTPOnly(email, phone, purpose) {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const smsSent = await sendSMSOTP(phone, otp, purpose);

    return {
      success: smsSent,
      smsSent,
      hashedOTP,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    };
  },

  async sendOTP(email, phone, purpose) {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const emailSent = await sendEmailOTP(email, otp, purpose);
    const smsSent = await sendSMSOTP(phone, otp, purpose);

    return {
      success: emailSent,
      emailSent,
      smsSent,
      hashedOTP,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    };
  },

  verify(plainOTP, hashedOTP) {
    const hash = hashOTP(plainOTP);
    return hash === hashedOTP;
  },
};

module.exports = OTPService;