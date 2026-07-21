import { EmailService } from "./src/shared/email/index.js";

try {
  await EmailService.sendMail({
    to: "devendradangi9174@gmail.com", // your email
    subject: "SFA Backend SMTP Test",
    html: `
      <h2>SMTP Working ✅</h2>
      <p>Your SFA Backend can now send emails.</p>
    `,
  });

  console.log("✅ Test email sent successfully!");
} catch (error) {
  console.error("❌ Failed to send email");
  console.error(error);
}