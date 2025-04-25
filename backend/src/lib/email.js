import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Create a more robust Gmail transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS, // This should be an app password for Gmail
  },
  tls: {
    rejectUnauthorized: false // Do not fail on invalid certs
  }
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

export default transporter;
