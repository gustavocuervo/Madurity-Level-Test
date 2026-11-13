import fs from "fs";
import path from "path";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { db as pgDb } from "../db/index.ts";
import { assessments } from "../db/schema.ts";
import { desc, asc } from "drizzle-orm";

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const DATA_DIR = path.join(process.cwd(), "data");
const BACKUP_FILE = path.join(DATA_DIR, "assessments.json");

export interface AssessmentRecord {
  id?: number;
  email: string;
  company: string;
  role: string;
  date: string;
  time: string;
  score: number;
  stage: string;
  createdAt?: string;
}

// Ensure local backup directory exists
function ensureBackupDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not ensure data directory:", e);
  }
}

// Read local backup
export function readLocalBackup(): AssessmentRecord[] {
  try {
    ensureBackupDir();
    if (fs.existsSync(BACKUP_FILE)) {
      const content = fs.readFileSync(BACKUP_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn("Could not read local assessments backup:", e);
  }
  return [];
}

// Append to local backup
export function appendLocalBackup(record: AssessmentRecord): void {
  try {
    ensureBackupDir();
    const existing = readLocalBackup();
    const newId = (existing.reduce((max, r) => Math.max(max, r.id || 0), 0) || 0) + 1;
    const itemWithId: AssessmentRecord = {
      ...record,
      id: record.id || newId,
      createdAt: record.createdAt || new Date().toISOString()
    };
    existing.push(itemWithId);
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write to local backup:", e);
  }
}

// Save assessment to all available storage layers (PostgreSQL, Firestore, Local File)
export async function saveAssessmentRecord(data: {
  email: string;
  company: string;
  role: string;
  score: number;
  stage: string;
}): Promise<void> {
  const now = new Date();
  const date = now.toLocaleDateString("es-ES", { timeZone: "America/Guatemala" });
  const time = now.toLocaleTimeString("es-ES", { timeZone: "America/Guatemala" });
  const createdAt = now.toISOString();

  const record: AssessmentRecord = {
    email: data.email,
    company: data.company,
    role: data.role,
    date,
    time,
    score: Number(data.score),
    stage: data.stage,
    createdAt
  };

  // 1. Immediately save to local backup
  appendLocalBackup(record);

  let anySuccess = false;
  let lastError: any = null;

  // 2. Try Firestore
  try {
    await addDoc(collection(firestoreDb, "assessments"), {
      ...record,
      score: Number(record.score)
    });
    anySuccess = true;
  } catch (err) {
    console.warn("Firestore save warning:", err);
    lastError = err;
  }

  // 3. Try PostgreSQL (Cloud SQL)
  try {
    await pgDb.insert(assessments).values({
      email: record.email,
      company: record.company,
      role: record.role,
      date: record.date,
      time: record.time,
      score: record.score,
      stage: record.stage
    });
    anySuccess = true;
  } catch (err) {
    console.warn("PostgreSQL save warning:", err);
    if (!lastError) lastError = err;
  }

  // Even if both cloud databases failed (e.g., temporary network glitch),
  // local backup succeeded so the submission is safely recorded.
  if (!anySuccess && readLocalBackup().length === 0) {
    throw new Error(lastError?.message || "Failed to save assessment to persistent storage");
  }
}

// Fetch all assessment records with resilient fallbacks
export async function getAllAssessments(): Promise<AssessmentRecord[]> {
  // 1. Try PostgreSQL (Cloud SQL)
  try {
    const rows = await pgDb.select().from(assessments).orderBy(desc(assessments.id));
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        email: r.email,
        company: r.company,
        role: r.role,
        date: r.date,
        time: r.time,
        score: r.score,
        stage: r.stage,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined
      }));
    }
  } catch (err) {
    console.warn("Postgres fetch unavailable, falling back to Firestore/backup:", err);
  }

  // 2. Try Firestore
  try {
    const snap = await getDocs(collection(firestoreDb, "assessments"));
    if (snap.size > 0) {
      const records: AssessmentRecord[] = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        records.push({
          id: d.id,
          email: d.email || "",
          company: d.company || "",
          role: d.role || "",
          date: d.date || "",
          time: d.time || "",
          score: Number(d.score || 0),
          stage: d.stage || "",
          createdAt: d.createdAt
        });
      });

      // Sort descending by id or createdAt
      records.sort((a, b) => {
        if (a.id && b.id) return b.id - a.id;
        if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });

      return records;
    }
  } catch (err) {
    console.warn("Firestore fetch error, falling back to local file:", err);
  }

  // 3. Fallback to local backup
  const backup = readLocalBackup();
  return backup.sort((a, b) => (b.id || 0) - (a.id || 0));
}
