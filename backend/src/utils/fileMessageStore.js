import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/messages.json");

const sampleMessages = [];

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(sampleMessages, null, 2));
  }
};

export const readMessages = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  return JSON.parse(content);
};

export const writeMessages = async (messages) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2));
};

export const createMessage = async (payload) => {
  const messages = await readMessages();
  const now = new Date().toISOString();
  const message = {
    _id: randomUUID(),
    ...payload,
    autoReplied: false,
    createdAt: now,
    updatedAt: now
  };
  messages.unshift(message);
  writeMessages(messages).catch((error) => {
    console.error("Could not save message to file store:", error.message);
  });
  return message;
};
