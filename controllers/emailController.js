import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (req, res) => {
  const { clientEmail, subject, text } = req.body;

  if (!clientEmail || !subject || !text) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email sent successfully!' });
      }
    });
  } catch (error) {
    console.log('Error in sending email:', error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
