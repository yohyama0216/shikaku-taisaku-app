'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DailyActivity } from '@/types/quiz';
import { getDailyActivityHistory } from '@/utils/storage';

export default function HistoryPage() {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadActivities();
  }, []);

  const loadActivities = () => {
    const data = getDailyActivityHistory();
    setActivities(data);
  };

  if (!mounted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p aria-busy="true">読み込み中...</p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日（${weekday}）`;
  };

  // Calculate total stats
  const totalQuestions = activities.reduce((sum, a) => sum + a.questionsAnswered, 0);
  const totalCorrect = activities.reduce((sum, a) => sum + a.correctAnswers, 0);
  const totalIncorrect = activities.reduce((sum, a) => sum + a.incorrectAnswers, 0);
  const overallAccuracy = totalQuestions > 0 
    ? ((totalCorrect / (totalCorrect + totalIncorrect)) * 100).toFixed(1) 
    : '0';

  return (
    <>
      <hgroup>
        <h2>学習履歴</h2>
        <p>直近1ヶ月の学習記録を表示しています</p>
      </hgroup>

      {/* Summary Statistics */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '2rem' }}>
        <article style={{ textAlign: 'center' }}>
          <header><small>学習日数</small></header>
          <h3>{activities.length}</h3>
          <small style={{ color: 'var(--muted-color)' }}>日</small>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>合計回答数</small></header>
          <h3>{totalQuestions}</h3>
          <small style={{ color: 'var(--muted-color)' }}>問</small>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>正解数</small></header>
          <h3 style={{ color: '#28a745' }}>{totalCorrect}</h3>
          <small style={{ color: 'var(--muted-color)' }}>問</small>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>正答率</small></header>
          <h3 style={{ color: 'var(--primary)' }}>{overallAccuracy}%</h3>
        </article>
      </div>

      {/* Daily Activity Table */}
      <article style={{ marginBottom: '2rem' }}>
        <header><h3>日別の学習記録</h3></header>
        {activities.length === 0 ? (
          <div className="alert alert-info">
            <p style={{ marginBottom: 0 }}>まだ学習記録がありません。クイズに挑戦して記録を作りましょう！</p>
          </div>
        ) : (
          <figure>
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th style={{ textAlign: 'center' }}>回答数</th>
                  <th style={{ textAlign: 'center' }}>正解</th>
                  <th style={{ textAlign: 'center' }}>不正解</th>
                  <th style={{ textAlign: 'center' }}>正答率</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const total = activity.correctAnswers + activity.incorrectAnswers;
                  const accuracy = total > 0 
                    ? ((activity.correctAnswers / total) * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <tr key={activity.date}>
                      <td>{formatDate(activity.date)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <strong>{activity.questionsAnswered}</strong>問
                      </td>
                      <td style={{ textAlign: 'center', color: '#28a745' }}>
                        <strong>{activity.correctAnswers}</strong>
                      </td>
                      <td style={{ textAlign: 'center', color: '#dc3545' }}>
                        <strong>{activity.incorrectAnswers}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${
                          parseFloat(accuracy) >= 80 ? 'badge-success' : 
                          parseFloat(accuracy) >= 60 ? 'badge-primary' : 
                          parseFloat(accuracy) >= 40 ? 'badge-warning' : 
                          'badge-danger'
                        }`}>
                          {accuracy}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </figure>
        )}
      </article>

      {/* Action Buttons */}
      <div className="grid grid-2">
        <Link href="/" role="button">
          ホームに戻る
        </Link>
        <Link href="/stats" role="button" className="secondary">
          統計を表示
        </Link>
      </div>
    </>
  );
}
