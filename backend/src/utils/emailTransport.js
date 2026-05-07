import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = process.env.SMTP_PORT || process.env.MAIL_PORT;
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
  const secure = process.env.SMTP_SECURE === "true" || process.env.MAIL_SECURE === "true";

  if (!host || !port || !user || !pass) {
    console.warn("⚠️  Email transport not configured. Check SMTP env vars:", {
      host: !!host,
      port: !!port,
      user: !!user,
      pass: !!pass
    });
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth: {
      user,
      pass
    }
  });
};

export const sendAutoReply = async ({ to, toName, from, body }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("❌ Email transporter not initialized. Skipping auto-reply to", to);
    return null;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM || from;
  const subject = process.env.AUTO_REPLY_SUBJECT || "Thanks for contacting me";
  const text = body;

  try {
    const result = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html: `<p>Hi ${toName || "there"},</p><p>${body.replace(/\n/g, "<br />")}</p><p>Thanks for reaching out.</p>`
    });
    console.log("✅ Auto-reply sent to", to, "Message ID:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Failed to send auto-reply to", to, "Error:", error.message);
    throw error;
  }
};
