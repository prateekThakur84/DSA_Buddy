//  =============================================================================
// EMAIL UTILITY - SENDGRID INTEGRATION FOR RENDER
// =============================================================================
// This file handles all email sending functionality using SendGrid API
// Compatible with Render deployment (SMTP ports are blocked on Render)
// =============================================================================

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

// =============================================================================
// TRANSPORTER CONFIGURATION
// =============================================================================

/**
 * Create SendGrid transporter (works on Render)
 * Uses SendGrid API instead of SMTP to avoid port blocking
 */
const createTransporter = () => {
  return nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    })
  );
};

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

/**
 * Email verification template
 * @param {string} firstName - User's first name
 * @param {string} verificationUrl - Verification link URL
 * @returns {string} HTML email template
 */
const getVerificationEmailTemplate = (firstName, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px -20px;
            }
            .content {
                padding: 20px 0;
                line-height: 1.6;
                color: #333;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to DSA Buddy!</h1>
            </div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Thank you for registering with DSA Buddy. To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
                <p>If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DSA Buddy. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Welcome email template
 * @param {string} firstName - User's first name
 * @returns {string} HTML email template
 */
const getWelcomeEmailTemplate = (firstName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DSA Buddy</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #2196F3;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px -20px;
            }
            .content {
                padding: 20px 0;
                line-height: 1.6;
                color: #333;
            }
            .feature-list {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 4px;
                margin: 15px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to DSA Buddy!</h1>
            </div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Your account has been successfully verified and you're now ready to start your coding journey with us!</p>
                
                <div class="feature-list">
                    <h3>What you can do now:</h3>
                    <ul>
                        <li>📝 Solve coding problems across different difficulty levels</li>
                        <li>🏆 Track your progress and solutions</li>
                        <li>🤖 Get AI-powered hints and explanations</li>
                        <li>📊 Analyze your coding performance</li>
                        <li>🎯 Practice algorithms and data structures</li>
                    </ul>
                </div>
                
                <p>Ready to get started? <a href="${process.env.FRONTEND_URL}" style="color: #2196F3;">Login to your account</a> and start solving problems!</p>
                
                <p>If you have any questions or need help, feel free to reach out to our support team.</p>
                
                <p>Happy coding! 🚀</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DSA Buddy. All rights reserved.</p>
                <p>Need help? Contact us at support@dsabuddy.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Password reset email template
 * @param {string} firstName - User's first name
 * @param {string} resetUrl - Password reset link URL
 * @returns {string} HTML email template
 */
const getPasswordResetEmailTemplate = (firstName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #FF9800;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px -20px;
            }
            .content {
                padding: 20px 0;
                line-height: 1.6;
                color: #333;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #FF9800;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeeba;
                color: #856404;
                padding: 12px;
                border-radius: 4px;
                margin: 15px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>We received a request to reset your password for your DSA Buddy account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                
                <div class="warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                        <li>This reset link will expire in 1 hour</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>For security, this link can only be used once</li>
                    </ul>
                </div>
                
                <p>If you continue to have problems, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 DSA Buddy. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// =============================================================================
// EMAIL SENDING FUNCTIONS
// =============================================================================

/**
 * Send verification email to user
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Unique verification token
 * @returns {Promise<Object>} Result with success status and messageId
 */
const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || `"DSA Buddy" <noreply@dsabuddy.com>`,
      to: email,
      subject: 'Verify Your Email Address - DSA Buddy',
      html: getVerificationEmailTemplate(firstName, verificationUrl),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @returns {Promise<Object>} Result with success status and messageId
 */
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || `"DSA Buddy" <noreply@dsabuddy.com>`,
      to: email,
      subject: 'Welcome to DSA Buddy! 🎉',
      html: getWelcomeEmailTemplate(firstName),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Failed to send welcome email');
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} resetToken - Unique password reset token
 * @returns {Promise<Object>} Result with success status and messageId
 */
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || `"DSA Buddy" <noreply@dsabuddy.com>`,
      to: email,
      subject: 'Reset Your Password - DSA Buddy',
      html: getPasswordResetEmailTemplate(firstName, resetUrl),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Failed to send password reset email');
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};