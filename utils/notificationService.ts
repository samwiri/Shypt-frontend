import { OrderStatus } from '../types';

/**
 * Notification Service Utility
 * 
 * ⚠️ DEVELOPER NOTE:
 * This file currently mocks the notification behavior by logging to the console.
 * For Production, replace the `console.log` calls with API requests to your notification provider.
 * 
 * Recommended Providers:
 * - Email: SendGrid, AWS SES, or Postmark.
 * - SMS: Twilio, Africa's Talking (for Uganda/Kenya coverage).
 * - WhatsApp: Twilio or Meta Business API.
 */

interface NotificationPayload {
  recipientEmail: string;
  recipientPhone: string;
  orderId: string;
  newStatus: OrderStatus;
  extraData?: string;
}

export const sendStatusNotification = (payload: NotificationPayload) => {
  const timestamp = new Date().toLocaleTimeString();
  
  // Logic to determine message content based on status
  let emailSubject = '';
  let emailBody = '';
  let smsBody = '';

  switch (payload.newStatus) {
    case OrderStatus.RECEIVED:
      emailSubject = `Package Received: ${payload.orderId}`;
      emailBody = `We have received your package at our origin warehouse. We will notify you when it is consolidated for shipping.`;
      smsBody = `OMS: Pkg ${payload.orderId} received at warehouse.`;
      break;
    case OrderStatus.IN_TRANSIT:
      emailSubject = `Shipment Departed: ${payload.orderId}`;
      emailBody = `Your package has departed origin via ${payload.extraData || 'Air Freight'}. Tracking is now active.`;
      smsBody = `OMS: Pkg ${payload.orderId} has departed. Track online.`;
      break;
    case OrderStatus.ARRIVED:
      emailSubject = `Arrival Notice: ${payload.orderId}`;
      emailBody = `Your package has arrived in Uganda. It is currently undergoing URA Customs Verification.`;
      smsBody = `OMS: Pkg ${payload.orderId} arrived in UG. Pending Customs.`;
      break;
    case OrderStatus.RELEASED:
      emailSubject = `Ready for Pickup: ${payload.orderId}`;
      emailBody = `Good news! Your package has cleared customs and is ready for pickup/delivery. Please pay outstanding invoices.`;
      smsBody = `OMS: Pkg ${payload.orderId} READY for pickup.`;
      break;
    default:
      return; // No notification for minor updates
  }

  // 1. Log to Console (Dev Mode)
  console.groupCollapsed(`[Notification System] Sending to ${payload.recipientEmail}`);
  console.log('Timestamp:', timestamp);
  console.log('Channel: EMAIL & SMS');
  console.log('Subject:', emailSubject);
  console.log('Body:', emailBody);
  console.log('Payload:', payload);
  console.groupEnd();

  // TODO: PRODUCTION INTEGRATION EXAMPLE
  /*
  await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.SENDGRID_KEY}` },
      body: JSON.stringify({
          personalizations: [{ to: [{ email: payload.recipientEmail }] }],
          subject: emailSubject,
          content: [{ type: 'text/plain', value: emailBody }]
      })
  });
  */

  // 2. Return the message so the UI can toast it if needed
  return {
    success: true,
    message: `Notification sent to client for ${payload.newStatus}`
  };
};