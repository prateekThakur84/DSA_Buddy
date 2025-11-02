/**
 * =============================================================================
 * EMAIL UTILITY - SENDGRID INTEGRATION (@sendgrid/mail)
 * =============================================================================
 * Modern email sending using SendGrid Web API
 * Works seamlessly with Render and other platforms
 * No SMTP port restrictions
 * =============================================================================
 */

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key once at module load
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Validate environment variables
if (!process.env.SENDGRID_API_KEY) {
  console.warn('⚠️ Warning: SENDGRID_API_KEY not found in environment variables');
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  console.warn('⚠️ Warning: SENDGRID_FROM_EMAIL not found in environment variables');
}

/**
 * =============================================================================
 * CONFIGURATION
 * =============================================================================
 */

const config = {
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@dsabuddy.com',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

/**
 * =============================================================================
 * EMAIL TEMPLATES
 * =============================================================================
 */

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
        <title>Email Verification - DSA Buddy</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin: 0;
                font-weight: 700;
            }
            .content {
                padding: 40px 30px;
                color: #333;
            }
            .content h2 {
                font-size: 20px;
                margin-bottom: 15px;
                color: #333;
            }
            .content p {
                margin-bottom: 15px;
                line-height: 1.8;
                color: #555;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                transition: opacity 0.3s ease;
            }
            .button:hover {
                opacity: 0.9;
            }
            .link-section {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
                word-break: break-all;
            }
            .link-section p {
                margin: 0;
                font-size: 13px;
            }
            .link-section a {
                color: #667eea;
                text-decoration: none;
            }
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                color: #856404;
                font-size: 14px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }
            .footer p {
                margin: 5px 0;
            }
            .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Welcome to DSA Buddy!</h1>
            </div>
            
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                
                <p>Thank you for creating your DSA Buddy account. We're excited to have you on board!</p>
                
                <p>To complete your registration and start solving coding problems, please verify your email address by clicking the button below:</p>
                
                <div class="button-container">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                
                <div class="link-section">
                    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                </div>
                
                <div class="warning">
                    <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
                </div>
                
                <p>If you didn't create this account or have any questions, please don't hesitate to contact our support team.</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2024 DSA Buddy. All rights reserved.</p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Welcome email template
 * @param {string} firstName - User's first name
 * @param {string} loginUrl - Login URL
 * @returns {string} HTML email template
 */
const getWelcomeEmailTemplate = (firstName, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DSA Buddy</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin: 0;
                font-weight: 700;
            }
            .content {
                padding: 40px 30px;
                color: #333;
            }
            .content h2 {
                font-size: 20px;
                margin-bottom: 15px;
                color: #333;
            }
            .content p {
                margin-bottom: 15px;
                line-height: 1.8;
                color: #555;
            }
            .features {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
            }
            .features h3 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .features ul {
                list-style: none;
                padding: 0;
            }
            .features li {
                padding: 8px 0;
                padding-left: 25px;
                position: relative;
                color: #555;
            }
            .features li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #667eea;
                font-weight: bold;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                transition: opacity 0.3s ease;
            }
            .button:hover {
                opacity: 0.9;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }
            .footer p {
                margin: 5px 0;
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
                
                <p>Your email has been successfully verified! Your account is now fully activated and ready to use.</p>
                
                <div class="features">
                    <h3>Here's what you can do now:</h3>
                    <ul>
                        <li>Solve coding problems across multiple difficulty levels</li>
                        <li>Track your progress and view all your solutions</li>
                        <li>Get AI-powered hints and detailed explanations</li>
                        <li>Analyze your coding performance and statistics</li>
                        <li>Practice Data Structures and Algorithms</li>
                        <li>Compete with other developers on leaderboards</li>
                    </ul>
                </div>
                
                <p>Ready to start your coding journey? Click the button below to login and begin solving problems:</p>
                
                <div class="button-container">
                    <a href="${loginUrl}" class="button">Start Solving Problems</a>
                </div>
                
                <p>If you have any questions or need help getting started, feel free to reach out to our support team at <strong>support@dsabuddy.com</strong>.</p>
                
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
        <title>Password Reset - DSA Buddy</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin: 0;
                font-weight: 700;
            }
            .content {
                padding: 40px 30px;
                color: #333;
            }
            .content h2 {
                font-size: 20px;
                margin-bottom: 15px;
                color: #333;
            }
            .content p {
                margin-bottom: 15px;
                line-height: 1.8;
                color: #555;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                transition: opacity 0.3s ease;
            }
            .button:hover {
                opacity: 0.9;
            }
            .link-section {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
                word-break: break-all;
            }
            .link-section p {
                margin: 0;
                font-size: 13px;
            }
            .link-section a {
                color: #f5576c;
                text-decoration: none;
            }
            .security-warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                color: #856404;
                font-size: 14px;
            }
            .security-warning strong {
                display: block;
                margin-bottom: 10px;
            }
            .security-warning ul {
                margin: 0;
                padding-left: 20px;
            }
            .security-warning li {
                margin-bottom: 5px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }
            .footer p {
                margin: 5px 0;
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
                
                <p>We received a request to reset your password for your DSA Buddy account. If you made this request, click the button below to create a new password:</p>
                
                <div class="button-container">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                
                <div class="link-section">
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                </div>
                
                <div class="security-warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                        <li>This reset link will expire in <strong>1 hour</strong> for your security</li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>This reset link can only be used <strong>once</strong></li>
                        <li>Never share this link with anyone else</li>
                    </ul>
                </div>
                
                <p>If you continue to have problems resetting your password or didn't request this email, please contact our support team immediately.</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2024 DSA Buddy. All rights reserved.</p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * =============================================================================
 * EMAIL SENDING FUNCTIONS
 * =============================================================================
 */

/**
 * Send verification email to user
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Unique verification token
 * @returns {Promise<Object>} Result with success status and messageId
 * @throws {Error} If email sending fails
 */
const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    // const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
    
    const msg = {
      to: email,
      from: config.fromEmail,
      subject: '🔐 Verify Your Email Address - DSA Buddy',
      html: getVerificationEmailTemplate(firstName, verificationUrl),
      text: `Hello ${firstName},\n\nPlease verify your email by clicking this link:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Verification email sent successfully');
    console.log(`   To: ${email}`);
    console.log(`   Message ID: ${result[0].headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'],
      email: email,
    };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @returns {Promise<Object>} Result with success status and messageId
 * @throws {Error} If email sending fails
 */
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const loginUrl = config.frontendUrl;
    
    const msg = {
      to: email,
      from: config.fromEmail,
      subject: '🎉 Welcome to DSA Buddy!',
      html: getWelcomeEmailTemplate(firstName, loginUrl),
      text: `Hello ${firstName},\n\nYour email has been verified! You can now login and start solving problems.\n\nLogin here: ${loginUrl}`,
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Welcome email sent successfully');
    console.log(`   To: ${email}`);
    console.log(`   Message ID: ${result[0].headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'],
      email: email,
    };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
    
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} resetToken - Unique password reset token
 * @returns {Promise<Object>} Result with success status and messageId
 * @throws {Error} If email sending fails
 */
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    
    const msg = {
      to: email,
      from: config.fromEmail,
      subject: '🔒 Reset Your Password - DSA Buddy',
      html: getPasswordResetEmailTemplate(firstName, resetUrl),
      text: `Hello ${firstName},\n\nTo reset your password, click this link:\n${resetUrl}\n\nThis link expires in 1 hour.`,
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Password reset email sent successfully');
    console.log(`   To: ${email}`);
    console.log(`   Message ID: ${result[0].headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'],
      email: email,
    };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
    
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Send generic email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (optional)
 * @returns {Promise<Object>} Result with success status and messageId
 * @throws {Error} If email sending fails
 */
const sendGenericEmail = async (to, subject, html, text = '') => {
  try {
    const msg = {
      to,
      from: config.fromEmail,
      subject,
      html,
    };

    if (text) {
      msg.text = text;
    }

    const result = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message ID: ${result[0].headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: result[0].headers['x-message-id'],
      email: to,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * =============================================================================
 * EXPORTS
 * =============================================================================
 */

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendGenericEmail,
};