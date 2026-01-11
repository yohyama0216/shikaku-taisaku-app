import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, text as pgText, integer as pgInteger, timestamp } from 'drizzle-orm/pg-core';

// Determine if we're using SQLite or PostgreSQL based on environment
const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = !isProduction || process.env.USE_SQLITE === 'true';

// SQLite Schema
const questionProgressSQLite = sqliteTable('question_progress', {
  questionId: integer('question_id').primaryKey(),
  correctCount: integer('correct_count').notNull().default(0),
  incorrectCount: integer('incorrect_count').notNull().default(0),
  lastAttemptCorrect: integer('last_attempt_correct', { mode: 'boolean' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const dailyStatsSQLite = sqliteTable('daily_stats', {
  date: text('date').primaryKey(), // YYYY-MM-DD format
  answeredCount: integer('answered_count').notNull().default(0),
  masteredCount: integer('mastered_count').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const dailyActivitySQLite = sqliteTable('daily_activity', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // YYYY-MM-DD format
  examType: text('exam_type').notNull(),
  questionsAnswered: integer('questions_answered').notNull().default(0),
  correctAnswers: integer('correct_answers').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const badgeProgressSQLite = sqliteTable('badge_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  badgeId: text('badge_id').notNull().unique(),
  achievedDate: text('achieved_date').notNull(), // ISO date string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const userPreferencesSQLite = sqliteTable('user_preferences', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// PostgreSQL Schema (for Neon)
const questionProgressPG = pgTable('question_progress', {
  questionId: pgInteger('question_id').primaryKey(),
  correctCount: pgInteger('correct_count').notNull().default(0),
  incorrectCount: pgInteger('incorrect_count').notNull().default(0),
  lastAttemptCorrect: pgInteger('last_attempt_correct').notNull(), // 0 or 1
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const dailyStatsPG = pgTable('daily_stats', {
  date: pgText('date').primaryKey(), // YYYY-MM-DD format
  answeredCount: pgInteger('answered_count').notNull().default(0),
  masteredCount: pgInteger('mastered_count').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const dailyActivityPG = pgTable('daily_activity', {
  id: pgInteger('id').primaryKey().generatedAlwaysAsIdentity(),
  date: pgText('date').notNull(), // YYYY-MM-DD format
  examType: pgText('exam_type').notNull(),
  questionsAnswered: pgInteger('questions_answered').notNull().default(0),
  correctAnswers: pgInteger('correct_answers').notNull().default(0),
  incorrectAnswers: pgInteger('incorrect_answers').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const badgeProgressPG = pgTable('badge_progress', {
  id: pgInteger('id').primaryKey().generatedAlwaysAsIdentity(),
  badgeId: pgText('badge_id').notNull().unique(),
  achievedDate: pgText('achieved_date').notNull(), // ISO date string
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const userPreferencesPG = pgTable('user_preferences', {
  key: pgText('key').primaryKey(),
  value: pgText('value').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export the appropriate schema based on environment
// Use type assertion to avoid union type issues
export const questionProgress = (useSQLite ? questionProgressSQLite : questionProgressPG) as typeof questionProgressSQLite;
export const dailyStats = (useSQLite ? dailyStatsSQLite : dailyStatsPG) as typeof dailyStatsSQLite;
export const dailyActivity = (useSQLite ? dailyActivitySQLite : dailyActivityPG) as typeof dailyActivitySQLite;
export const badgeProgress = (useSQLite ? badgeProgressSQLite : badgeProgressPG) as typeof badgeProgressSQLite;
export const userPreferences = (useSQLite ? userPreferencesSQLite : userPreferencesPG) as typeof userPreferencesSQLite;
