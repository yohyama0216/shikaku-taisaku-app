#!/usr/bin/env node

/**
 * Database initialization script for local SQLite database
 * This script creates the necessary tables for local development
 */

import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || 'local.db';

console.log('Initializing local SQLite database...');
console.log(`Database path: ${dbPath}`);

try {
  const sqlite = new Database(dbPath);

  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS question_progress (
      question_id INTEGER PRIMARY KEY,
      correct_count INTEGER NOT NULL DEFAULT 0,
      incorrect_count INTEGER NOT NULL DEFAULT 0,
      last_attempt_correct INTEGER NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      answered_count INTEGER NOT NULL DEFAULT 0,
      mastered_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS daily_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      exam_type TEXT NOT NULL,
      questions_answered INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      incorrect_answers INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS badge_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      badge_id TEXT NOT NULL UNIQUE,
      achieved_date TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  console.log('✓ Database tables created successfully');
  sqlite.close();
  console.log('✓ Database initialization complete');
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
}
