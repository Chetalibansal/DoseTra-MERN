import fs from "fs";
import path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, "..", "storage");
const VECTOR_DIR = path.join(STORAGE_DIR, "medicine_vectors");
const ZIP_PATH = path.join(STORAGE_DIR, "medicine_vectors.zip");

export const downloadMedicineVectors = async () => {
    // Already downloaded
    if (fs.existsSync(VECTOR_DIR)) {
        console.log("✅ Medicine vectors already exist.");
        return;
    }

    // URL not configured
    if (!process.env.MEDICINE_DB_URL) {
        throw new Error("MEDICINE_DB_URL is not defined.");
    }

    fs.mkdirSync(STORAGE_DIR, { recursive: true });

    try {
        console.log("📥 Downloading medicine vectors...");

        const response = await axios({
            method: "GET",
            url: process.env.MEDICINE_DB_URL,
            responseType: "stream",
        });

        const writer = fs.createWriteStream(ZIP_PATH);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log("📦 Extracting medicine vectors...");

        const zip = new AdmZip(ZIP_PATH);

        zip.extractAllTo(STORAGE_DIR, true);

        console.log("🗑️ Cleaning up...");

        fs.unlinkSync(ZIP_PATH);

        console.log("✅ Medicine vectors ready.");
    } catch (error) {
        console.error("❌ Failed to prepare medicine vectors.");
        console.error(error.message);

        // Remove partially downloaded ZIP
        if (fs.existsSync(ZIP_PATH)) {
            fs.unlinkSync(ZIP_PATH);
        }

        // Remove partially extracted folder
        if (fs.existsSync(VECTOR_DIR)) {
            fs.rmSync(VECTOR_DIR, {
                recursive: true,
                force: true,
            });
        }

        throw error;
    }
};