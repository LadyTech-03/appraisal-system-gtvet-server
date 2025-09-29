const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send email
  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to TVET Appraisal System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to TVET Appraisal System</h2>
        <p>Dear ${user.name},</p>
        <p>Welcome to the TVET Appraisal System! Your account has been created successfully.</p>
        <p><strong>Your login details:</strong></p>
        <ul>
          <li>Email: ${user.email}</li>
          <li>Employee ID: ${user.employeeId}</li>
          <li>Role: ${user.role}</li>
        </ul>
        <p>Please log in to the system to complete your profile and start using the appraisal system.</p>
        <p>If you have any questions, please contact your system administrator.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset - TVET Appraisal System';
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>You have requested to reset your password for the TVET Appraisal System.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send appraisal notification email
  async sendAppraisalNotificationEmail(employee, appraiser, appraisal) {
    const subject = 'New Appraisal Assigned - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Appraisal Assigned</h2>
        <p>Dear ${employee.name},</p>
        <p>A new performance appraisal has been assigned to you.</p>
        <p><strong>Appraisal Details:</strong></p>
        <ul>
          <li>Period: ${appraisal.periodStart} to ${appraisal.periodEnd}</li>
          <li>Appraiser: ${appraiser.name}</li>
          <li>Status: ${appraisal.status}</li>
        </ul>
        <p>Please log in to the system to complete your appraisal.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(employee.email, subject, html);
  }

  // Send appraisal submission notification
  async sendAppraisalSubmissionNotification(employee, appraiser, appraisal) {
    const subject = 'Appraisal Submitted for Review - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Appraisal Submitted for Review</h2>
        <p>Dear ${appraiser.name},</p>
        <p>${employee.name} has submitted their performance appraisal for your review.</p>
        <p><strong>Appraisal Details:</strong></p>
        <ul>
          <li>Employee: ${employee.name}</li>
          <li>Period: ${appraisal.periodStart} to ${appraisal.periodEnd}</li>
          <li>Status: ${appraisal.status}</li>
        </ul>
        <p>Please log in to the system to review the appraisal.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(appraiser.email, subject, html);
  }

  // Send appraisal completion notification
  async sendAppraisalCompletionNotification(employee, appraisal) {
    const subject = 'Appraisal Completed - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Appraisal Completed</h2>
        <p>Dear ${employee.name},</p>
        <p>Your performance appraisal has been completed and reviewed.</p>
        <p><strong>Appraisal Details:</strong></p>
        <ul>
          <li>Period: ${appraisal.periodStart} to ${appraisal.periodEnd}</li>
          <li>Status: ${appraisal.status}</li>
          <li>Overall Rating: ${appraisal.overallAssessment?.overallRating || 'N/A'}</li>
        </ul>
        <p>Please log in to the system to view your appraisal results.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(employee.email, subject, html);
  }

  // Send access request notification
  async sendAccessRequestNotification(requester, targetUser, request) {
    const subject = 'Access Request - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Access Request</h2>
        <p>Dear ${targetUser.name},</p>
        <p>${requester.name} has requested access to your data.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Requester: ${requester.name}</li>
          <li>Request Type: ${request.requestType}</li>
          <li>Reason: ${request.reason}</li>
        </ul>
        <p>Please log in to the system to review and respond to this request.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(targetUser.email, subject, html);
  }

  // Send access request approval notification
  async sendAccessRequestApprovalNotification(requester, request) {
    const subject = 'Access Request Approved - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Access Request Approved</h2>
        <p>Dear ${requester.name},</p>
        <p>Your access request has been approved.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Request Type: ${request.requestType}</li>
          <li>Status: Approved</li>
        </ul>
        <p>You can now access the requested data in the system.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(requester.email, subject, html);
  }

  // Send access request rejection notification
  async sendAccessRequestRejectionNotification(requester, request) {
    const subject = 'Access Request Rejected - TVET Appraisal System';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Access Request Rejected</h2>
        <p>Dear ${requester.name},</p>
        <p>Your access request has been rejected.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Request Type: ${request.requestType}</li>
          <li>Status: Rejected</li>
        </ul>
        <p>If you have any questions, please contact your system administrator.</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    return await this.sendEmail(requester.email, subject, html);
  }

  // Send system notification
  async sendSystemNotification(users, subject, message) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">System Notification</h2>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>TVET Appraisal System Team</p>
      </div>
    `;

    const emailPromises = users.map(user => 
      this.sendEmail(user.email, subject, html)
    );

    return await Promise.all(emailPromises);
  }
}

module.exports = new EmailService();
