import Message from "../models/Message.js";
import { createMessage as createFileMessage, readMessages, writeMessages } from "../utils/fileMessageStore.js";
import { sendAutoReply } from "../utils/emailTransport.js";

const normalizeMessage = (body) => ({
  name: typeof body.name === "string" ? body.name.trim() : "",
  email: typeof body.email === "string" ? body.email.trim() : "",
  countryCode: typeof body.countryCode === "string" ? body.countryCode.trim() : "",
  phone: typeof body.phone === "string" ? body.phone.trim() : "",
  message: typeof body.message === "string" ? body.message.trim() : "",
  subject: typeof body.subject === "string" ? body.subject.trim() : ""
});

const markAutoReplied = async (messageId) => {
  if (process.env.DB_MODE === "file") {
    const messages = await readMessages();
    const messageIndex = messages.findIndex((message) => message._id === messageId);
    if (messageIndex !== -1) {
      messages[messageIndex].autoReplied = true;
      await writeMessages(messages);
    }
    return;
  }

  await Message.findByIdAndUpdate(messageId, { autoReplied: true });
};

export const getMessages = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const messages = await readMessages();
      return res.json(messages);
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const payload = normalizeMessage(req.body);
    if (!payload.name || !payload.email || !payload.message) {
      res.status(400);
      throw new Error("Name, email, and message are required");
    }

    const savedMessage =
      process.env.DB_MODE === "file"
        ? await createFileMessage(payload)
        : await Message.create(payload);

    res.status(201).json(savedMessage);

    const adminEmail = process.env.ADMIN_EMAIL;
    const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM || adminEmail;

    if (payload.email && fromAddress) {
      const replyBody =
        process.env.AUTO_REPLY_BODY ||
        `Thanks for contacting us. I received your message and will respond soon.`;

      try {
        await sendAutoReply({
          to: payload.email,
          toName: payload.name,
          from: fromAddress,
          body: replyBody
        });

        await markAutoReplied(savedMessage._id);
      } catch (emailError) {
        console.error("Auto-reply email failed:", emailError.message);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const messages = await readMessages();
      const filtered = messages.filter((message) => message._id !== req.params.id);
      if (filtered.length === messages.length) {
        res.status(404);
        throw new Error("Message not found");
      }
      await writeMessages(filtered);
      return res.json({ message: "Message deleted" });
    }

    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    res.json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
