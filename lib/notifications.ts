import { Resend } from 'resend'
import twilio from 'twilio'
import nodemailer from 'nodemailer'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Gmail SMTP transporter (if Gmail credentials are provided)
const gmailTransporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function sendAssignmentEmails(
  recipientEmail: string,
  recipientName: string,
  assignedName: string
): Promise<void> {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1f2937;">🎄 Secret Santa Assignment 🎄</h1>
      <p>Hi ${recipientName},</p>
      <p>Your Secret Santa assignment has been generated!</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 18px; font-weight: bold; color: #1f2937; margin: 0;">
          You are the Secret Santa for: <span style="color: #2563eb;">${assignedName}</span>
        </p>
      </div>
      <p>Happy gift giving! 🎁</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This is an automated message from the Secret Santa system.
      </p>
    </div>
  `

  // Try Gmail SMTP first (if configured), otherwise use Resend
  if (gmailTransporter && process.env.GMAIL_USER) {
    try {
      await gmailTransporter.sendMail({
        from: `Secret Santa <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Your Secret Santa Assignment',
        html: emailHtml,
      })
      return
    } catch (error) {
      console.error('Failed to send email via Gmail SMTP:', error)
      // Fall back to Resend if Gmail fails
      if (!resend) {
        throw error
      }
    }
  }

  // Use Resend if Gmail is not configured or failed
  if (!resend) {
    console.warn('Neither Gmail SMTP nor Resend API key configured. Email not sent.')
    return
  }

  try {
    // Use RESEND_FROM_EMAIL if set, otherwise use default
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Secret Santa <onboarding@resend.dev>'
    
    await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: 'Your Secret Santa Assignment',
      html: emailHtml,
    })
  } catch (error) {
    console.error('Failed to send email via Resend:', error)
    throw error
  }
}

export async function sendAssignmentSMS(
  recipientPhone: string,
  recipientName: string,
  assignedName: string
): Promise<void> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio not configured. SMS not sent.')
    return
  }

  try {
    await twilioClient.messages.create({
      body: `🎄 Secret Santa Assignment 🎄\n\nHi ${recipientName},\n\nYour Secret Santa assignment: ${assignedName}\n\nHappy gift giving! 🎁`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipientPhone,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
    throw error
  }
}

