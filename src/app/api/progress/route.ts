import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questionProgress, dailyStats, dailyActivity } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// GET: Get all progress or specific question progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get('questionId');

    if (questionId) {
      // Get specific question progress
      const progress = await db
        .select()
        .from(questionProgress)
        .where(eq(questionProgress.questionId, parseInt(questionId)))
        .limit(1);

      return NextResponse.json(progress[0] || null);
    } else {
      // Get all progress
      const allProgress = await db.select().from(questionProgress);
      
      // Convert to Record format for compatibility
      const progressMap: Record<number, any> = {};
      allProgress.forEach(p => {
        progressMap[p.questionId] = {
          questionId: p.questionId,
          correctCount: p.correctCount,
          incorrectCount: p.incorrectCount,
          lastAttemptCorrect: Boolean(p.lastAttemptCorrect),
        };
      });

      return NextResponse.json(progressMap);
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST: Save question progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, isCorrect, examType } = body;

    if (!questionId || typeof isCorrect !== 'boolean' || !examType) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Get existing progress
    const existing = await db
      .select()
      .from(questionProgress)
      .where(eq(questionProgress.questionId, questionId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      await db
        .update(questionProgress)
        .set({
          correctCount: existing[0].correctCount + (isCorrect ? 1 : 0),
          incorrectCount: existing[0].incorrectCount + (isCorrect ? 0 : 1),
          lastAttemptCorrect: isCorrect,
          updatedAt: new Date(),
        })
        .where(eq(questionProgress.questionId, questionId));
    } else {
      // Insert new progress
      await db.insert(questionProgress).values({
        questionId,
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        lastAttemptCorrect: isCorrect,
      });
    }

    // Update daily stats
    await updateDailyStats();

    // Update daily activity
    await updateDailyActivity(isCorrect, examType);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

// DELETE: Clear all progress
export async function DELETE() {
  try {
    await db.delete(questionProgress);
    await db.delete(dailyStats);
    await db.delete(dailyActivity);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing progress:', error);
    return NextResponse.json({ error: 'Failed to clear progress' }, { status: 500 });
  }
}

// Helper function to update daily stats
async function updateDailyStats() {
  const today = getTodayDate();
  
  // Get all progress
  const allProgress = await db.select().from(questionProgress);
  const answeredCount = allProgress.length;
  const masteredCount = allProgress.filter(p => p.correctCount >= 4).length;

  // Check if today's stats exist
  const existing = await db
    .select()
    .from(dailyStats)
    .where(eq(dailyStats.date, today))
    .limit(1);

  if (existing.length > 0) {
    // Update existing stats
    await db
      .update(dailyStats)
      .set({
        answeredCount,
        masteredCount,
        updatedAt: new Date(),
      })
      .where(eq(dailyStats.date, today));
  } else {
    // Insert new stats
    await db.insert(dailyStats).values({
      date: today,
      answeredCount,
      masteredCount,
    });
  }

  // Clean up old stats (keep last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

  await db.delete(dailyStats).where(sql`${dailyStats.date} < ${cutoffDate}`);
}

// Helper function to update daily activity
async function updateDailyActivity(isCorrect: boolean, examType: string) {
  const today = getTodayDate();

  // Check if today's activity for this exam type exists
  const existing = await db
    .select()
    .from(dailyActivity)
    .where(sql`${dailyActivity.date} = ${today} AND ${dailyActivity.examType} = ${examType}`)
    .limit(1);

  if (existing.length > 0) {
    // Update existing activity
    await db
      .update(dailyActivity)
      .set({
        questionsAnswered: existing[0].questionsAnswered + 1,
        correctAnswers: existing[0].correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: existing[0].incorrectAnswers + (isCorrect ? 0 : 1),
        updatedAt: new Date(),
      })
      .where(eq(dailyActivity.id, existing[0].id));
  } else {
    // Insert new activity
    await db.insert(dailyActivity).values({
      date: today,
      examType,
      questionsAnswered: 1,
      correctAnswers: isCorrect ? 1 : 0,
      incorrectAnswers: isCorrect ? 0 : 1,
    });
  }

  // Clean up old activities (keep last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

  await db.delete(dailyActivity).where(sql`${dailyActivity.date} < ${cutoffDate}`);
}
