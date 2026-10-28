import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logDir, "error.txt");

export async function errorHandler(err, req, res, next) {
    const logEntry = `Error: ${err.message}\n`;
    try {
        await appendFile(logFile, logEntry, "utf-8");
    } catch (error) {
        console.error("Failed to write to log file:", error);
    }

    if (res.headersSent) {
        return next(err);
    }
    
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
    });
}