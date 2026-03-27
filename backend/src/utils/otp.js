// Updating nodemailer createTransporter to createTransport
const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        // configuration details
    });
};

function sendOTP(phone, type) {
    if (type === 'WHATSAPP') {
        const transporter = createTransporter();
        const message = getWhatsAppMessage(phone);
        return transporter.sendMail({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${phone}`,
            body: message
        });
    } else {
        // existing logic for SMS
    }
}

function getWhatsAppMessage(phone) {
    const smsMessage = 'Your OTP is: ...'; // reuse SMS message
    return smsMessage;
}

module.exports = { sendOTP, createTransporter };