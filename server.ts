import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import {
  saveAssessmentRecord,
  getAllAssessments,
  type AssessmentRecord
} from "./src/lib/storage.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/save-assessment", async (req, res) => {
    const { email, company, role, score, stage } = req.body;

    try {
      await saveAssessmentRecord({
        email,
        company,
        role,
        score: Number(score),
        stage
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Save Error:", error);
      res.status(500).json({ error: error.message || "Failed to save assessment" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { user, password } = req.body;
    const cleanUser = user?.trim();
    const cleanPass = password?.trim();

    if (cleanUser === "admin" && cleanPass === "dominogbm") {
      res.json({ success: true, token: "fake-jwt-token" });
    } else {
      console.log(`Failed login attempt for user: ${cleanUser}`);
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/data", async (req, res) => {
    try {
      const data = await getAllAssessments();
      res.json(data);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch data" });
    }
  });

  app.post("/api/admin/clear", (req, res) => {
    // Disabled to guarantee data is NEVER deleted
    res.status(403).json({ error: "La eliminación de registros está deshabilitada en esta base de datos para garantizar la persistencia de los datos." });
  });

  app.get("/api/admin/csv", async (req, res) => {
    try {
      const rows = await getAllAssessments();

      if (!rows || rows.length === 0) {
        return res.status(404).send("No data available");
      }

      // Sort ascending for CSV export
      const sortedRows = [...rows].reverse();

      const headers = ["eMail", "Company", "Role", "Date", "Time", "Score", "Stage"];
      const csvContent = [
        "\ufeff" + headers.join(";"),
        ...sortedRows.map((row: AssessmentRecord) => [
          row.email,
          row.company,
          row.role,
          row.date,
          row.time,
          row.score,
          row.stage
        ].join(";"))
      ].join("\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=assessments.csv");
      res.send(csvContent);
    } catch (error) {
      console.error("CSV Gen Error:", error);
      res.status(500).send("Error generating CSV");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
