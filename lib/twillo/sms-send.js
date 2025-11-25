// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Send an SMS message via Twilio
 * @param {string} to - Phone number to send to (E.164 format)
 * @param {string} from - Twilio phone number to send from
 * @param {string} body - Message body
 * @returns {Promise<any>} - Twilio message object
 */
export async function sendSMS(to, from, body) {
  const message = await client.messages.create({
    body,
    from,
    to,
  });

  return message;
}
