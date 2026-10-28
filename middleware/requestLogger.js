import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logDir, "requests.txt");

export async function requestLogger(req, res, next) {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();

    const logEntry = `${method} · ${url} · ${timestamp}\n`;

    try {
        await appendFile(logFile, logEntry, "utf-8");
        next();
    } catch (error) {
        next(error);
    }
}