import { Resend } from 'resend'
import twilio from 'twilio'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function sendAssignmentEmails(
  recipientEmail: string,
  recipientName: string,
  assignedName: string
): Promise<void> {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return
  }

  try {
    await resend.emails.send({
      from: 'Secret Santa <onboarding@resend.dev>', // Update with your verified domain
      to: recipientEmail,
      subject: 'Your Secret Santa Assignment',
      html: `
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
      `,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
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

