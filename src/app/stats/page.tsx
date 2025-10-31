'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import questionsData from '@/data/questions.json';
import { Question, QuestionProgress, DailyStats, Badge } from '@/types/quiz';
import { getAllProgress, clearAllProgress, getDailyStatsHistory } from '@/utils/storage';
import { getAllBadges, getBadgeStats } from '@/utils/badges';

const questions = questionsData as Question[];

export default function StatsPage() {
  const [progress, setProgress] = useState<Record<number, QuestionProgress>>({});
  const [statsHistory, setStatsHistory] = useState<DailyStats[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProgress();
  }, []);

  const loadProgress = () => {
    const data = getAllProgress();
    setProgress(data);
    const history = getDailyStatsHistory();
    setStatsHistory(history);
    
    // Load badges
    const totalAnswered = Object.keys(data).length;
    const totalMastered = Object.values(data).filter(p => p.correctCount >= 4).length;
    const allBadges = getAllBadges(totalAnswered, totalMastered, history);
    setBadges(allBadges);
  };

  const handleClearProgress = () => {
    if (confirm('すべての学習進捗を削除してもよろしいですか？')) {
      clearAllProgress();
      loadProgress();
    }
  };

  if (!mounted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p aria-busy="true">読み込み中...</p>
      </div>
    );
  }

  const totalAnswered = Object.keys(progress).length;
  const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalIncorrect = Object.values(progress).reduce((sum, p) => sum + p.incorrectCount, 0);
  const totalAttempts = totalCorrect + totalIncorrect;

  // Get questions with incorrect answers
  const incorrectQuestions = questions
    .filter(q => progress[q.id] && progress[q.id].incorrectCount > 0)
    .map(q => ({
      question: q,
      progress: progress[q.id],
    }))
    .sort((a, b) => b.progress.incorrectCount - a.progress.incorrectCount);

  // Get mastered questions (4+ correct)
  const masteredQuestions = questions
    .filter(q => progress[q.id] && progress[q.id].correctCount >= 4)
    .length;

  // Calculate accuracy
  const accuracy = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : '0';

  // Category statistics
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const categoryStats = categories.map(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryAnswered = categoryQuestions.filter(q => progress[q.id]).length;
    const categoryCorrect = categoryQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.correctCount || 0),
      0
    );
    const categoryIncorrect = categoryQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.incorrectCount || 0),
      0
    );
    const categoryTotal = categoryCorrect + categoryIncorrect;
    const categoryAccuracy = categoryTotal > 0 ? ((categoryCorrect / categoryTotal) * 100).toFixed(1) : '0';

    return {
      category,
      totalQuestions: categoryQuestions.length,
      answered: categoryAnswered,
      correct: categoryCorrect,
      incorrect: categoryIncorrect,
      accuracy: categoryAccuracy,
    };
  });

  // Helper function to get difficulty label
  const getDifficultyLabel = (difficulty: string): string => {
    if (difficulty === 'basic') return '基本レベル';
    if (difficulty === 'exam') return '試験レベル';
    return difficulty;
  };

  // Difficulty level statistics
  const difficulties = Array.from(new Set(questions.map(q => q.difficulty).filter((d): d is NonNullable<typeof d> => d !== undefined)));
  const difficultyStats = difficulties.map(difficulty => {
    const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
    const difficultyAnswered = difficultyQuestions.filter(q => progress[q.id]).length;
    const difficultyCorrect = difficultyQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.correctCount || 0),
      0
    );
    const difficultyIncorrect = difficultyQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.incorrectCount || 0),
      0
    );
    const difficultyTotal = difficultyCorrect + difficultyIncorrect;
    const difficultyAccuracy = difficultyTotal > 0 ? ((difficultyCorrect / difficultyTotal) * 100).toFixed(1) : '0';

    return {
      difficulty,
      totalQuestions: difficultyQuestions.length,
      answered: difficultyAnswered,
      correct: difficultyCorrect,
      incorrect: difficultyIncorrect,
      accuracy: difficultyAccuracy,
    };
  });

  return (
    <>
      <h2>学習統計</h2>

      {/* Overall Statistics */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <article style={{ textAlign: 'center' }}>
          <header><small>回答済み問題数</small></header>
          <h3>{totalAnswered}</h3>
          <small style={{ color: 'var(--muted-color)' }}>/ {questions.length}問</small>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>正解数</small></header>
          <h3 style={{ color: '#28a745' }}>{totalCorrect}</h3>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>不正解数</small></header>
          <h3 style={{ color: '#dc3545' }}>{totalIncorrect}</h3>
        </article>
        <article style={{ textAlign: 'center' }}>
          <header><small>正答率</small></header>
          <h3 style={{ color: 'var(--primary)' }}>{accuracy}%</h3>
        </article>
      </div>

      {/* Mastered Questions */}
      <article className="alert alert-info" style={{ marginBottom: '2rem' }}>
        <header><strong>マスター済み問題</strong></header>
        <p style={{ marginBottom: 0 }}>
          4回以上正解した問題：<strong>{masteredQuestions}</strong>問
          {masteredQuestions > 0 && '（これらの問題は今後表示されません）'}
        </p>
      </article>

      {/* Badges Section */}
      <article style={{ marginBottom: '2rem' }}>
        <header><h3>バッジ</h3></header>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
          {badges.map(badge => (
            <div 
              key={badge.id}
              style={{ 
                textAlign: 'center', 
                padding: '1rem',
                border: `2px solid ${badge.achieved ? '#28a745' : 'var(--muted-border-color)'}`,
                borderRadius: 'var(--border-radius)',
                opacity: badge.achieved ? 1 : 0.5,
                background: 'var(--card-background-color)'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginTop: '0.5rem' }}>{badge.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-color)' }}>{badge.description}</div>
              {badge.achieved && (
                <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '0.5rem' }}>達成済み</span>
              )}
            </div>
          ))}
        </div>
        <small style={{ color: 'var(--muted-color)', marginTop: '1rem', display: 'block' }}>
          獲得バッジ数：<strong>{badges.filter(b => b.achieved).length}</strong> / {badges.length}
        </small>
      </article>

      {/* Statistics Trend Chart */}
      {statsHistory.length > 0 && (
        <article style={{ marginBottom: '2rem' }}>
          <header><h3>学習の推移</h3></header>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="answeredCount" 
                stroke="#0d6efd" 
                name="回答済み問題数" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="masteredCount" 
                stroke="#198754" 
                name="達成済み問題数" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </article>
      )}

      {/* Difficulty Level Statistics */}
      <article style={{ marginBottom: '2rem' }}>
        <header><h3>レベル別統計</h3></header>
        <figure>
          <table>
            <thead>
              <tr>
                <th>レベル</th>
                <th style={{ textAlign: 'center' }}>回答済み</th>
                <th style={{ textAlign: 'center' }}>正解数</th>
                <th style={{ textAlign: 'center' }}>不正解数</th>
                <th style={{ textAlign: 'center' }}>正答率</th>
              </tr>
            </thead>
            <tbody>
              {difficultyStats.map(stat => (
                <tr key={stat.difficulty}>
                  <td>{getDifficultyLabel(stat.difficulty)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {stat.answered} / {stat.totalQuestions}
                  </td>
                  <td style={{ textAlign: 'center', color: '#28a745' }}>{stat.correct}</td>
                  <td style={{ textAlign: 'center', color: '#dc3545' }}>{stat.incorrect}</td>
                  <td style={{ textAlign: 'center' }}>
                    <strong>{stat.accuracy}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </article>

      {/* Category Statistics */}
      <article style={{ marginBottom: '2rem' }}>
        <header><h3>カテゴリ別統計</h3></header>
        <figure>
          <table>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th style={{ textAlign: 'center' }}>回答済み</th>
                <th style={{ textAlign: 'center' }}>正解数</th>
                <th style={{ textAlign: 'center' }}>不正解数</th>
                <th style={{ textAlign: 'center' }}>正答率</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map(stat => (
                <tr key={stat.category}>
                  <td>{stat.category}</td>
                  <td style={{ textAlign: 'center' }}>
                    {stat.answered} / {stat.totalQuestions}
                  </td>
                  <td style={{ textAlign: 'center', color: '#28a745' }}>{stat.correct}</td>
                  <td style={{ textAlign: 'center', color: '#dc3545' }}>{stat.incorrect}</td>
                  <td style={{ textAlign: 'center' }}>
                    <strong>{stat.accuracy}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </article>

      {/* Incorrect Questions */}
      {incorrectQuestions.length > 0 && (
        <article style={{ marginBottom: '2rem' }}>
          <header><h3>間違えた問題</h3></header>
          {incorrectQuestions.map(({ question, progress }) => (
            <details key={question.id} style={{ marginBottom: '0.5rem' }}>
              <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{question.question}</span>
                <span style={{ display: 'flex', gap: '0.25rem' }}>
                  <span className="badge badge-success">正解 {progress.correctCount}</span>
                  <span className="badge badge-danger">不正解 {progress.incorrectCount}</span>
                </span>
              </summary>
              <p style={{ marginBottom: '0.5rem', color: 'var(--muted-color)' }}>
                <small>カテゴリ：{question.category}</small>
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>正しい答え：</strong> {question.choices[question.correctAnswer]}
              </p>
            </details>
          ))}
        </article>
      )}

      {/* Action Buttons */}
      <div className="grid grid-3">
        <Link href="/" role="button">
          ホームに戻る
        </Link>
        <Link href="/history" role="button" className="secondary">
          学習履歴を表示
        </Link>
        <button
          className="contrast"
          onClick={handleClearProgress}
        >
          進捗をリセット
        </button>
      </div>
    </>
  );
}
