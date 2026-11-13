import { pgTable, serial, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  score: doublePrecision("score").notNull(),
  stage: text("stage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
