import fs from "fs";
import {
  insertDocuments,
  countDocuments,
  deleteTable,
  TABLE_NAME,
} from "./lanceClient.js";
import path from "path";
import { fileURLToPath } from "url";
import { embedTexts } from "./embeddingService.js";
import {
  chunkText,
  loadDatasetFromFile,
  medicineEntryToText,
  normalizeMedicineEntry,
} from "./medicineDatasetMapper.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHECKPOINT_FILE = path.join(
  __dirname,
  "../../storage/ingest_checkpoint.json"
);

function loadCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_FILE)) {
    return 0;
  }

  const data = JSON.parse(
    fs.readFileSync(CHECKPOINT_FILE, "utf8")
  );

  return data.lastProcessed || 0;
}

function saveCheckpoint(index) {
  fs.writeFileSync(
    CHECKPOINT_FILE,
    JSON.stringify(
      { lastProcessed: index },
      null,
      2
    )
  );
}

function clearCheckpoint() {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    fs.unlinkSync(CHECKPOINT_FILE);
  }
}

const stableId = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);

export const ingestMedicineDatasetToLance = async (
  entries,
  { clearExisting = false, batchSize = 50, resume = false } = {}
) => {
  if (!Array.isArray(entries) || !entries.length) {
    throw new Error("Dataset must be a non-empty array of medicine objects");
  }

  if (clearExisting) {
    await deleteTable();
    clearCheckpoint();
  }

  const startIndex = resume ? loadCheckpoint() : 0;

  const results = { chunks: 0, medicines: 0, skipped: 0, errors: [] };
  let batch = [];

  const flush = async (currentIndex) => {
    if (!batch.length) return true;

    try {  
         const embeddings = await embedTexts(batch.map((item) => item.text));

    
   const rows = batch.map((item, index) => ({
    id: item.id,
    text: item.text,
    vector: embeddings[index],

    medicineId: item.metadata.medicineId,
    medicineName: item.metadata.name,
    genericName: item.metadata.genericName,
    category: item.metadata.category,
    drugClass: item.metadata.drugClass,
    source: item.metadata.source,
    chunkIndex: item.metadata.chunkIndex,
}));

    if (embeddings.length !== batch.length) {
  throw new Error("Embedding count mismatch");
}
    await insertDocuments(rows);
    saveCheckpoint(currentIndex);

    results.chunks += batch.length;
    batch = [];

    return true;
}
catch(err){
       const message = err.message || "";

    if (
        message.includes("429") ||                                                                                                                                                                                                                                                                        
        message.includes("RESOURCE_EXHAUSTED")
    ) {

        console.log("Gemini quota exhausted.");
        console.log(`Stopping ingestion.`);

        return false;
    }
        throw err ;
  }
  };
   let quotaExceeded = false;
  for (let i = startIndex; i < entries.length; i++) {
    const raw = entries[i];
    try {
      const medicine = normalizeMedicineEntry(raw);
      if (!medicine.name) {
        results.skipped += 1;
        continue;
      }

      const baseText = medicineEntryToText(medicine);
      const chunks = chunkText(baseText);
      const medicineId = stableId(`${medicine.id || medicine.name}-${medicine.name}`);

      chunks.forEach((text, index) => {
        batch.push({
          id: `${medicineId}-${index}`,
          text,
          metadata: {
            medicineId,
            name: medicine.name,
            genericName: medicine.genericName || "",
            category: medicine.category || "",
            drugClass: medicine.drugClass || "",
            source: "medicine_dataset_csv",
            chunkIndex: index,
          },
        });
      });

      results.medicines += 1;

      if (batch.length >= batchSize) {
        const success = await flush(i+1);
        if (success === false) {
          quotaExceeded = true;
          break;
      }
      }
    } catch (err) {
      results.errors.push({ name: raw.name, error: err.message });
    }
  }
if (!quotaExceeded) {
    await flush(entries.length);
}
  results.tableCount = await countDocuments();
  results.tableName = TABLE_NAME;
  return results;
};

export { loadDatasetFromFile };

export const getDefaultDatasetPath = () =>
  path.join(__dirname, "../../data/medicine_dataset.csv");

export const getLanceStats = async () => {
  const count = await countDocuments();
  return { 
    table: "medicine_knowledge",
    count,
   };
};
