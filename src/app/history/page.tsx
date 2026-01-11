'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DailyActivity } from '@/types/quiz';
import { getDailyActivityHistory } from '@/utils/storageDB';

export default function HistoryPage() {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await getDailyActivityHistory();
    setActivities(data);
  };

  if (!mounted) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
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
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">学習履歴</h1>
          <p className="text-muted">直近1ヶ月の学習記録を表示しています</p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted small">学習日数</h5>
              <p className="card-text h3">{activities.length}</p>
              <small className="text-muted">日</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted small">合計回答数</h5>
              <p className="card-text h3">{totalQuestions}</p>
              <small className="text-muted">問</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted small">正解数</h5>
              <p className="card-text h3 text-success">{totalCorrect}</p>
              <small className="text-muted">問</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted small">正答率</h5>
              <p className="card-text h3 text-primary">{overallAccuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">日別の学習記録</h2>
              {activities.length === 0 ? (
                <div className="alert alert-info">
                  <p className="mb-0">まだ学習記録がありません。クイズに挑戦して記録を作りましょう！</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>日付</th>
                        <th className="text-center">回答数</th>
                        <th className="text-center">正解</th>
                        <th className="text-center">不正解</th>
                        <th className="text-center">正答率</th>
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
                            <td className="text-center">
                              <strong>{activity.questionsAnswered}</strong>問
                            </td>
                            <td className="text-center text-success">
                              <strong>{activity.correctAnswers}</strong>
                            </td>
                            <td className="text-center text-danger">
                              <strong>{activity.incorrectAnswers}</strong>
                            </td>
                            <td className="text-center">
                              <span className={`badge ${
                                parseFloat(accuracy) >= 80 ? 'bg-success' : 
                                parseFloat(accuracy) >= 60 ? 'bg-primary' : 
                                parseFloat(accuracy) >= 40 ? 'bg-warning' : 
                                'bg-danger'
                              }`}>
                                {accuracy}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <Link href="/" className="btn btn-primary btn-lg w-100">
            ホームに戻る
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <Link href="/stats" className="btn btn-info btn-lg w-100">
            統計を表示
          </Link>
        </div>
      </div>
    </main>
  );
}
