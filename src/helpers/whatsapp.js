const twilio = require('twilio');
const { logConsole, logFile } = require('./loggers');

const twilioNum = process.env.TWILIO_NUMBER.toString();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsapp = async (phoneNumber, body) => {
  try {
    const message = await client.messages
      .create({
        from: `whatsapp:${twilioNum}`,
        to: `whatsapp:${phoneNumber}`,
        body
      })

    logConsole.info('Twilio | ', message.status, '//', message.body)
  } catch (error) {
    logConsole.error(`Error al mandar whatsapp con Twilio - ${error}`)
    logFile.error(`Error al mandar whatsapp con Twilio - ${error}`)
  }

  // .then(message => logConsole.info(message.status, '//', message.body));
}
module.exports = sendWhatsapp;
