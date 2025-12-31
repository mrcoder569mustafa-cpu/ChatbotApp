import dotenv from "dotenv";
import { createTransport } from "nodemailer";
import path from "path";

// Ensure .env loads from backend root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("EMAIL:", process.env.GMAIL);
console.log("PASS:", process.env.PASSWORD ? "FOUND" : "MISSING");

const sendMail = async (email, subject, otp) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // ✅ important for port 465
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>OTP Verification</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f4f6f8;
    padding: 20px;
  }
  .container {
    background: #ffffff;
    max-width: 420px;
    margin: auto;
    padding: 25px;
    border-radius: 8px;
    text-align: center;
  }
  h1 {
    color: #e63946;
  }
  .otp {
    font-size: 32px;
    font-weight: bold;
    color: #7b68ee;
    margin: 20px 0;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Hello <b>${email}</b>, your One-Time Password is:</p>
    <div class="otp">${otp}</div>
    <p>This OTP is valid for 5 minutes.</p>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
