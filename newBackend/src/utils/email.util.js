/**
 * =============================================================================
 * EMAIL UTILITY - NODEMAILER (SMTP)
 * =============================================================================
 * Free email sending using Gmail SMTP via Nodemailer
 * Best for personal projects/startups to avoid API limits
 * =============================================================================
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ Warning: EMAIL_USER or EMAIL_PASS not found in environment variables');
}

/**
 * =============================================================================
 * CONFIGURATION
 * =============================================================================
 */

const config = {
  // Use the email you authenticated with as the 'from' address
  fromEmail: process.env.EMAIL_USER, 
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Create Reusable Transporter Object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});


/**
 * =============================================================================
 * EMAIL TEMPLATES (Unchanged from your original code)
 * =============================================================================
 */

const getVerificationEmailTemplate = (firstName, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - DSA Buddy</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 28px; margin: 0; font-weight: 700; }
            .content { padding: 40px 30px; color: #333; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>🚀 Welcome to DSA Buddy!</h1></div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>Or paste this link: <br><a href="${verificationUrl}">${verificationUrl}</a></p>
            </div>
            <div class="footer"><p>&copy; 2024 DSA Buddy. All rights reserved.</p></div>
        </div>
    </body>
    </html>
  `;
};

const getWelcomeEmailTemplate = (firstName, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background-color: #f4f7fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>🎉 Welcome to DSA Buddy!</h1></div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Your account is fully activated. Ready to solve problems?</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" class="button">Start Solving</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

const getPasswordResetEmailTemplate = (firstName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background-color: #f4f7fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>🔒 Password Reset Request</h1></div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Click below to reset your password. This link expires in 1 hour.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * =============================================================================
 * EMAIL SENDING FUNCTIONS (Updated for Nodemailer)
 * =============================================================================
 */

const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"DSA Buddy" <${config.fromEmail}>`, // Sender address
      to: email, 
      subject: '🔐 Verify Your Email Address - DSA Buddy',
      html: getVerificationEmailTemplate(firstName, verificationUrl),
      text: `Hello ${firstName},\nPlease verify your email: ${verificationUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Verification email sent successfully');
    console.log(`   To: ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId, email: email };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

const sendWelcomeEmail = async (email, firstName) => {
  try {
    const loginUrl = config.frontendUrl;
    
    const mailOptions = {
      from: `"DSA Buddy" <${config.fromEmail}>`,
      to: email,
      subject: '🎉 Welcome to DSA Buddy!',
      html: getWelcomeEmailTemplate(firstName, loginUrl),
      text: `Hello ${firstName}, Welcome! Login here: ${loginUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Welcome email sent successfully');
    
    return { success: true, messageId: info.messageId, email: email };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"DSA Buddy Security" <${config.fromEmail}>`,
      to: email,
      subject: '🔒 Reset Your Password - DSA Buddy',
      html: getPasswordResetEmailTemplate(firstName, resetUrl),
      text: `Reset your password here: ${resetUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Password reset email sent');
    
    return { success: true, messageId: info.messageId, email: email };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

const sendGenericEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: `"DSA Buddy" <${config.fromEmail}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId, email: to };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendGenericEmail,
};