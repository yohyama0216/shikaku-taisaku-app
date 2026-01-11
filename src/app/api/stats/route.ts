import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyStats, dailyActivity } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// GET: Get stats history or today's activity
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const examType = searchParams.get('examType');

    if (type === 'history') {
      // Get daily stats history
      const history = await db
        .select()
        .from(dailyStats)
        .orderBy(dailyStats.date);

      return NextResponse.json(history);
    } else if (type === 'activity') {
      // Get daily activity history
      const activities = await db
        .select()
        .from(dailyActivity)
        .orderBy(desc(dailyActivity.date));

      return NextResponse.json(activities);
    } else if (type === 'today' && examType) {
      // Get today's activity for specific exam type
      const today = getTodayDate();
      const activity = await db
        .select()
        .from(dailyActivity)
        .where(sql`${dailyActivity.date} = ${today} AND ${dailyActivity.examType} = ${examType}`)
        .limit(1);

      if (activity.length > 0) {
        return NextResponse.json(activity[0]);
      } else {
        return NextResponse.json({
          date: today,
          examType,
          questionsAnswered: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
        });
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
